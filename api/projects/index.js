"use strict";
const { requireAuth, cors } = require("../_shared/auth");
const { listAll, getOne, upsert, remove } = require("../_shared/db");

const TABLE = "Projects";
const PK    = "project";

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
      const projects = rows.map(rowToProject).sort((a, b) => Number(a.id) - Number(b.id));
      context.res = { status: 200, headers: h, body: projects };

    } else if (req.method === "GET" && id) {
      const row = await getOne(TABLE, PK, id);
      context.res = { status: 200, headers: h, body: rowToProject(row) };

    } else if (req.method === "POST") {
      const p = req.body || {};
      const rowKey = String(p.id || Date.now());
      await upsert(TABLE, projectToRow({ ...p, id: rowKey }));
      context.res = { status: 201, headers: h, body: { ...p, id: rowKey } };

    } else if (req.method === "PUT" && id) {
      const existing = await getOne(TABLE, PK, id).catch(() => ({}));
      const merged = { ...existing, ...req.body, id };
      await upsert(TABLE, projectToRow(merged));
      context.res = { status: 200, headers: h, body: rowToProject(projectToRow(merged)) };

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

function projectToRow(p) {
  return {
    partitionKey: PK,
    rowKey:       String(p.id),
    num:          p.num          || "",
    title:        p.title        || "",
    status:       p.status       || "planned",
    statusLabel:  p.statusLabel  || "Planned",
    cat:          p.cat          || "",
    desc:         p.desc         || "",
    stack:        JSON.stringify(p.stack || []),
    visible:      Boolean(p.visible),
  };
}

function rowToProject(r) {
  return {
    id:          Number(r.rowKey) || r.rowKey,
    num:         r.num,
    title:       r.title,
    status:      r.status,
    statusLabel: r.statusLabel,
    cat:         r.cat,
    desc:        r.desc,
    stack:       r.stack || [],
    visible:     r.visible,
  };
}
