"use strict";
const { requireAuth, cors } = require("../_shared/auth");
const { listAll, getOne, upsert } = require("../_shared/db");

const TABLE = "Queries";
const PK    = "query";

module.exports = async function (context, req) {
  const h  = cors();
  const id = context.bindingData.id;

  if (req.method === "OPTIONS") {
    context.res = { status: 204, headers: h, body: "" };
    return;
  }

  // Public: accept new contact submissions
  if (req.method === "POST" && !id) {
    try {
      const q = req.body || {};
      const rowKey = "q-" + Date.now();
      await upsert(TABLE, {
        partitionKey: PK,
        rowKey,
        name:      q.name      || "",
        email:     q.email     || "",
        company:   q.company   || "",
        subject:   q.subject   || "",
        body:      q.body      || q.message || "",
        tag:       "Lead",
        budget:    q.budget    || "",
        unread:    true,
        time:      "just now",
        createdAt: new Date().toISOString(),
      });
      context.res = { status: 201, headers: h, body: { ok: true } };
    } catch (e) {
      context.res = { status: 500, headers: h, body: { error: e.message } };
    }
    return;
  }

  // All other methods require auth
  if (!requireAuth(context, req)) return;

  try {
    if (req.method === "GET" && !id) {
      const rows = await listAll(TABLE);
      const queries = rows.map(rowToQuery).sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
      context.res = { status: 200, headers: h, body: queries };

    } else if (req.method === "GET" && id) {
      const row = await getOne(TABLE, PK, id);
      context.res = { status: 200, headers: h, body: rowToQuery(row) };

    } else if (req.method === "PUT" && id) {
      const existing = await getOne(TABLE, PK, id).catch(() => ({}));
      const merged = { ...existing, ...req.body };
      await upsert(TABLE, { partitionKey: PK, rowKey: id, ...merged });
      context.res = { status: 200, headers: h, body: rowToQuery({ partitionKey: PK, rowKey: id, ...merged }) };

    } else {
      context.res = { status: 405, headers: h, body: { error: "Method not allowed" } };
    }
  } catch (e) {
    context.res = { status: 500, headers: h, body: { error: e.message } };
  }
};

function rowToQuery(r) {
  return {
    id:        r.rowKey,
    name:      r.name,
    email:     r.email,
    company:   r.company,
    subject:   r.subject,
    body:      r.body,
    tag:       r.tag,
    budget:    r.budget,
    unread:    r.unread,
    time:      r.time,
    createdAt: r.createdAt,
  };
}
