/* =====================================================
   RANK MATH — REAL on-page SEO analysis engine.
   Pure, deterministic, framework-free. No mock scores:
   every number is computed from the actual parsed HTML
   (or pasted content) against a focus keyword.
   Exposed as window.RankMath.
   ===================================================== */
(function () {
  "use strict";

  var SITE_HOSTS = ["meetpatel.dev", "www.meetpatel.dev"];

  // Power / sentiment words used by the title-readability tests.
  var POWER_WORDS = ("instantly,actually,proven,guaranteed,effortless,ultimate,essential,powerful,secret," +
    "remarkable,surprising,exclusive,free,now,today,fast,simple,easy,complete,definitive,practical,real," +
    "step-by-step,no-fluff,honest,exact,better,best,smart,modern,stop,avoid,boost,cut,save,build,master," +
    "without,never,always,why,how,what").split(",");
  var SENTIMENT = ("good,great,better,best,faster,fast,clean,smart,strong,clear,fail,slow,broken,wrong," +
    "waste,fix,wins,win,gains,gain,risk,danger,trap,mistake").split(",");

  /* ---------------- text utilities ---------------- */
  function norm(s) {
    return (s || "").toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/[^a-z0-9'\s-]/g, " ").replace(/\s+/g, " ").trim();
  }
  function wordList(text) { return norm(text).split(" ").filter(Boolean); }
  function wordCount(text) { return wordList(text).length; }

  // Count phrase occurrences (whole-phrase, order-sensitive, punctuation-insensitive).
  function countPhrase(text, phrase) {
    var p = norm(phrase);
    if (!p) return 0;
    var t = " " + norm(text) + " ";
    var needle = " " + p + " ";
    var i = 0, c = 0;
    while ((i = t.indexOf(needle, i)) !== -1) { c++; i += needle.length - 1; }
    return c;
  }
  function hasPhrase(text, phrase) { return countPhrase(text, phrase) > 0; }

  function countSyllables(w) {
    w = w.toLowerCase().replace(/[^a-z]/g, "");
    if (!w) return 0;
    if (w.length <= 3) return 1;
    w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
    var m = w.match(/[aeiouy]{1,2}/g);
    return m ? m.length : 1;
  }
  function flesch(text) {
    var sentences = (text.match(/[.!?]+(\s|$)/g) || []).length || 1;
    var ws = wordList(text);
    var wc = ws.length || 1;
    var syl = 0;
    for (var i = 0; i < ws.length; i++) syl += countSyllables(ws[i]);
    var score = 206.835 - 1.015 * (wc / sentences) - 84.6 * (syl / wc);
    return Math.max(0, Math.min(100, Math.round(score)));
  }
  function fleschGrade(s) {
    if (s >= 70) return "Easy to read";
    if (s >= 60) return "Fairly easy";
    if (s >= 50) return "Fairly difficult";
    return "Difficult";
  }

  /* ---------------- HTML → normalized page ---------------- */
  function linkKind(href) {
    if (!href) return null;
    var h = href.trim();
    if (h === "" || h[0] === "#") return "anchor";
    if (h.indexOf("mailto:") === 0 || h.indexOf("tel:") === 0) return "anchor";
    if (h[0] === "/" || h[0] === ".") return "internal";
    var m = h.match(/^https?:\/\/([^\/]+)/i);
    if (!m) return "internal"; // relative
    var host = m[1].toLowerCase();
    for (var i = 0; i < SITE_HOSTS.length; i++) if (host.indexOf(SITE_HOSTS[i]) !== -1) return "internal";
    return "external";
  }

  function extract(html) {
    var doc = new DOMParser().parseFromString(html, "text/html");
    var meta = function (sel) { var el = doc.querySelector(sel); return el ? (el.getAttribute("content") || "") : ""; };

    var seoTitle = meta('meta[property="og:title"]') || doc.title || "";
    var metaDesc = meta('meta[name="description"]') || meta('meta[property="og:description"]') || "";
    var canonical = (doc.querySelector('link[rel="canonical"]') || {}).href || "";

    // content root — prefer the semantic article body, then main, then a prose block
    var root = doc.querySelector("article") || doc.querySelector("main") || doc.querySelector(".prose") || doc.body;

    // detect a table of contents (in or around the content)
    var toc = !!(doc.querySelector('[class*="toc"], nav[class*="ptm"], .ptm, [aria-label*="contents" i], [aria-label*="Table of contents" i]'));
    if (!toc) {
      var navs = doc.querySelectorAll("nav");
      for (var n = 0; n < navs.length; n++) {
        if (navs[n].querySelectorAll('a[href^="#"]').length >= 3) { toc = true; break; }
      }
    }

    // clean clone for text extraction (drop nav/scripts/styles)
    var clone = root.cloneNode(true);
    clone.querySelectorAll("script,style,nav,.ptm,[class*='toc']").forEach(function (e) { e.remove(); });

    var headings = [].map.call(root.querySelectorAll("h2,h3,h4"), function (h) { return h.textContent.trim(); }).filter(Boolean);
    // count real <img> plus the site's <image-slot> custom elements (its hero/OG images)
    var imgs = [].map.call(root.querySelectorAll("img, image-slot"), function (im) {
      return { alt: im.getAttribute("alt") || im.getAttribute("placeholder") || im.getAttribute("aria-label") || "" };
    });
    var paras = [].map.call(clone.querySelectorAll("p"), function (p) { return p.textContent.trim(); }).filter(function (t) { return t.length > 0; });

    var links = [].map.call(root.querySelectorAll("a[href]"), function (a) {
      return { kind: linkKind(a.getAttribute("href")), nofollow: /nofollow/i.test(a.getAttribute("rel") || "") };
    });

    var h1 = doc.querySelector("h1");
    var contentText = clone.textContent.replace(/\s+/g, " ").trim();

    return {
      seoTitle: seoTitle, metaDesc: metaDesc, canonical: canonical, h1: h1 ? h1.textContent.trim() : "",
      headings: headings, images: imgs, paragraphs: paras, links: links, toc: toc, contentText: contentText,
    };
  }

  /* ---------------- the test battery ---------------- */
  // Each test → { id, cat, label, status:'ok'|'warn'|'fail', got, max, tip }
  function runTests(page, keyword, url) {
    var kw = (keyword || "").trim();
    var hasKw = kw.length > 0;
    var content = page.contentText || "";
    var wc = wordCount(content);
    var title = page.seoTitle || "";
    var titleN = norm(title);
    var slug = (url || "").toLowerCase();

    // keyword stats
    var kwInContent = countPhrase(content, kw);
    var kwTokens = wordList(kw).length || 1;
    var density = wc ? ((kwInContent * kwTokens) / wc) * 100 : 0;

    // first 10% of content (min 100 words)
    var ws = wordList(content);
    var slice = ws.slice(0, Math.max(100, Math.ceil(ws.length * 0.1))).join(" ");
    var kwEarly = hasPhrase(slice, kw);

    var kwInHeads = page.headings.filter(function (h) { return hasPhrase(h, kw); }).length;
    var kwInAlt = page.images.filter(function (im) { return hasPhrase(im.alt, kw); }).length;
    var imgWithAlt = page.images.filter(function (im) { return im.alt.trim().length > 0; }).length;

    var ext = page.links.filter(function (l) { return l.kind === "external"; });
    var extDofollow = ext.filter(function (l) { return !l.nofollow; });
    var internal = page.links.filter(function (l) { return l.kind === "internal"; });

    // title position of keyword
    var titlePos = hasKw ? titleN.indexOf(norm(kw)) : -1;
    var titleHalf = titleN.split(" ").length;

    // power / sentiment in title
    var titleWords = wordList(title);
    var hasPower = titleWords.some(function (w) { return POWER_WORDS.indexOf(w) !== -1 || SENTIMENT.indexOf(w) !== -1; });
    var titleHasNum = /\d/.test(title);

    // short paragraphs — fraction over 150 words
    var longParas = page.paragraphs.filter(function (p) { return wordCount(p) > 150; }).length;
    var totalParas = page.paragraphs.length || 1;
    var longFrac = longParas / totalParas;

    var T = [];
    function add(id, cat, max, status, got, label, tip) { T.push({ id: id, cat: cat, max: max, status: status, got: got, label: label, tip: tip }); }
    function passFail(cond, full) { return cond ? full : 0; }
    function st(got, max) { return got >= max ? "ok" : got > 0 ? "warn" : "fail"; }

    /* ---- Basic SEO (50) ---- */
    (function () {
      var g = passFail(hasKw && hasPhrase(title, kw), 12);
      add("kw-title", "Basic SEO", 12, st(g, 12), g, "Focus keyword in the SEO title",
        g ? "“" + kw + "” is present in the title." : "Add “" + kw + "” to the SEO title, ideally near the start.");
    })();
    (function () {
      var g = passFail(hasKw && hasPhrase(page.metaDesc, kw), 8);
      add("kw-meta", "Basic SEO", 8, st(g, 8), g, "Focus keyword in the meta description",
        g ? "Keyword appears in the meta description." : "Work “" + kw + "” into the meta description naturally.");
    })();
    (function () {
      var g = passFail(hasKw && norm(slug.replace(/[-_/]/g, " ")).indexOf(norm(kw)) !== -1, 6);
      add("kw-url", "Basic SEO", 6, st(g, 6), g, "Focus keyword in the URL",
        g ? "Slug contains the keyword." : "Include the keyword (hyphenated) in the page slug.");
    })();
    (function () {
      var g = passFail(kwEarly, 8);
      add("kw-early", "Basic SEO", 8, st(g, 8), g, "Keyword near the beginning of content",
        g ? "Keyword appears in the first 10% of the copy." : "Use the keyword within the first paragraph / first 10%.");
    })();
    (function () {
      var g = passFail(kwInContent > 0, 6);
      add("kw-body", "Basic SEO", 6, st(g, 6), g, "Focus keyword in the content",
        g ? kwInContent + " exact match" + (kwInContent === 1 ? "" : "es") + " in the body." : "The exact keyword phrase does not appear in the body.");
    })();
    (function () {
      var max = 10, g;
      if (wc >= 2000) g = 10; else if (wc >= 1500) g = 8; else if (wc >= 1000) g = 6; else if (wc >= 600) g = 4; else g = Math.round((wc / 600) * 4);
      add("length", "Basic SEO", max, st(g, max), g, "Content length",
        wc + " words. " + (wc >= 1500 ? "Comprehensive." : wc >= 600 ? "Decent, aim for 1,500+ for cornerstone." : "Thin — expand toward 1,000+ words."));
    })();

    /* ---- Additional (28) ---- */
    (function () {
      var g = passFail(kwInHeads > 0, 6);
      add("kw-subhead", "Additional", 6, st(g, 6), g, "Keyword in subheadings (H2–H4)",
        g ? "In " + kwInHeads + " subheading" + (kwInHeads === 1 ? "" : "s") + "." : "Add the keyword to at least one H2/H3.");
    })();
    (function () {
      var g = passFail(kwInAlt > 0, 4);
      add("kw-alt", "Additional", 4, st(g, 4), g, "Keyword in image ALT attribute",
        page.images.length === 0 ? "No images found in the content." : g ? "Keyword found in an image ALT." : imgWithAlt + " / " + page.images.length + " images have ALT text, none with the keyword.");
    })();
    (function () {
      var max = 6, g, msg;
      if (density >= 0.75 && density <= 2.5) { g = 6; msg = "Ideal range."; }
      else if ((density >= 0.3 && density < 0.75) || (density > 2.5 && density <= 3.5)) { g = 3; msg = density > 2.5 ? "Slightly high." : "A touch low."; }
      else { g = 0; msg = density > 3.5 ? "Too high — risks keyword stuffing." : "Too low."; }
      add("density", "Additional", max, st(g, max), g, "Keyword density",
        density.toFixed(2) + "% (" + kwInContent + " / " + wc + " words). " + msg);
    })();
    (function () {
      var len = (url || "").replace(/^https?:\/\/[^\/]+/, "").length;
      var g = passFail(len > 0 && len <= 75, 3);
      add("url-len", "Additional", 3, st(g, 3), g, "URL length",
        len + " chars in the path. " + (len <= 75 ? "Concise." : "Shorten the slug."));
    })();
    (function () {
      var g = passFail(ext.length > 0, 3);
      add("ext-link", "Additional", 3, st(g, 3), g, "Links to external resources",
        ext.length + " external link" + (ext.length === 1 ? "" : "s") + ". " + (ext.length ? "" : "Cite a credible external source."));
    })();
    (function () {
      var g = passFail(extDofollow.length > 0, 2);
      add("ext-dofollow", "Additional", 2, st(g, 2), g, "At least one DoFollow external link",
        extDofollow.length ? extDofollow.length + " DoFollow external link(s)." : "External links are all nofollow / none present.");
    })();
    (function () {
      var g = passFail(internal.length > 0, 4);
      add("int-link", "Additional", 4, st(g, 4), g, "Internal links",
        internal.length + " internal link" + (internal.length === 1 ? "" : "s") + ". " + (internal.length ? "" : "Link to a related post on your site."));
    })();

    /* ---- Title Readability (12) ---- */
    (function () {
      var g = 0, msg;
      if (hasKw && titlePos === 0) { g = 5; msg = "Keyword starts the title."; }
      else if (hasKw && titlePos !== -1 && titlePos <= Math.ceil(title.length / 2)) { g = 3; msg = "Keyword is in the first half — move it earlier for max impact."; }
      else { g = 0; msg = "Move the keyword toward the start of the title."; }
      add("title-start", "Title Readability", 5, st(g, 5), g, "Keyword at the beginning of the title", msg);
    })();
    (function () {
      var g = passFail(hasPower, 4);
      add("title-sentiment", "Title Readability", 4, st(g, 4), g, "Title has a power / sentiment word",
        g ? "Emotive language present." : "Add a power word (e.g. proven, fast, exact) to lift CTR.");
    })();
    (function () {
      var g = passFail(titleHasNum, 3);
      add("title-number", "Title Readability", 3, st(g, 3), g, "Title contains a number",
        g ? "Number present." : "Titles with a number tend to earn more clicks.");
    })();

    /* ---- Content Readability (10) ---- */
    (function () {
      var g = passFail(page.toc, 3);
      add("toc", "Content Readability", 3, st(g, 3), g, "Table of contents",
        g ? "A table of contents was detected." : "Add a TOC to help long-form navigation & sitelinks.");
    })();
    (function () {
      var max = 4, g;
      if (longFrac === 0) g = 4; else if (longFrac <= 0.15) g = 3; else if (longFrac <= 0.3) g = 2; else g = 0;
      add("short-paras", "Content Readability", max, st(g, max), g, "Short paragraphs",
        longParas === 0 ? "No paragraph exceeds 150 words." : longParas + " of " + totalParas + " paragraphs are long. Break them up.");
    })();
    (function () {
      var g = passFail(page.images.length > 0, 3);
      add("assets", "Content Readability", 3, st(g, 3), g, "Content has media / images",
        page.images.length + " image" + (page.images.length === 1 ? "" : "s") + " in the article. " + (page.images.length ? "" : "Add at least one supporting visual."));
    })();

    return {
      tests: T,
      stats: {
        words: wc, density: density, kwInContent: kwInContent, kwInHeads: kwInHeads,
        flesch: flesch(content), fleschGrade: fleschGrade(flesch(content)),
        internalLinks: internal.length, externalLinks: ext.length, images: page.images.length,
        headings: page.headings.length, paragraphs: page.paragraphs.length, toc: page.toc,
      },
    };
  }

  function scoreOf(tests) {
    var got = 0, max = 0;
    tests.forEach(function (t) { got += t.got; max += t.max; });
    return Math.round(max ? (got / max) * 100 : 0);
  }

  /* ---------------- public API ---------------- */
  // analyze({ html?, page?, keyword, url, title?, metaDesc? }) → result
  function analyze(input) {
    input = input || {};
    var page;
    if (input.page) page = input.page;
    else if (typeof input.html === "string") page = extract(input.html);
    else page = { seoTitle: "", metaDesc: "", headings: [], images: [], paragraphs: [], links: [], toc: false, contentText: input.content || "" };

    // allow explicit overrides (editor mode types its own title / meta)
    if (input.title != null) page.seoTitle = input.title;
    if (input.metaDesc != null) page.metaDesc = input.metaDesc;

    var r = runTests(page, input.keyword || "", input.url || page.canonical || "");
    var score = scoreOf(r.tests);
    var passed = r.tests.filter(function (t) { return t.status === "ok"; }).length;
    return {
      score: score,
      grade: score >= 80 ? "Good" : score >= 50 ? "Needs work" : "Poor",
      tests: r.tests,
      passed: passed,
      total: r.tests.length,
      stats: r.stats,
      title: page.seoTitle, metaDesc: page.metaDesc,
    };
  }

  // Fetch a same-origin page and analyze it. Resolves even on failure (errored result).
  async function analyzeUrl(fetchPath, opts) {
    opts = opts || {};
    try {
      var res = await fetch(fetchPath, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      var html = await res.text();
      return analyze({ html: html, keyword: opts.keyword, url: opts.url || fetchPath, title: opts.title, metaDesc: opts.metaDesc });
    } catch (e) {
      return { error: String(e && e.message || e), score: null, tests: [], stats: null };
    }
  }

  window.RankMath = {
    analyze: analyze, analyzeUrl: analyzeUrl, extract: extract,
    flesch: flesch, fleschGrade: fleschGrade, wordCount: wordCount, countPhrase: countPhrase, scoreOf: scoreOf,
    CATEGORIES: ["Basic SEO", "Additional", "Title Readability", "Content Readability"],
  };
})();
