"use strict";
const { cors } = require("../_shared/auth");
const { upsert } = require("../_shared/db");

const SEED_KEY = process.env.SEED_SECRET || "seed-dev-key";

module.exports = async function (context, req) {
  const h = cors();

  if (req.method === "OPTIONS") {
    context.res = { status: 204, headers: h, body: "" };
    return;
  }

  const key = req.headers["x-seed-key"] || (req.body || {}).key;
  if (key !== SEED_KEY) {
    context.res = { status: 403, headers: h, body: { error: "Forbidden" } };
    return;
  }

  try {
    await Promise.all([...POSTS.map(seedPost), ...PROJECTS.map(seedProject), ...QUERIES.map(seedQuery), ...MEDIA.map(seedMedia)]);
    context.res = { status: 200, headers: h, body: { ok: true, seeded: { posts: POSTS.length, projects: PROJECTS.length, queries: QUERIES.length, media: MEDIA.length } } };
  } catch (e) {
    context.res = { status: 500, headers: h, body: { error: e.message } };
  }
};

async function seedPost(p) {
  await upsert("Posts", {
    partitionKey: "post", rowKey: p.slug || p.id,
    title: p.title || "", category: p.category || "", cat: p.cat || "",
    stage: p.stage || "discover", keyword: p.keyword || "",
    auto: Boolean(p.auto), autoNote: p.autoNote || "",
    progress: Number(p.progress) || 0, seoScore: Number(p.seoScore) || 0,
    words: Number(p.words) || 0, readMin: Number(p.readMin) || 0,
    volume: p.volume || "", difficulty: Number(p.difficulty) || 0,
    intent: p.intent || "", metaTitle: p.metaTitle || "",
    metaDesc: p.metaDesc || "", imagePrompt: p.imagePrompt || "",
    hasImage: Boolean(p.hasImage), excerpt: p.excerpt || "",
    body: p.body || "", ogReady: Boolean(p.ogReady),
    updatedAt: new Date().toISOString(),
  });
}

async function seedProject(p) {
  await upsert("Projects", {
    partitionKey: "project", rowKey: String(p.id),
    num: p.num || "", title: p.title || "", status: p.status || "planned",
    statusLabel: p.statusLabel || "Planned", cat: p.cat || "",
    desc: p.desc || "", stack: JSON.stringify(p.stack || []), visible: Boolean(p.visible),
  });
}

async function seedQuery(q) {
  await upsert("Queries", {
    partitionKey: "query", rowKey: q.id,
    name: q.name || "", email: q.email || "", company: q.company || "",
    subject: q.subject || "", body: q.body || "", tag: q.tag || "",
    budget: q.budget || "", unread: Boolean(q.unread),
    time: q.time || "", createdAt: new Date().toISOString(),
  });
}

async function seedMedia(m) {
  await upsert("Media", {
    partitionKey: "media", rowKey: m.id,
    name: m.name || "", kind: m.kind || "needed", post: m.post || "",
    size: m.size || "", dim: m.dim || "", cat: m.cat || "", url: m.url || "",
    uploadedAt: new Date().toISOString(),
  });
}

// Seed data mirrors the original prototype data
const POSTS = [
  { id: "p-azure-cost", slug: "reduce-azure-costs", title: "How I Cut an Azure Bill 38% Without Touching a Single App", category: "cloud", cat: "Cloud", stage: "review", keyword: "reduce azure costs", auto: false, progress: 100, seoScore: 86, words: 1840, readMin: 8, volume: "8.1K", difficulty: 34, intent: "Informational", metaTitle: "How to Reduce Azure Costs by 38% (Real Audit Walkthrough)", metaDesc: "A practical, no-fluff walkthrough of the exact Azure cost audit I ran: idle resources, rightsizing, reserved instances and the Power BI report that tracks it.", imagePrompt: "Editorial wide-angle hero, soft daylight: a clean developer desk with a laptop showing a descending green cost line-chart, a small potted plant, muted emerald and warm-white palette, shallow depth of field, no text, no logos, premium tech-blog aesthetic, 1600x900.", hasImage: false, excerpt: "Companies waste 30%+ of Azure spend on idle resources. Here's the repeatable audit I run.", body: null, ogReady: true },
  { id: "p-power-bi-dax", slug: "dax-patterns-financial-dashboards", title: "7 DAX Patterns That Made My Financial Dashboards Actually Fast", category: "bi", cat: "Power BI", stage: "review", keyword: "dax patterns power bi", auto: false, progress: 100, seoScore: 79, words: 2120, readMin: 9, volume: "5.4K", difficulty: 41, intent: "Informational", metaTitle: "7 DAX Patterns for Faster Power BI Financial Dashboards", metaDesc: "Time-intelligence, rolling averages and variance done right. The DAX measures I reuse on every financial model, with the gotchas that slow reports down.", imagePrompt: "Overhead flat-lay of an analyst workspace, dark slate desk, a monitor edge showing abstract bar + line charts in emerald and amber, a notebook with formula sketches, dramatic side light, no readable text, 1600x900.", hasImage: false, excerpt: "The handful of DAX measures I reuse on every financial model.", body: null, ogReady: true },
  { id: "p-rag-eval", slug: "evaluate-rag-pipeline", title: "Evaluating RAG Pipelines Without a PhD: A Practical Scorecard", category: "ai", cat: "AI", stage: "seo", keyword: "evaluate rag pipeline", auto: true, autoNote: "Scoring on-page SEO…", progress: 72, seoScore: 64, words: 1610, readMin: 7, volume: "3.2K", difficulty: 38, intent: "Informational", metaTitle: "", metaDesc: "", imagePrompt: "", hasImage: false, excerpt: "A lightweight scorecard for judging retrieval quality before it hits production.", body: null, ogReady: false },
];

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
  { id: 10, num: "10", title: "PodcastBrain · Audio to SEO Blog", status: "planned", statusLabel: "Planned", cat: "AI", desc: "Transcribes + summarizes + publishes episodes", stack: ["Whisper", "Azure OpenAI", "WP REST"], visible: false },
  { id: 11, num: "11", title: "Inventory Forecasting", status: "planned", statusLabel: "Planned", cat: "AI", desc: "Prophet-based forecast tool with web UI", stack: ["Python", "Prophet", "SQL"], visible: false },
  { id: 12, num: "12", title: "Lead Scoring Engine", status: "planned", statusLabel: "Planned", cat: "AI", desc: "ML scores + routes SMB sales leads", stack: ["Python", "Azure ML", "HubSpot"], visible: false },
];

const QUERIES = [
  { id: "q1", name: "Sarah Whitman", email: "s.whitman@northbridge.ca", company: "Northbridge Analytics", subject: "Power BI embedded for a 40-person team", time: "12m", unread: true, tag: "Lead", budget: "$8-12K", body: "Hi Meet, found your Power BI dashboard write-up and it's exactly the approach we need." },
  { id: "q2", name: "Devon Park", email: "devon@parklabs.io", company: "Park Labs", subject: "Azure cost audit: quick question", time: "1h", unread: true, tag: "Lead", budget: "TBD", body: "Read your Azure cost piece. Our monthly spend jumped 60% after a migration." },
  { id: "q3", name: "Aleksandra Nowak", email: "a.nowak@gmail.com", company: "", subject: "NBCC capstone collaboration?", time: "5h", unread: true, tag: "Networking", budget: "", body: "Hi! I'm also at NBCC (analytics, graduating Dec 2026)." },
  { id: "q4", name: "Marcus Lee", email: "marcus@brightpath.dev", company: "Brightpath", subject: "Freelance WordPress + SEO build", time: "1d", unread: false, tag: "Lead", budget: "$3-5K", body: "We need a fast, SEO-clean marketing site." },
  { id: "q5", name: "Recruiter · TD Bank", email: "talent@td.com", company: "TD Bank", subject: "Data Analyst role · Saint John", time: "2d", unread: false, tag: "Recruiter", budget: "Full-time", body: "Hi Meet, your profile is a strong match for an IT Business Analyst opening." },
  { id: "q6", name: "Priya Sharma", email: "priya.s@datco.in", company: "DatCo", subject: "Telecom churn methodology", time: "3d", unread: false, tag: "Networking", budget: "", body: "Your churn analysis across Airtel/BSNL/Jio was thorough." },
];

const MEDIA = [
  { id: "m1", name: "azure-cost-hero.png", kind: "needed", post: "Azure Cost", size: "", dim: "1600x900", cat: "cloud", url: "" },
  { id: "m2", name: "dax-patterns-hero.png", kind: "needed", post: "DAX Patterns", size: "", dim: "1600x900", cat: "bi", url: "" },
  { id: "m3", name: "podcast-platform-og.png", kind: "image", post: "Podcast SEO", size: "284 KB", dim: "1200x630", cat: "seo", url: "" },
  { id: "m4", name: "ats-resume-hero.png", kind: "image", post: "ATS Resume", size: "412 KB", dim: "1600x900", cat: "ai", url: "" },
  { id: "m5", name: "ats-resume-og.png", kind: "image", post: "ATS Resume", size: "198 KB", dim: "1200x630", cat: "ai", url: "" },
  { id: "m6", name: "powerbi-dash-hero.png", kind: "image", post: "Power BI", size: "528 KB", dim: "1600x900", cat: "bi", url: "" },
  { id: "m7", name: "powerbi-dash-og.png", kind: "image", post: "Power BI", size: "221 KB", dim: "1200x630", cat: "bi", url: "" },
  { id: "m8", name: "meet-headshot.png", kind: "image", post: "Brand", size: "340 KB", dim: "800x800", cat: "seo", url: "" },
];
