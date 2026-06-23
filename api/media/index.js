"use strict";
const { requireAuth, cors } = require("../_shared/auth");
const { listAll, getOne, upsert, remove } = require("../_shared/db");
const { BlobServiceClient } = require("@azure/storage-blob");

const TABLE   = "Media";
const PK      = "media";
const CONTAINER = "uploads";

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
      context.res = { status: 200, headers: h, body: rows.map(rowToMedia) };

    } else if (req.method === "GET" && id) {
      const row = await getOne(TABLE, PK, id);
      context.res = { status: 200, headers: h, body: rowToMedia(row) };

    } else if (req.method === "POST") {
      // Expects JSON body with base64-encoded file or just metadata registration
      const m = req.body || {};
      const rowKey = "m-" + Date.now();

      let url = m.url || "";

      // If base64 content provided, upload to Blob Storage
      if (m.content && m.name && process.env.AZURE_STORAGE_CONNECTION_STRING) {
        const blobService = BlobServiceClient.fromConnectionString(
          process.env.AZURE_STORAGE_CONNECTION_STRING
        );
        const container = blobService.getContainerClient(CONTAINER);
        await container.createIfNotExists({ access: "blob" });
        const blob = container.getBlockBlobClient(m.name);
        const buffer = Buffer.from(m.content, "base64");
        await blob.upload(buffer, buffer.length, {
          blobHTTPHeaders: { blobContentType: m.contentType || "image/png" },
        });
        url = blob.url;
      }

      const entity = {
        partitionKey: PK,
        rowKey,
        name:      m.name      || "",
        kind:      url ? "image" : "needed",
        post:      m.post      || "",
        size:      m.size      || "",
        dim:       m.dim       || "",
        cat:       m.cat       || "",
        url,
        uploadedAt: new Date().toISOString(),
      };
      await upsert(TABLE, entity);
      context.res = { status: 201, headers: h, body: rowToMedia({ ...entity }) };

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

function rowToMedia(r) {
  return {
    id:         r.rowKey,
    name:       r.name,
    kind:       r.kind,
    post:       r.post,
    size:       r.size,
    dim:        r.dim,
    cat:        r.cat,
    url:        r.url,
    uploadedAt: r.uploadedAt,
  };
}
