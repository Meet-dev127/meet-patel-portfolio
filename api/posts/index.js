"use strict";
const { requireAuth, cors } = require("../_shared/auth");
const { listAll, getOne, upsert, remove } = require("../_shared/db");

const TABLE = "Posts";
const PK    = "post";

module.exports = async function (context, req) {
  const h  = cors();
  const id = context.bindingData.id;

  if (req.method === "OPTIONS") {
    context.res = { status: 204, headers: h, body: "" };
    return;
  }

  if (!requireAuth(context, req)) return;

  try {
    if (req.method === "GET" && !id) {
      const rows = await listAll(TABLE);
      const posts = rows.map(rowToPost).sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
      context.res = { status: 200, headers: h, body: posts };

    } else if (req.method === "GET" && id) {
      const row = await getOne(TABLE, PK, id);
      context.res = { status: 200, headers: h, body: rowToPost(row) };

    } else if (req.method === "POST") {
      const post = req.body || {};
      const slug = post.slug || slugify(post.title || "untitled-" + Date.now());
      await upsert(TABLE, postToRow({ ...post, slug }));
      context.res = { status: 201, headers: h, body: { ...post, slug } };

    } else if (req.method === "PUT" && id) {
      const existing = await getOne(TABLE, PK, id).catch(() => ({}));
      const merged = { ...existing, ...req.body, slug: id };
      await upsert(TABLE, postToRow(merged));
      context.res = { status: 200, headers: h, body: rowToPost(postToRow(merged)) };

    } else if (req.method === "DELETE" && id) {
      await remove(TABLE, PK, id);
      context.res = { status: 204, headers: h, body: "" };

    } else {
      context.res = { status: 405, headers: h, body: { error: "Method not allowed" } };
    }
  } catch (e) {
    context.res = { status: 500, headers: h, body: { error: e.message } };
  }
};

function slugify(t) {
  return String(t).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function postToRow(p) {
  return {
    partitionKey: PK,
    rowKey: p.slug,
    title:       p.title       || "",
    category:    p.category    || "",
    cat:         p.cat         || "",
    stage:       p.stage       || "discover",
    keyword:     p.keyword     || "",
    auto:        Boolean(p.auto),
    autoNote:    p.autoNote    || "",
    progress:    Number(p.progress)  || 0,
    seoScore:    Number(p.seoScore)  || 0,
    words:       Number(p.words)     || 0,
    readMin:     Number(p.readMin)   || 0,
    volume:      p.volume      || "",
    difficulty:  Number(p.difficulty) || 0,
    intent:      p.intent      || "",
    metaTitle:   p.metaTitle   || "",
    metaDesc:    p.metaDesc    || "",
    imagePrompt: p.imagePrompt || "",
    hasImage:    Boolean(p.hasImage),
    excerpt:     p.excerpt     || "",
    body:        p.body        || "",
    ogReady:     Boolean(p.ogReady),
    updatedAt:   new Date().toISOString(),
  };
}

function rowToPost(r) {
  return {
    id:          r.rowKey,
    slug:        r.rowKey,
    title:       r.title,
    category:    r.category,
    cat:         r.cat,
    stage:       r.stage,
    keyword:     r.keyword,
    auto:        r.auto,
    autoNote:    r.autoNote,
    progress:    r.progress,
    seoScore:    r.seoScore,
    words:       r.words,
    readMin:     r.readMin,
    volume:      r.volume,
    difficulty:  r.difficulty,
    intent:      r.intent,
    metaTitle:   r.metaTitle,
    metaDesc:    r.metaDesc,
    imagePrompt: r.imagePrompt,
    hasImage:    r.hasImage,
    excerpt:     r.excerpt,
    body:        r.body,
    ogReady:     r.ogReady,
    updated:     r.updatedAt,
    updatedAt:   r.updatedAt,
  };
}
