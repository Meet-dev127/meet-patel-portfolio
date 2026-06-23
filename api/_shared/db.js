"use strict";
const { TableClient, TableServiceClient } = require("@azure/data-tables");

const CONN = process.env.AZURE_STORAGE_CONNECTION_STRING;

function client(table) {
  return TableClient.fromConnectionString(CONN, table);
}

async function ensureTable(table) {
  try {
    const svc = TableServiceClient.fromConnectionString(CONN);
    await svc.createTable(table);
  } catch (e) {
    if (e.statusCode !== 409) throw e; // 409 = already exists, that's fine
  }
}

async function listAll(table) {
  await ensureTable(table);
  const c = client(table);
  const rows = [];
  for await (const e of c.listEntities()) {
    rows.push(stripMeta(e));
  }
  return rows;
}

async function getOne(table, partitionKey, rowKey) {
  const c = client(table);
  const e = await c.getEntity(partitionKey, rowKey);
  return stripMeta(e);
}

async function upsert(table, entity) {
  await ensureTable(table);
  const c = client(table);
  await c.upsertEntity(entity, "Replace");
}

async function remove(table, partitionKey, rowKey) {
  const c = client(table);
  await c.deleteEntity(partitionKey, rowKey);
}

function stripMeta(e) {
  const { partitionKey, rowKey, etag, timestamp, ...rest } = e;
  // parse any JSON-string fields back to their original type
  const out = { partitionKey, rowKey };
  for (const [k, v] of Object.entries(rest)) {
    if (typeof v === "string" && (v.startsWith("[") || v.startsWith("{"))) {
      try { out[k] = JSON.parse(v); continue; } catch {}
    }
    out[k] = v;
  }
  return out;
}

module.exports = { listAll, getOne, upsert, remove };
