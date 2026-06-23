/* =====================================================
   ADMIN DATA — mock content store for the prototype.
   Mirrors the real public site (3 live posts, 12+ project
   roadmap) plus an automation pipeline in flight.
   ===================================================== */
(function () {

  // ---- Pipeline stages (the automation you described) ----
  const STAGES = [
    { id: "discover",  name: "Discover",    tag: "auto",   icon: "radar",    desc: "Scan the web for trending topics in your niche." },
    { id: "outline",   name: "Plan",        tag: "auto",   icon: "list",     desc: "Build a search-intent outline + angle." },
    { id: "draft",     name: "Draft",       tag: "auto",   icon: "pen",      desc: "Write a full draft from profile.md context." },
    { id: "humanize",  name: "Humanize",    tag: "auto",   icon: "sparkle",  desc: "De-robotify: vary cadence, add voice." },
    { id: "seo",       name: "SEO",         tag: "auto",   icon: "gauge",    desc: "Score on-page SEO, meta, keywords, OG tags." },
    { id: "image",     name: "Image prompt",tag: "auto",   icon: "image",    desc: "Generate the cover-image prompt." },
    { id: "review",    name: "Review",      tag: "manual", icon: "eye",      desc: "YOU: read it, drop the image, publish." },
    { id: "published", name: "Published",   tag: "auto",   icon: "globe",    desc: "Live on the public site." },
  ];

  // ---- Posts moving through (and out of) the pipeline ----
  const POSTS = [
    {
      id: "p-azure-cost",
      title: "How I Cut an Azure Bill 38% Without Touching a Single App",
      category: "cloud", cat: "Cloud",
      stage: "review",
      keyword: "reduce azure costs",
      auto: false,
      progress: 100,
      updated: "4 min ago",
      seoScore: 86,
      words: 1840, readMin: 8,
      volume: "8.1K", difficulty: 34, intent: "Informational",
      metaTitle: "How to Reduce Azure Costs by 38% (Real Audit Walkthrough)",
      metaDesc: "A practical, no-fluff walkthrough of the exact Azure cost audit I ran: idle resources, rightsizing, reserved instances and the Power BI report that tracks it.",
      slug: "reduce-azure-costs",
      imagePrompt: "Editorial wide-angle hero, soft daylight: a clean developer desk with a laptop showing a descending green cost line-chart, a small potted plant, muted emerald and warm-white palette, shallow depth of field, no text, no logos, premium tech-blog aesthetic, 1600x900.",
      hasImage: false,
      excerpt: "Companies waste 30%+ of Azure spend on idle resources. Here's the repeatable audit I run.",
      body: null,
      ogReady: true,
    },
    {
      id: "p-power-bi-dax",
      title: "7 DAX Patterns That Made My Financial Dashboards Actually Fast",
      category: "bi", cat: "Power BI",
      stage: "review",
      keyword: "dax patterns power bi",
      auto: false,
      progress: 100,
      updated: "26 min ago",
      seoScore: 79,
      words: 2120, readMin: 9,
      volume: "5.4K", difficulty: 41, intent: "Informational",
      metaTitle: "7 DAX Patterns for Faster Power BI Financial Dashboards",
      metaDesc: "Time-intelligence, rolling averages and variance done right. The DAX measures I reuse on every financial model, with the gotchas that slow reports down.",
      slug: "dax-patterns-financial-dashboards",
      imagePrompt: "Overhead flat-lay of an analyst workspace, dark slate desk, a monitor edge showing abstract bar + line charts in emerald and amber, a notebook with formula sketches, dramatic side light, no readable text, 1600x900.",
      hasImage: false,
      excerpt: "The handful of DAX measures I reuse on every financial model.",
      body: null,
      ogReady: true,
    },
    {
      id: "p-rag-eval",
      title: "Evaluating RAG Pipelines Without a PhD: A Practical Scorecard",
      category: "ai", cat: "AI",
      stage: "seo",
      keyword: "evaluate rag pipeline",
      auto: true, autoNote: "Scoring on-page SEO…",
      progress: 72,
      updated: "just now",
      seoScore: 64,
      words: 1610, readMin: 7,
      volume: "3.2K", difficulty: 38, intent: "Informational",
      metaTitle: "", metaDesc: "", slug: "evaluate-rag-pipeline",
      imagePrompt: "", hasImage: false,
      excerpt: "A lightweight scorecard for judging retrieval quality before it hits production.",
      body: null, ogReady: false,
    },
    {
      id: "p-sql-window",
      title: "SQL Window Functions, Explained With One Sales Table",
      category: "bi", cat: "Power BI",
      stage: "humanize",
      keyword: "sql window functions",
      auto: true, autoNote: "Humanizing draft…",
      progress: 48,
      updated: "just now",
      seoScore: 51,
      words: 1430, readMin: 6,
      volume: "12.7K", difficulty: 29, intent: "Informational",
      metaTitle: "", metaDesc: "", slug: "sql-window-functions",
      imagePrompt: "", hasImage: false,
      excerpt: "ROW_NUMBER, RANK, LAG and running totals, taught from a single table.",
      body: null, ogReady: false,
    },
    {
      id: "p-pydantic",
      title: "Why I Validate Every API Payload With Pydantic Now",
      category: "ai", cat: "AI",
      stage: "draft",
      keyword: "pydantic validation",
      auto: true, autoNote: "Writing draft…",
      progress: 30,
      updated: "just now",
      seoScore: null,
      words: 0, readMin: 0,
      volume: "2.1K", difficulty: 22, intent: "Informational",
      metaTitle: "", metaDesc: "", slug: "pydantic-validation",
      imagePrompt: "", hasImage: false,
      excerpt: "Type-safe payloads stopped a whole class of production bugs.",
      body: null, ogReady: false,
    },
    {
      id: "p-nbpnp",
      title: "The NB Graduate Stream, Demystified for International Students",
      category: "seo", cat: "SEO",
      stage: "outline",
      keyword: "nb graduate stream nbpnp",
      auto: true, autoNote: "Building outline…",
      progress: 18,
      updated: "2 min ago",
      seoScore: null, words: 0, readMin: 0,
      volume: "6.6K", difficulty: 31, intent: "Informational",
      metaTitle: "", metaDesc: "", slug: "nb-graduate-stream",
      imagePrompt: "", hasImage: false,
      excerpt: "A clear, current explainer for the NBPNP graduate pathway.",
      body: null, ogReady: false,
    },
    {
      id: "p-vitals",
      title: "Core Web Vitals in 2026: What Still Moves Rankings",
      category: "seo", cat: "SEO",
      stage: "discover",
      keyword: "core web vitals 2026",
      auto: true, autoNote: "Queued from Trend Radar",
      progress: 6,
      updated: "8 min ago",
      seoScore: null, words: 0, readMin: 0,
      volume: "14.3K", difficulty: 44, intent: "Informational",
      metaTitle: "", metaDesc: "", slug: "core-web-vitals-2026",
      imagePrompt: "", hasImage: false,
      excerpt: "INP replaced FID a while ago. Here's what the data says matters now.",
      body: null, ogReady: false,
    },
    // already live (from the real public site)
    {
      id: "p-podcast", title: "How I Built an SEO-Optimized Podcast Review Platform",
      category: "seo", cat: "SEO", stage: "published", auto: false, progress: 100,
      updated: "3 days ago", seoScore: 98, words: 1871, readMin: 9,
      keyword: "podcast review platform", volume: "4.9K", difficulty: 36, intent: "Informational",
      metaTitle: "Podcast Review Platform SEO: How I Built One That Hit 60,000 Visits/Month", hasImage: true, ogReady: true,
      excerpt: "From domain structure to AudioObject schema, a complete walkthrough.", slug: "podcast-review-platform-seo",
      views: "1.2K", rank: 4,
    },
    {
      id: "p-ats", title: "ATS Resume Optimization: How I Automated It with GPT-4",
      category: "ai", cat: "AI", stage: "published", auto: false, progress: 100,
      updated: "1 week ago", seoScore: 98, words: 1897, readMin: 9,
      keyword: "ats resume optimizer", volume: "9.8K", difficulty: 42, intent: "Informational",
      metaTitle: "ATS Resume Optimizer: How I Built a GPT-4 Pipeline That Beats Resume Bots", hasImage: true, ogReady: true,
      excerpt: "I built a GPT-4 pipeline that scores resumes against job descriptions.", slug: "ats-resume-optimizer-gpt4",
      views: "3.4K", rank: 2,
    },
    {
      id: "p-powerbi", title: "How to Build a Power BI Dashboard for Financial Data",
      category: "bi", cat: "Power BI", stage: "published", auto: false, progress: 100,
      updated: "2 weeks ago", seoScore: 98, words: 1785, readMin: 9,
      keyword: "power bi financial dashboard", volume: "11.2K", difficulty: 39, intent: "Informational",
      metaTitle: "Power BI Financial Dashboard: How I Build One in 5 Pages Finance Teams Use", hasImage: true, ogReady: true,
      excerpt: "Star schema modelling, DAX measures and the layout decisions that matter.", slug: "power-bi-financial-dashboard",
      views: "5.1K", rank: 1,
    },
  ];

  // ---- Trend radar: auto-discovered topics ----
  const TRENDS = [
    { id: "t1", title: "INP optimization techniques", source: "Google Trends · rising", volume: "18.4K", growth: "+212%", difficulty: 33, relevance: 5, why: "Matches your SEO + web-dev authority; low competition spike.", queued: false, cat: "SEO" },
    { id: "t2", title: "Power BI vs Fabric for SMBs", source: "Reddit r/PowerBI · hot", volume: "9.1K", growth: "+88%", difficulty: 41, relevance: 5, why: "Direct fit for your Power BI Embedded project (#15).", queued: false, cat: "Power BI" },
    { id: "t3", title: "Azure OpenAI cost control", source: "Hacker News · front page", volume: "7.7K", growth: "+154%", difficulty: 37, relevance: 5, why: "Ties your Azure certs to the cost-optimizer project (#09).", queued: false, cat: "Cloud" },
    { id: "t4", title: "Scikit-learn churn modelling 2026", source: "Google Trends · breakout", volume: "5.3K", growth: "+64%", difficulty: 28, relevance: 4, why: "You shipped a real telecom churn analysis, strong proof.", queued: true, cat: "AI" },
    { id: "t5", title: "Open Canada data portal tutorials", source: "X / Twitter · trending CA", volume: "3.9K", growth: "+47%", difficulty: 24, relevance: 4, why: "Listed in your Top Skills (Open Government Data).", queued: false, cat: "SEO" },
    { id: "t6", title: "ATS resume keywords for tech 2026", source: "LinkedIn · spike", volume: "22.6K", growth: "+39%", difficulty: 46, relevance: 5, why: "Your ATS optimizer post is already ranking #2, extend the cluster.", queued: false, cat: "AI" },
  ];

  // ---- Query inbox: contact form submissions ----
  const QUERIES = [
    { id: "q1", name: "Sarah Whitman", email: "s.whitman@northbridge.ca", company: "Northbridge Analytics", subject: "Power BI embedded for a 40-person team", time: "12m", unread: true, tag: "Lead", budget: "$8–12K", body: "Hi Meet, found your Power BI dashboard write-up and it's exactly the approach we need. We have ~40 staff and can't justify Pro per-user. Could you scope a multi-tenant embedded setup with row-level security? Timeline is Q3. What would discovery look like?" },
    { id: "q2", name: "Devon Park", email: "devon@parklabs.io", company: "Park Labs", subject: "Azure cost audit: quick question", time: "1h", unread: true, tag: "Lead", budget: "TBD", body: "Read your Azure cost piece. Our monthly spend jumped 60% after a migration. Do you do one-off audits, or is it retainer only? Roughly what do idle-resource audits run?" },
    { id: "q3", name: "Aleksandra Nowak", email: "a.nowak@gmail.com", company: "·", subject: "NBCC capstone collaboration?", time: "5h", unread: true, tag: "Networking", budget: "·", body: "Hi! I'm also at NBCC (analytics, graduating Dec 2026). Loved your SBA 504 project. Would you be open to a quick coffee chat about ML project structure? No agenda, just learning." },
    { id: "q4", name: "Marcus Lee", email: "marcus@brightpath.dev", company: "Brightpath", subject: "Freelance WordPress + SEO build", time: "1d", unread: false, tag: "Lead", budget: "$3–5K", body: "We need a fast, SEO-clean marketing site (WordPress is fine). Saw you've done SEO-optimized builds since 2018. Are you taking freelance work alongside studies? 6-page site, content ready." },
    { id: "q5", name: "Recruiter · TD Bank", email: "talent@td.com", company: "TD Bank", subject: "Data Analyst role · Saint John", time: "2d", unread: false, tag: "Recruiter", budget: "Full-time", body: "Hi Meet, your profile is a strong match for an IT Business Analyst opening on our Saint John data team (NB Graduate Stream friendly). Are you open to a 20-minute intro call next week?" },
    { id: "q6", name: "Priya Sharma", email: "priya.s@datco.in", company: "DatCo", subject: "Telecom churn methodology", time: "3d", unread: false, tag: "Networking", budget: "·", body: "Your churn analysis across Airtel/BSNL/Jio was thorough. Which features ended up most predictive? Working on something similar and would value a pointer." },
  ];

  // ---- Projects manager (the 12+ roadmap) ----
  const PROJECTS = [
    { id: 1,  num: "01", title: "SBA 504 Loan ML Analysis", status: "live", statusLabel: "In progress", cat: "AI", desc: "500k+ federal loan records · predicts outcomes & regional impact", stack: ["Python", "Scikit-Learn", "Power BI"], visible: true },
    { id: 2,  num: "02", title: "Airbnb Pricing & Occupancy Dashboard", status: "live", statusLabel: "Shipped", cat: "Power BI", desc: "Cleaned public dataset, BI for hosts", stack: ["Python", "Pandas", "Power BI"], visible: true },
    { id: 3,  num: "03", title: "Telecom Customer Churn Analysis", status: "live", statusLabel: "Shipped", cat: "AI", desc: "Airtel, BSNL, Vodafone, Jio segmentation", stack: ["Python", "Matplotlib", "EDA"], visible: true },
    { id: 4,  num: "04", title: "Technomax Client Web Platforms", status: "live", statusLabel: "Shipped", cat: "Cloud", desc: "Full-stack delivery for Ontario clients", stack: ["PHP", "MySQL", "Azure"], visible: true },
    { id: 5,  num: "05", title: "Freelance Client Sites", status: "live", statusLabel: "Ongoing", cat: "SEO", desc: "SEO-optimized builds since 2018", stack: ["WordPress", "Node.js", "GA"], visible: true },
    { id: 6,  num: "06", title: "ResumeATS · AI Resume Optimizer", status: "build", statusLabel: "In build", cat: "AI", desc: "Scores resumes vs JD + rewrites weak sections", stack: ["Python", "Azure OpenAI", "spaCy"], visible: true },
    { id: 7,  num: "07", title: "AutoShare WP Plugin", status: "build", statusLabel: "In build", cat: "SEO", desc: "Cross-posts WP articles to socials", stack: ["PHP", "WP API", "OAuth"], visible: true },
    { id: 8,  num: "08", title: "SEO Audit Automation", status: "build", statusLabel: "In build", cat: "SEO", desc: "Weekly crawl, scores pages, emails report", stack: ["Python", "GSC API", "Azure"], visible: true },
    { id: 9,  num: "09", title: "Azure Cost Optimizer", status: "build", statusLabel: "In build", cat: "Cloud", desc: "Scans + flags idle resources, recommends rightsizing", stack: ["Python", "ARM API", "Power BI"], visible: true },
    { id: 10, num: "10", title: "PodcastBrain · Audio → SEO Blog", status: "planned", statusLabel: "Planned", cat: "AI", desc: "Transcribes + summarizes + publishes episodes", stack: ["Whisper", "Azure OpenAI", "WP REST"], visible: false },
    { id: 11, num: "11", title: "Inventory Forecasting", status: "planned", statusLabel: "Planned", cat: "AI", desc: "Prophet-based forecast tool with web UI", stack: ["Python", "Prophet", "SQL"], visible: false },
    { id: 12, num: "12", title: "Lead Scoring Engine", status: "planned", statusLabel: "Planned", cat: "AI", desc: "ML scores + routes SMB sales leads", stack: ["Python", "Azure ML", "HubSpot"], visible: false },
  ];

  // ---- SEO command center: keyword rankings ----
  const RANKINGS = [
    { kw: "power bi financial dashboard", pos: 1, prev: 3, change: 2, vol: "11.2K", url: "/blog/power-bi-financial-dashboard", traffic: "5.1K" },
    { kw: "ats resume optimization gpt-4", pos: 2, prev: 2, change: 0, vol: "9.8K", url: "/blog/ats-resume-optimizer-gpt4", traffic: "3.4K" },
    { kw: "podcast review platform seo", pos: 4, prev: 7, change: 3, vol: "4.9K", url: "/blog/podcast-review-platform-seo", traffic: "1.2K" },
    { kw: "azure solutions architect portfolio", pos: 6, prev: 5, change: -1, vol: "2.4K", url: "/", traffic: "880" },
    { kw: "it business analyst new brunswick", pos: 3, prev: 9, change: 6, vol: "1.1K", url: "/about", traffic: "640" },
    { kw: "dax patterns financial model", pos: 12, prev: 18, change: 6, vol: "5.4K", url: "/blog/dax-patterns-financial-dashboards", traffic: "210" },
    { kw: "telecom churn analysis python", pos: 8, prev: 8, change: 0, vol: "3.6K", url: "/projects/telecom-churn", traffic: "390" },
    { kw: "hire freelance web developer canada", pos: 14, prev: 22, change: 8, vol: "6.7K", url: "/services", traffic: "180" },
  ];

  // site-health audit
  const SITE_HEALTH = [
    { group: "Indexation", items: [
      { label: "All key pages indexed in Google", state: "ok", note: "11 / 11 indexed" },
      { label: "XML sitemap submitted & fresh", state: "ok", note: "Updated 2d ago" },
      { label: "No noindex on money pages", state: "ok", note: "Clean" },
    ]},
    { group: "Performance", items: [
      { label: "Largest Contentful Paint < 2.5s", state: "ok", note: "1.9s mobile" },
      { label: "Interaction to Next Paint < 200ms", state: "warn", note: "243ms on /blog" },
      { label: "Cumulative Layout Shift < 0.1", state: "ok", note: "0.02" },
    ]},
    { group: "On-page & schema", items: [
      { label: "Unique title + meta on every page", state: "ok", note: "11 / 11" },
      { label: "OG + Twitter cards present", state: "warn", note: "2 pages missing OG image" },
      { label: "Structured data valid (Person, Article)", state: "ok", note: "No errors" },
      { label: "Internal links to new posts", state: "bad", note: "3 orphan drafts" },
    ]},
  ];

  // ---- Media library ----
  const MEDIA = [
    { id: "m1", name: "azure-cost-hero.png", kind: "needed", post: "Azure Cost", size: "·", dim: "1600×900", cat: "cloud" },
    { id: "m2", name: "dax-patterns-hero.png", kind: "needed", post: "DAX Patterns", size: "·", dim: "1600×900", cat: "bi" },
    { id: "m3", name: "podcast-platform-og.png", kind: "image", post: "Podcast SEO", size: "284 KB", dim: "1200×630", cat: "seo" },
    { id: "m4", name: "ats-resume-hero.png", kind: "image", post: "ATS Resume", size: "412 KB", dim: "1600×900", cat: "ai" },
    { id: "m5", name: "ats-resume-og.png", kind: "image", post: "ATS Resume", size: "198 KB", dim: "1200×630", cat: "ai" },
    { id: "m6", name: "powerbi-dash-hero.png", kind: "image", post: "Power BI", size: "528 KB", dim: "1600×900", cat: "bi" },
    { id: "m7", name: "powerbi-dash-og.png", kind: "image", post: "Power BI", size: "221 KB", dim: "1200×630", cat: "bi" },
    { id: "m8", name: "meet-headshot.png", kind: "image", post: "Brand", size: "340 KB", dim: "800×800", cat: "seo" },
  ];

  // ---- Activity feed (the automation log) ----
  const ACTIVITY = [
    { ic: "globe",   color: "green",  tx: "Auto-published <b>Power BI Financial Dashboard</b> after your approval", tm: "3d" },
    { ic: "eye",     color: "warn",   tx: "<b>Azure Cost</b> moved to <b>Review</b>, needs image + publish", tm: "4m" },
    { ic: "gauge",   color: "accent", tx: "SEO pass on <b>RAG Pipelines</b> · score 64, 3 fixes suggested", tm: "just now" },
    { ic: "sparkle", color: "purple", tx: "Humanized <b>SQL Window Functions</b> draft · readability +18", tm: "1m" },
    { ic: "pen",     color: "info",   tx: "Drafted <b>Pydantic validation</b> from profile.md context", tm: "6m" },
    { ic: "radar",   color: "accent", tx: "Trend Radar found <b>4 new topics</b> above your relevance threshold", tm: "12m" },
    { ic: "list",    color: "info",   tx: "Outline built for <b>NB Graduate Stream</b> explainer", tm: "2m" },
    { ic: "mail",    color: "accent", tx: "New query from <b>Sarah Whitman</b> · tagged Lead", tm: "12m" },
  ];

  // 28-day organic clicks sparkline-ish series
  const TRAFFIC_SERIES = [42,48,45,53,60,58,66,71,69,78,74,82,88,85,93,99,96,104,110,108,117,122,119,128,134,131,142,151];

  window.ADMIN = { STAGES, POSTS, TRENDS, QUERIES, PROJECTS, RANKINGS, SITE_HEALTH, MEDIA, ACTIVITY, TRAFFIC_SERIES };
})();
