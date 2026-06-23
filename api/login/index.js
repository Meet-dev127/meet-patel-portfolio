"use strict";
const { createToken, checkCredentials, cors } = require("../_shared/auth");

module.exports = async function (context, req) {
  const h = cors();

  if (req.method === "OPTIONS") {
    context.res = { status: 204, headers: h, body: "" };
    return;
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    context.res = { status: 400, headers: h, body: { error: "email and password required" } };
    return;
  }

  if (!checkCredentials(email, password)) {
    context.res = { status: 401, headers: h, body: { error: "Invalid credentials" } };
    return;
  }

  const token = createToken(email, "Meet Patel");
  context.res = {
    status: 200,
    headers: h,
    body: { token, name: "Meet Patel", email },
  };
};
