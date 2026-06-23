/* =====================================================
   AUTH — client-side gate for the Operator Console.
   NOTE: this is a prototype gate (state lives in the
   browser). It is NOT server-grade security. For real
   protection the backend must enforce auth. What it does
   provide: a required login, a 12h session, logout, and a
   password-reset flow with a 6-digit OTP delivered by
   EmailJS (free, no backend) with an on-screen demo
   fallback when EmailJS is not configured yet.
   Exposed as window.Auth.
   ===================================================== */
(function () {
  "use strict";

  var K = {
    user:    "mp-auth-user",      // { email, pwHash, name }
    session: "mp-auth-session",   // { email, exp }
    otp:     "mp-auth-otp",       // { hash, exp, email, tries, verified }
    email:   "mp-auth-emailcfg",  // { serviceId, templateId, publicKey, fromName }
  };
  var DEFAULT_EMAIL = "patelmeet20112000@gmail.com";
  var DEFAULT_PW = "admin1234";
  var SESSION_MS = 1000 * 60 * 60 * 12;   // 12 hours
  var OTP_MS = 1000 * 60 * 10;            // 10 minutes

  function read(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function del(k) { try { localStorage.removeItem(k); } catch (e) {} }

  async function sha(s) {
    if (window.crypto && crypto.subtle) {
      var buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(s)));
      return Array.prototype.map.call(new Uint8Array(buf), function (b) { return b.toString(16).padStart(2, "0"); }).join("");
    }
    // tiny non-crypto fallback (very old browsers); still fine for a prototype gate
    var h = 0, str = String(s);
    for (var i = 0; i < str.length; i++) { h = (h << 5) - h + str.charCodeAt(i); h |= 0; }
    return "x" + (h >>> 0).toString(16);
  }

  async function ensureSeed() {
    if (!read(K.user)) {
      write(K.user, { email: DEFAULT_EMAIL, pwHash: await sha(DEFAULT_PW), name: "Meet Patel" });
    }
  }
  function getUser() { return read(K.user); }

  /* ---------- session ---------- */
  async function login(email, pw) {
    await ensureSeed();
    var u = getUser();
    if (!u) return { ok: false, error: "No account found." };
    if (String(email).trim().toLowerCase() !== u.email.toLowerCase()) return { ok: false, error: "Email not recognised." };
    if (await sha(pw) !== u.pwHash) return { ok: false, error: "Incorrect password." };
    write(K.session, { email: u.email, exp: Date.now() + SESSION_MS });
    return { ok: true };
  }
  function isAuthed() {
    var s = read(K.session);
    if (!s) return false;
    if (Date.now() > s.exp) { del(K.session); return false; }
    return true;
  }
  function logout() { del(K.session); }
  function sessionEmail() { var s = read(K.session); return s ? s.email : null; }

  /* ---------- OTP reset ---------- */
  function genCode() { return String(Math.floor(100000 + Math.random() * 900000)); }

  async function requestOtp(email) {
    await ensureSeed();
    var u = getUser();
    if (String(email).trim().toLowerCase() !== u.email.toLowerCase()) {
      return { ok: false, error: "That email is not on file for this account." };
    }
    var code = genCode();
    write(K.otp, { hash: await sha(code), exp: Date.now() + OTP_MS, email: u.email, tries: 0, verified: false });
    var sent = await sendEmail(u.email, code);
    return { ok: true, delivery: sent.via, devCode: sent.via === "dev" ? code : undefined, error: sent.error };
  }
  async function verifyOtp(code) {
    var o = read(K.otp);
    if (!o) return { ok: false, error: "Request a code first." };
    if (Date.now() > o.exp) { del(K.otp); return { ok: false, error: "That code expired. Request a new one." }; }
    if (o.tries >= 5) { del(K.otp); return { ok: false, error: "Too many attempts. Request a new code." }; }
    if (await sha(String(code).trim()) !== o.hash) {
      o.tries++; write(K.otp, o);
      return { ok: false, error: "Incorrect code. " + (5 - o.tries) + " attempts left." };
    }
    o.verified = true; write(K.otp, o);
    return { ok: true };
  }
  async function resetPassword(newPw) {
    var o = read(K.otp);
    if (!o || !o.verified) return { ok: false, error: "Verify the code first." };
    if (String(newPw).length < 8) return { ok: false, error: "Use at least 8 characters." };
    var u = getUser();
    write(K.user, { email: u.email, name: u.name, pwHash: await sha(newPw) });
    del(K.otp);
    return { ok: true };
  }

  /* ---------- email delivery (EmailJS REST, free tier) ---------- */
  function getEmailCfg() { return read(K.email); }
  function setEmailCfg(cfg) {
    if (!cfg || (!cfg.serviceId && !cfg.templateId && !cfg.publicKey)) { del(K.email); return; }
    write(K.email, cfg);
  }
  function emailConfigured() {
    var c = getEmailCfg();
    return !!(c && c.serviceId && c.templateId && c.publicKey);
  }
  async function sendEmail(toEmail, code) {
    var cfg = getEmailCfg();
    if (cfg && cfg.serviceId && cfg.templateId && cfg.publicKey) {
      try {
        var res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_id: cfg.serviceId,
            template_id: cfg.templateId,
            user_id: cfg.publicKey,
            // a broad set of params so most EmailJS templates "just work"
            template_params: {
              to_email: toEmail, email: toEmail, to: toEmail, user_email: toEmail,
              passcode: code, code: code, otp: code, token: code,
              from_name: cfg.fromName || "Operator Console",
              subject: "Your Operator Console verification code",
              time: "10 minutes",
              message: "Your verification code is " + code + ". It expires in 10 minutes.",
            },
          }),
        });
        if (res.ok) return { via: "email" };
        var txt = "";
        try { txt = await res.text(); } catch (e) {}
        return { via: "dev", error: "Email provider returned " + res.status + (txt ? ": " + txt.slice(0, 120) : "") };
      } catch (e) {
        return { via: "dev", error: "Could not reach the email provider (" + (e && e.message || e) + ")." };
      }
    }
    return { via: "dev" };
  }

  // expose
  window.Auth = {
    login: login, logout: logout, isAuthed: isAuthed, getUser: getUser, sessionEmail: sessionEmail,
    requestOtp: requestOtp, verifyOtp: verifyOtp, resetPassword: resetPassword,
    getEmailCfg: getEmailCfg, setEmailCfg: setEmailCfg, emailConfigured: emailConfigured,
    seed: ensureSeed, DEFAULT_EMAIL: DEFAULT_EMAIL, DEFAULT_PW: DEFAULT_PW,
  };
  // seed the default account on load so first login works
  ensureSeed();
})();
