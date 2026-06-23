"use strict";
const jwt = require("jsonwebtoken");

const SECRET        = process.env.JWT_SECRET   || "dev-secret-change-in-prod";
const ADMIN_EMAIL   = process.env.ADMIN_EMAIL  || "patelmeet20112000@gmail.com";
const ADMIN_PW      = process.env.ADMIN_PW     || "admin1234";

function createToken(email, name) {
  return jwt.sign({ email, name }, SECRET, { expiresIn: "12h" });
}

function verifyToken(token) {
  try { return jwt.verify(token, SECRET); } catch { return null; }
}

function getToken(req) {
  const h = (req.headers["authorization"] || "").trim();
  if (h.startsWith("Bearer ")) return h.slice(7);
  return null;
}

function checkCredentials(email, password) {
  return (
    String(email).trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
    password === ADMIN_PW
  );
}

function requireAuth(context, req) {
  const token = getToken(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload) {
    context.res = { status: 401, headers: cors(), body: { error: "Unauthorized" } };
    return null;
  }
  return payload;
}

function cors() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

module.exports = { createToken, verifyToken, checkCredentials, requireAuth, cors };
