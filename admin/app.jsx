/* =====================================================
   CONSOLE BUNDLE — all React/JSX views in ONE Babel script
   to minimise runtime fetches. Edit this file directly.
   ===================================================== */


/* ===== SOURCE: components.jsx ===== */
/* =====================================================
   SHARED — icons, score dial, chrome (sidebar/topbar),
   small reusable bits. Exposed on window for other files.
   ===================================================== */
const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* ---------- Icon set (1.7px stroke, inherits color) ---------- */
const P = {
  dashboard: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
};
function Icon({ n, s = 18, sw = 1.7, fill = false, style }) {
  const paths = ICONS[n] || ICONS.dot;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"}
      stroke={fill ? "none" : "currentColor"} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
      {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}
const ICONS = {
  dot: ["M12 12h.01"],
  lock: ["M4 11h16v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z", "M8 11V7a4 4 0 0 1 8 0v4"],
  logout: ["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", "M16 17l5-5-5-5", "M21 12H9"],
  shield: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  eyeOff: ["M9.9 4.24A9 9 0 0 1 12 4c7 0 10 8 10 8a18 18 0 0 1-2.16 3.19", "M6.6 6.6A18 18 0 0 0 2 12s3 8 10 8a9 9 0 0 0 4.4-1.15", "M3 3l18 18", "M9.9 9.9a3 3 0 0 0 4.2 4.2"],
  mailCheck: ["M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9", "M2 7l10 6 10-6", "M16 19l2 2 4-4"],
  grid: ["M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"],
  radar: ["M19.07 4.93a10 10 0 1 0 .98 12.81", "M12 12 7 7", "M12 12l4.5 1.2", "M12 2v4", "M12 12a3 3 0 1 0 2.5 1.34"],
  list: ["M8 6h13M8 12h13M8 18h13", "M3 6h.01M3 12h.01M3 18h.01"],
  pen: ["M12 20h9", "M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"],
  sparkle: ["M12 3l1.6 4.6L18 9l-4.4 1.4L12 15l-1.6-4.6L6 9l4.4-1.4Z", "M19 14l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7Z"],
  gauge: ["M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z", "M12 12l4-4", "M4 18a8 8 0 1 1 16 0", "M4 18h16"],
  image: ["M3 5h18v14H3z", "M3 15l5-5 4 4 3-3 6 6", "M8.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"],
  eye: ["M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z", "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"],
  globe: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M2 12h20", "M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20z"],
  mail: ["M3 5h18v14H3z", "M3 7l9 6 9-6"],
  inbox: ["M22 12h-6l-2 3h-4l-2-3H2", "M5 5h14l3 7v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-6Z"],
  folder: ["M3 7h6l2 2h10v10H3z"],
  search: ["M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z", "M21 21l-4.3-4.3"],
  trend: ["M3 17l6-6 4 4 8-8", "M17 7h4v4"],
  settings: ["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M19.4 13a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 2.9-1.2V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9Z"],
  bell: ["M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9z", "M13.7 21a2 2 0 0 1-3.4 0"],
  plus: ["M12 5v14M5 12h14"],
  check: ["M20 6L9 17l-5-5"],
  x: ["M18 6L6 18M6 6l12 12"],
  alert: ["M12 9v4", "M12 17h.01", "M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"],
  arrowR: ["M5 12h14M13 6l6 6-6 6"],
  arrowUp: ["M12 19V5M6 11l6-6 6 6"],
  arrowDown: ["M12 5v14M6 13l6 6 6-6"],
  copy: ["M9 9h11v11H9z", "M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"],
  send: ["M22 2 11 13", "M22 2l-7 20-4-9-9-4 20-7z"],
  upload: ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M17 8l-5-5-5 5", "M12 3v12"],
  clock: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 7v5l3 2"],
  link: ["M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5", "M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5"],
  tag: ["M20.6 13.4 12 22l-9-9V3h10l7.6 7.6a2 2 0 0 1 0 2.8z", "M7 7h.01"],
  zap: ["M13 2 3 14h7l-1 8 10-12h-7l1-8z"],
  user: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M4 21a8 8 0 0 1 16 0"],
  play: ["M5 3l14 9-14 9V3z"],
  pause: ["M6 4h4v16H6zM14 4h4v16h-4z"],
  refresh: ["M21 12a9 9 0 1 1-3-6.7L21 8", "M21 3v5h-5"],
  doc: ["M14 3v5h5", "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-5z", "M9 13h6M9 17h6"],
  filter: ["M22 3H2l8 9.5V19l4 2v-8.5L22 3z"],
  external: ["M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", "M15 3h6v6", "M10 14 21 3"],
  trash: ["M3 6h18", "M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"],
  edit: ["M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", "M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"],
  star: ["M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z"],
  bolt: ["M13 2 3 14h7l-1 8 10-12h-7l1-8z"],
  briefcase: ["M3 7h18v13H3z", "M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"],
  chart: ["M3 3v18h18", "M7 14v4M12 9v9M17 5v13"],
  key: ["M14 8a4 4 0 1 1-5.7 3.6L3 17v3h3l1-1h2v-2h2l1.3-1.3A4 4 0 0 1 14 8z"],
  rocket: ["M5 13c-1.5 1.3-2 5-2 5s3.7-.5 5-2", "M12 15l-3-3a10 10 0 0 1 9-9 10 10 0 0 1-9 9z", "M15 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"],
  layers: ["M12 2 2 7l10 5 10-5-10-5z", "M2 17l10 5 10-5", "M2 12l10 5 10-5"],
  flask: ["M9 2h6", "M10 2v6L5 19a1 1 0 0 0 1 1.5h12A1 1 0 0 0 19 19l-5-11V2", "M7.5 14h9"],
};

/* ---------- Score dial ---------- */
function Dial({ value, size = 96, stroke = 9, label = "SEO" }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = value == null ? 0 : value / 100;
  const col = value == null ? "var(--fog)" : value >= 80 ? "var(--good)" : value >= 60 ? "var(--warn)" : "var(--bad)";
  return (
    <div className="dial" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} stroke="var(--border)" strokeWidth={stroke} fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={col} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct)} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset .9s var(--ease)" }} />
      </svg>
      <div className="dv">
        <span className="n" style={{ fontSize: size * 0.3 }}>{value == null ? "·" : value}</span>
        <span className="l">{label}</span>
      </div>
    </div>
  );
}

function scoreClass(v) { return v == null ? "gray" : v >= 80 ? "green" : v >= 60 ? "warn" : "bad"; }
function scoreWord(v) { return v == null ? "Not scored" : v >= 80 ? "Good" : v >= 60 ? "OK" : "Poor"; }

/* ---------- Category chip ---------- */
function CatChip({ cat }) {
  const map = { SEO: "accent", AI: "purple", "Power BI": "info", Cloud: "info", bi: "info", ai: "purple", seo: "accent", cloud: "info" };
  return <span className={`chip ${map[cat] || "gray"}`}>{typeof cat === "string" ? cat : ""}</span>;
}

/* ---------- Sidebar ---------- */
const NAV = [
  { group: "Operate" },
  { id: "dashboard", label: "Dashboard", icon: "grid" },
  { id: "pipeline", label: "Blog Pipeline", icon: "layers", badge: "7" },
  { id: "trends", label: "Trend Radar", icon: "radar", badge: "4", alert: true },
  { id: "inbox", label: "Query Inbox", icon: "inbox", badge: "3", alert: true },
  { group: "Manage" },
  { id: "seo", label: "SEO Center", icon: "gauge" },
  { id: "projects", label: "Projects", icon: "briefcase" },
  { id: "media", label: "Media", icon: "image" },
  { id: "settings", label: "Settings", icon: "settings" },
];

function Sidebar({ view, setView, open, onClose }) {
  const go = (id) => { setView(id); onClose && onClose(); };
  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="side-brand">
        <div className="side-logo">MP</div>
        <div className="bt">
          <span className="bn">Meet Patel</span>
          <span className="br">Operator Console</span>
        </div>
        <button className="side-close" onClick={onClose} aria-label="Close menu"><Icon n="x" s={18} /></button>
      </div>
      <nav className="side-nav scroll">
        {NAV.map((it, i) =>
          it.group
            ? <div className="nav-group-label" key={"g"+i}>{it.group}</div>
            : <button key={it.id} className={`nav-item ${view === it.id ? "active" : ""}`} onClick={() => go(it.id)}>
                <Icon n={it.icon} s={17} />
                <span>{it.label}</span>
                {it.badge && <span className={`nav-badge ${it.alert ? "alert" : ""}`}>{it.badge}</span>}
              </button>
        )}
      </nav>
      <div className="side-foot">
        <div className="side-card">
          <div className="row">
            <span className="dot"></span>
            <span className="lbl">Automation running</span>
          </div>
          <div className="sub">5 posts in flight · next publish<br/>pending <a href="#">your review →</a></div>
        </div>
      </div>
    </aside>
  );
}

/* ---------- Topbar ---------- */
const TITLES = {
  dashboard: ["Dashboard", "Operator overview"],
  pipeline: ["Blog Pipeline", "Research → draft → review → publish"],
  trends: ["Trend Radar", "Auto-discovered topics"],
  inbox: ["Query Inbox", "Contact form submissions"],
  seo: ["SEO Command Center", "Rankings · audits · OG tags"],
  projects: ["Projects", "Manage the public roadmap"],
  media: ["Media Library", "Hero & OG images"],
  settings: ["Settings", "Site config & integrations"],
};
function Topbar({ view, onNew, onMenu, onLogout, userEmail }) {
  const [t, sub] = TITLES[view] || ["", ""];
  const [menu, setMenu] = useState(false);
  return (
    <header className="topbar">
      <button className="tb-burger" onClick={onMenu} aria-label="Open menu"><Icon n="list" s={20} /></button>
      <div className="tb-title">
        <h1>{t}</h1>
        <span className="crumb">{sub}</span>
      </div>
      <label className="tb-search">
        <Icon n="search" s={15} />
        <input placeholder="Search posts, topics, queries…" />
        <kbd>⌘K</kbd>
      </label>
      <div className="tb-spacer"></div>
      <div className="tb-actions">
        <button className="btn btn-primary" onClick={onNew}><Icon n="plus" s={15} /> <span className="btn-label">New post</span></button>
        <button className="icon-btn"><Icon n="bell" s={17} /><span className="ping"></span></button>
        <div className="tb-user" style={{ position: "relative" }}>
          <button className="avatar" onClick={() => setMenu(m => !m)} title={userEmail || "Account"} style={{ border: "none", cursor: "pointer" }}>MP</button>
          {menu && (
            <>
              <div className="umenu-scrim" onClick={() => setMenu(false)}></div>
              <div className="umenu">
                <div className="umenu-head">
                  <div className="umenu-av">MP</div>
                  <div className="umenu-id">
                    <span className="umenu-name">Meet Patel</span>
                    <span className="umenu-mail">{userEmail || ""}</span>
                  </div>
                </div>
                <button className="umenu-item danger" onClick={() => { setMenu(false); onLogout && onLogout(); }}>
                  <Icon n="logout" s={15} /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

/* ---------- Toast ---------- */
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2600);
  }, []);
  const node = (
    <div className="toast-wrap">
      {toasts.map(t => <div className="toast" key={t.id}><Icon n="check" s={16} /> {t.msg}</div>)}
    </div>
  );
  return [push, node];
}

/* ---------- Small helpers ---------- */
function Stat({ icon, val, sub, delta, dir }) {
  return (
    <div className="kpi">
      <div className="kpi-top">
        <div className="kpi-ic"><Icon n={icon} s={17} /></div>
        {delta && <span className={`delta ${dir}`}><Icon n={dir === "up" ? "arrowUp" : dir === "down" ? "arrowDown" : "dot"} s={11} />{delta}</span>}
      </div>
      <div className="kpi-val" dangerouslySetInnerHTML={{ __html: val }}></div>
      <div className="kpi-lbl">{sub}</div>
    </div>
  );
}

function Sparkline({ data, w = 260, h = 56, color = "var(--accent)" }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => [ (i / (data.length - 1)) * w, h - ((v - min) / (max - min || 1)) * (h - 6) - 3 ]);
  const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = d + ` L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs><linearGradient id="spk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={color} stopOpacity="0.18" /><stop offset="1" stopColor={color} stopOpacity="0" />
      </linearGradient></defs>
      <path d={area} fill="url(#spk)" />
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhImage({ h = 140, label = "Image needed", style }) {
  return <div className="ph" style={{ height: h, ...style }}><span className="ph-l">{label}</span></div>;
}

function Relevance({ n }) {
  return (
    <div className="relev">
      <div className="bars">{[1,2,3,4,5].map(i => <i key={i} className={i <= n ? "on" : ""}></i>)}</div>
    </div>
  );
}

Object.assign(window, {
  Icon, ICONS, Dial, CatChip, Sidebar, Topbar, useToasts, Stat, Sparkline, PhImage, Relevance,
  scoreClass, scoreWord, useState, useEffect, useRef, useMemo, useCallback,
});

/* ===== SOURCE: blueprint.jsx ===== */
/* =====================================================
   BLUEPRINT — the blog "writing formula".
   Tunable parameters that shape every draft, a markdown
   renderer (tables, quotes, FAQ, callouts), a prompt
   builder, and portfolio internal-link targets.
   Built for a Groq-backed generator (window.claude.complete
   is the seam — swap in your Groq call there).
   ===================================================== */

/* ---------- raw inline SVGs for the rendered article ---------- */
const _svg = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const ICN = {
  check: _svg('<path d="M20 6L9 17l-5-5"/>'),
  zap:   _svg('<path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/>'),
  info:  _svg('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>'),
  help:  _svg('<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 2.5M12 17h.01"/>'),
};

/* ---------- markdown -> html ---------- */
function mdInline(s) {
  s = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return s;
}
function splitRow(line) {
  let cells = line.split("|").map(c => c.trim());
  if (cells.length && cells[0] === "") cells.shift();
  if (cells.length && cells[cells.length - 1] === "") cells.pop();
  return cells;
}
function isTableSep(s) { return /\|/.test(s) && /^[\s:|-]+$/.test(s) && s.includes("-"); }

function slugify(s) {
  return (s || "").toLowerCase().replace(/[*`]/g, "").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 60) || "section";
}
function extractHeadings(md) {
  if (!md) return [];
  const out = []; const seen = {};
  md.replace(/\r/g, "").split("\n").forEach(l => {
    const m = l.match(/^(#{2,3})\s+(.*)$/);
    if (m) {
      let id = slugify(m[2]);
      if (seen[id]) { id = id + "-" + (++seen[id]); } else { seen[id] = 1; }
      out.push({ level: m[1].length, text: m[2].replace(/[*`]/g, ""), id });
    }
  });
  return out;
}

function renderCallout(type, buf) {
  const body = buf.filter(b => b.trim());
  if (type === "takeaways" || type === "key") {
    const items = body.filter(b => /^[-*]/.test(b)).map(b => b.replace(/^[-*]\s?/, ""));
    const list = items.length ? items : body;
    return `<div class="cal takeaways"><div class="cal-h">${ICN.check} Key takeaways</div><ul>${list.map(x => `<li>${ICN.check}<span>${mdInline(x)}</span></li>`).join("")}</ul></div>`;
  }
  if (type === "tldr") {
    return `<div class="cal tldr"><div class="cal-h">${ICN.zap} TL;DR</div><p>${mdInline(body.join(" "))}</p></div>`;
  }
  if (type === "stats" || type === "stat") {
    const cells = body.map(b => {
      const parts = b.replace(/^[-*]\s?/, "").split("|");
      const v = (parts[0] || "").trim();
      const l = parts.slice(1).join("|").trim();
      return `<div class="stat-cell"><div class="sv">${v}</div><div class="sl">${l}</div></div>`;
    }).join("");
    return `<div class="cal stats"><div class="stat-row">${cells}</div></div>`;
  }
  if (type === "faq") {
    const items = []; let cur = null;
    body.forEach(b => {
      const q = b.match(/^Q:\s*(.*)/i), a = b.match(/^A:\s*(.*)/i);
      if (q) { cur = { q: q[1], a: "" }; items.push(cur); }
      else if (a && cur) { cur.a = a[1]; }
      else if (cur) { cur.a += " " + b; }
    });
    return `<div class="cal faq"><div class="cal-h">${ICN.help} Frequently asked</div>${items.map(it => `<div class="faq-item"><div class="faq-q">${mdInline(it.q)}</div><div class="faq-a">${mdInline(it.a)}</div></div>`).join("")}</div>`;
  }
  return `<div class="cal note"><div class="cal-h">${ICN.info} Note</div><p>${mdInline(body.join(" "))}</p></div>`;
}

function renderQuote(buf) {
  let lines = buf.slice();
  let cite = null;
  const last = lines[lines.length - 1] || "";
  if (lines.length > 1 && /^(—|--|–)\s?/.test(last)) cite = lines.pop().replace(/^(—|--|–)\s?/, "");
  return `<blockquote><p>${mdInline(lines.join(" "))}</p>${cite ? `<cite>${mdInline(cite)}</cite>` : ""}</blockquote>`;
}

function renderMarkdown(md) {
  if (!md) return "";
  const L = md.replace(/\r/g, "").split("\n");
  const out = []; let i = 0; const seen = {};
  while (i < L.length) {
    const line = L[i];
    if (!line.trim()) { i++; continue; }
    let m = line.match(/^:::\s*(\w+)/);
    if (m) {
      const type = m[1].toLowerCase(); const buf = []; i++;
      while (i < L.length && !/^:::\s*$/.test(L[i])) { buf.push(L[i]); i++; }
      i++; out.push(renderCallout(type, buf)); continue;
    }
    if (line.startsWith("```")) {
      const buf = []; i++;
      while (i < L.length && !L[i].startsWith("```")) { buf.push(L[i]); i++; }
      i++;
      out.push(`<pre><code>${buf.join("\n").replace(/&/g, "&amp;").replace(/</g, "&lt;")}</code></pre>`); continue;
    }
    if (line.includes("|") && i + 1 < L.length && isTableSep(L[i + 1])) {
      const head = splitRow(line); i += 2; const rows = [];
      while (i < L.length && L[i].includes("|") && L[i].trim()) { rows.push(splitRow(L[i])); i++; }
      out.push(`<table><thead><tr>${head.map(h => `<th>${mdInline(h)}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${mdInline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`);
      continue;
    }
    m = line.match(/^(#{1,4})\s+(.*)$/);
    if (m) {
      const lv = m[1].length;
      let id = "";
      if (lv >= 2 && lv <= 3) {
        id = slugify(m[2]);
        if (seen[id]) { id = id + "-" + (++seen[id]); } else { seen[id] = 1; }
      }
      out.push(`<h${lv}${id ? ` id="${id}"` : ""}>${mdInline(m[2])}</h${lv}>`); i++; continue;
    }
    if (line.startsWith(">")) {
      const buf = []; while (i < L.length && L[i].startsWith(">")) { buf.push(L[i].replace(/^>\s?/, "")); i++; }
      out.push(renderQuote(buf)); continue;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      const buf = []; while (i < L.length && /^\s*[-*]\s+/.test(L[i])) { buf.push(L[i].replace(/^\s*[-*]\s+/, "")); i++; }
      out.push(`<ul>${buf.map(b => `<li>${mdInline(b)}</li>`).join("")}</ul>`); continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      const buf = []; while (i < L.length && /^\s*\d+\.\s+/.test(L[i])) { buf.push(L[i].replace(/^\s*\d+\.\s+/, "")); i++; }
      out.push(`<ol>${buf.map(b => `<li>${mdInline(b)}</li>`).join("")}</ol>`); continue;
    }
    const buf = [];
    while (i < L.length && L[i].trim() && !/^(#{1,4}\s|>|:::|```|\s*[-*]\s|\s*\d+\.\s)/.test(L[i]) && !(L[i].includes("|") && i + 1 < L.length && isTableSep(L[i + 1]))) { buf.push(L[i]); i++; }
    out.push(`<p>${mdInline(buf.join(" "))}</p>`);
  }
  return out.join("\n");
}

/* ---------- portfolio internal-link targets (real pages) ---------- */
function portfolioTargets() {
  const A = window.ADMIN || {};
  const posts = (A.POSTS || []).filter(p => p.stage === "published").map(p => ({ t: p.title, u: "/blog/" + p.slug, cat: p.cat }));
  return [
    ...posts,
    { t: "Projects roadmap", u: "/#projects", cat: "Cloud" },
    { t: "Services · work with me", u: "/services", cat: "SEO" },
    { t: "About Meet Patel", u: "/about", cat: "AI" },
  ];
}

/* ---------- formula parameters ---------- */
const TEMPLATES = ["How-to", "Case study", "Listicle", "Comparison", "Explainer", "Opinion"];
const LEVELS = ["Beginner", "Practitioner", "Expert"];
const TONES = ["Confident", "Practical", "Conversational", "Analytical", "Story-led", "Contrarian"];
const SCHEMAS = ["Article", "Article + FAQPage", "HowTo", "Review"];
const ELEMENTS = [
  { id: "tldr", label: "TL;DR box", desc: "summary up top", icon: "zap" },
  { id: "takeaways", label: "Key takeaways", desc: "scannable recap", icon: "check" },
  { id: "table", label: "Comparison table", desc: "structured data", icon: "grid" },
  { id: "faq", label: "FAQ + schema", desc: "FAQPage markup", icon: "doc" },
  { id: "pullquote", label: "Pull quote", desc: "quotation block", icon: "edit" },
  { id: "stats", label: "Stat callouts", desc: "big numbers", icon: "chart" },
  { id: "code", label: "Code snippet", desc: "if technical", icon: "layers" },
  { id: "steps", label: "Step-by-step", desc: "numbered flow", icon: "list" },
  { id: "proscons", label: "Pros / cons", desc: "balanced view", icon: "filter" },
  { id: "internal", label: "Internal links", desc: "to your portfolio", icon: "link" },
  { id: "external", label: "Authority links", desc: "external sources", icon: "external" },
  { id: "cta", label: "Contact CTA", desc: "soft hire-me nudge", icon: "send" },
];

function defaultBlueprint() {
  return {
    template: "How-to", words: 2000, level: "Practitioner",
    tone: ["Confident", "Practical"], audience: "Technical decision-makers and developers",
    secondary: "", schema: "Article + FAQPage", experience: true,
    elements: { tldr: true, takeaways: true, table: true, faq: true, pullquote: true, stats: true, code: false, steps: false, proscons: false, internal: true, external: true, cta: true },
  };
}

/* ---------- prompt builder (the trainable "formula") ---------- */
function buildPrompt(post, bp) {
  const e = bp.elements; const ins = [];
  if (e.tldr) ins.push("Open with a TL;DR fenced block:\n:::tldr\n<2-3 sentence summary>\n:::");
  if (e.takeaways) ins.push("Add a Key takeaways block early:\n:::takeaways\n- point\n- point\n:::");
  if (e.stats) ins.push("Where numbers matter, use:\n:::stats\n- 38% | what it measures\n- 6 hrs | another metric\n:::");
  if (e.table) ins.push("Include at least one markdown comparison table with a header row and a separator row.");
  if (e.pullquote) ins.push('Include one pull quote as a markdown blockquote (lines start with ">"), with an attribution line starting with "-- ".');
  if (e.steps) ins.push("Use a numbered step-by-step list for the core process.");
  if (e.proscons) ins.push("Include a short pros and cons comparison.");
  if (e.code) ins.push("Include one fenced code block if technically relevant.");
  if (e.faq) ins.push("End with an FAQ block for FAQPage schema:\n:::faq\nQ: question\nA: answer\nQ: question\nA: answer\n:::");
  if (e.internal && bp._internal) ins.push("Naturally weave in markdown links to some of my own pages: " + bp._internal);
  if (e.external) ins.push("Reference 1-2 reputable external sources as markdown links.");
  if (e.cta) ins.push("Close with a brief, non-salesy CTA to get in touch for help.");

  return `You are ghost-writing as Meet Patel, an Azure-certified IT Business Analyst, data analyst (Power BI, Python, SQL) and web developer in Saint John, New Brunswick. Voice: first-person, confident, practical, drawn from real project work.${bp.experience ? " Lead with first-hand experience and concrete specifics (E-E-A-T)." : ""}

TOPIC: "${post.title}"
FOCUS KEYWORD: "${post.keyword}"
SECONDARY KEYWORDS: ${bp.secondary || "(none)"}
ARTICLE TYPE: ${bp.template}
AUDIENCE: ${bp.audience}
READING LEVEL: ${bp.level}
TONE: ${bp.tone.join(", ")}
TARGET LENGTH: at least ${bp.words} words. This is a hard minimum, do not stop short. Go deep with examples, edge cases and specifics.
SCHEMA: ${bp.schema}

FORMAT RULES (Markdown):
- Use ## and ### headings. Write 6 to 9 descriptive ## sections (they power the table of contents) plus ### sub-sections where useful.
- Put the focus keyword in the intro and in at least two H2 headings.
- Short paragraphs (2-4 sentences). No fluff, no "in today's fast-paced world". NO em-dashes anywhere (use commas, periods or parentheses).
${ins.map(s => "- " + s).join("\n")}

Return ONLY the markdown body (no H1 title line, no commentary).`;
}

/* ---------- a full-length (~2000 word) sample so the preview shines ---------- */
function richSampleBody(p) {
  const cat = p.cat || "system";
  const kw = p.keyword || (p.title || "").toLowerCase();
  return `:::tldr
${p.excerpt} This is the exact, repeatable approach I use on real ${cat} work, with the numbers, the trade-offs and the mistakes included so you can copy it on your own stack.
:::

Most teams assume their ${cat} setup is fine until a bill, a benchmark, or a stakeholder proves otherwise. I have run ${kw} enough times across client projects to turn it into a checklist, so here is the whole thing end to end. No theory you cannot use, no padding, just the process I actually follow when someone hands me a system that is slower, more expensive, or messier than it should be.

By the end of this you will have a repeatable audit, a short list of the fixes that pay off first, and a way to keep the result from drifting back next quarter.

:::takeaways
- Baseline first. You cannot improve what you have not measured, and the baseline is where most of the surprises hide.
- A handful of fixes usually account for most of the result. Find them before you touch anything fancy.
- Automate the audit so the gains never quietly drift back once attention moves on.
- Write down the trade-offs. Every fix costs something, and the cost is easy to forget six months later.
:::

## Why ${kw} is worth getting right

Before the how, a quick word on the why, because it changes how aggressively you should approach this. When ${cat} work is left alone, the cost of doing nothing compounds quietly. A slow report becomes a report nobody opens. An oversized resource becomes a line item nobody questions. A messy data model becomes the reason every new request takes a week.

I have watched small inefficiencies turn into the main reason a team distrusts its own numbers. That is the real cost, and it is the one that does not show up on an invoice. Getting ${kw} right is less about chasing a perfect score and more about restoring trust in the system so people use it again.

The good news is that the work is bounded. You are not rebuilding everything. You are finding the few things that matter and fixing them in the right order.

## Where the problem actually starts

The first move is always measurement. I pull the current numbers, tag the obvious offenders, and rank them by effort versus payoff. I resist the urge to fix anything on this first pass, because fixing too early hides the baseline you will need to prove the result later.

This is the step most people skip, and skipping it is why so many optimization projects cannot show what they actually achieved. Spend the extra hour. Capture the starting point in a place you can point to later.

:::stats
- 38% | reduction after the first pass
- 6 hrs | saved per reporting cycle
- 11 | issues found in the initial audit
:::

### Set a baseline you can defend

A baseline is only useful if you can defend it. That means a timestamp, the exact query or measurement, and the conditions it was taken under. When someone asks "compared to what?" three months from now, you want a clean answer, not a vague memory.

I keep the baseline in the same place as the fix log, so the before and after live side by side. It is a small habit that makes the final write-up almost effortless.

### Separate symptoms from causes

The loudest symptom is rarely the root cause. A slow dashboard might be a data-model problem, not a visual one. A high bill might be one forgotten resource, not the whole architecture. Before you commit to a fix, trace the symptom back at least one level. The extra ten minutes saves you from polishing the wrong thing.

## The audit, step by step

Here is the actual sequence I run. It is deliberately boring, because boring is repeatable.

1. Pull the current numbers and timestamp them.
2. List every component and tag the obvious offenders.
3. Rank each item by effort versus payoff, not by how annoying it feels.
4. Pick the top three high-payoff, low-effort items and nothing else yet.
5. Ship those, measure again, and only then decide what is next.

The discipline is in step four. It is tempting to fix everything you can see. Resist it. The first three fixes teach you more about the system than a full rewrite ever would, and they buy you the credibility to do the bigger work later.

### What the data showed

Once the baseline is in place, the priorities sort themselves. Here is how the main options compared on the work that mattered most for ${kw}.

| Approach | Effort | Payoff | When I use it |
| --- | --- | --- | --- |
| Quick rightsizing | Low | High | First, every time |
| Reserved or committed capacity | Medium | High | Stable, predictable load |
| Caching and reuse | Medium | Medium | Repeated, identical work |
| Re-architecting | High | Medium | Only when the above stall |

The table is not the answer, it is the starting map. Your numbers will move the rankings around, which is exactly the point. You are making the trade-offs visible instead of guessing.

> The cheapest resource is the one you turn off. Measure before you optimize, then automate so it stays optimized, because anything you fix by hand will quietly un-fix itself.
> -- Meet Patel

## The changes that moved the needle

This is where the real work happens. I walk through each fix, why it works, and the trade-off I weighed before shipping it. None of these are clever. They are just done in the right order and actually finished.

### Cut the obvious waste first

Every system carries dead weight: the resource nobody owns, the query that runs twice, the step that exists because it always has. Removing it is the highest-confidence change you can make, because there is no real downside. I start here every single time, and it routinely accounts for a third of the result on its own.

### Right-size what is left

Once the waste is gone, the remaining pieces are usually mis-sized. Some are too big and burning money, a few are too small and causing the slowness people complain about. Match each to its actual load using the baseline, not a guess. For the reporting layer on a recent project I reused the model from my [Power BI financial dashboard](/blog/power-bi-financial-dashboard) build, which saved me from rebuilding the measures from scratch.

### Make the gains stick

A fix you have to remember to re-apply is not really fixed. I turn each meaningful change into a check that runs on a schedule, so drift gets caught automatically. This is the difference between a one-time cleanup and a system that stays healthy. If you only adopt one idea from this article, make it this one.

## Common mistakes I see (and made)

I have made every one of these, which is the only reason I can spot them quickly now.

- Optimizing before measuring, so there is no way to prove the result.
- Fixing the loudest symptom instead of the root cause.
- Shipping ten changes at once, so you cannot tell which one worked.
- Treating the cleanup as done instead of automating the check.
- Forgetting to write down the trade-off, then re-litigating it months later.

None of these are knowledge problems. They are discipline problems, and a checklist solves discipline problems better than talent does.

## What I would do differently

No project is perfect. Next time I would automate the audit on day one instead of week three, because the manual version always slips once the urgent fire is out. I would also bring the stakeholder in earlier, since the numbers land harder when the person who owns the budget watches them move in real time.

The work itself rarely changes. What changes is how early you build the habits that keep it from unravelling.

## A worked example from a recent project

To make this concrete, here is how it played out on a recent ${cat} engagement. The team came to me with a system that had grown organically for two years and nobody fully understood anymore. The complaint was vague: things felt slow and the bill felt high, but no one could point to why.

I started exactly where this article tells you to start. Half a day on the baseline surfaced eleven distinct issues, and three of them accounted for most of the pain. One resource had been provisioned for a launch spike that never came back down. One query was being run on every page load when a cached value would have done. One report was rebuilding its entire dataset instead of refreshing the slice that changed.

None of that was clever to find. It was just visible once someone actually looked with a baseline in hand. We shipped the three fixes in two days, measured again, and the numbers moved enough that the stakeholder stopped asking about it. That is the real goal, the problem becoming boring again.

The part that mattered most came last. We wrapped the audit in a scheduled check so the same three issues could not creep back. Six months later they had not, which is the only metric I actually care about.

## Tooling I reach for

You do not need expensive tooling to do this well. Most of my results come from a small, boring kit that I trust.

- A notebook or query console to capture the baseline and re-measure cleanly.
- A spreadsheet to rank items by effort versus payoff, because forcing the numbers into columns kills the temptation to guess.
- A scheduled job, however simple, to run the audit again automatically.
- A single shared document where the baseline, the fixes and the trade-offs all live together.

The trap is believing a better tool will save you from the discipline. It will not. The tool makes the measurement faster, but the judgement about what to fix first is still yours, and that is where the value is. I have done this with nothing but a console and a spreadsheet and gotten most of the result, then added tooling only once the process was already working.

If you take the kit above and run the five-step audit honestly, you are already ahead of most teams, who skip straight to fixes and never measure whether they helped.

:::faq
Q: How long does the initial audit take?
A: For a mid-sized setup, about half a day to baseline and a day to ship the first round of fixes. The automation that keeps it healthy takes another day, and it is the day with the best return.
Q: Do these results hold over time?
A: Only if you automate the checks. Without that, savings and speed drift back within a quarter as new work piles on.
Q: What if I cannot get a clean baseline?
A: Capture the best approximation you can and label it as such. An imperfect, documented baseline beats a perfect one that only lives in your head.
Q: Is this worth doing for a small system?
A: Yes, and it is faster. Smaller systems have fewer moving parts, so the top three fixes often cover almost everything.
:::

If you want help running this on your own stack, [get in touch](/services). I take a small number of these projects at a time, and I am happy to start with just the audit so you can see the numbers before committing to anything bigger. In practice that first audit usually pays for itself, because the three obvious fixes it surfaces tend to cover their own cost within the first month, and everything after that is upside you can measure and defend.`;
}

/* ---------- ReadingPreview: ToC + byline + progress + active section ---------- */
function ReadingPreview({ body, post }) {
  const ref = useRef(null);
  const [prog, setProg] = useState(0);
  const [active, setActive] = useState(null);
  const heads = extractHeadings(body);
  const words = body ? body.split(/\s+/).filter(Boolean).length : 0;
  const mins = Math.max(1, Math.round(words / 220));

  const onScroll = () => {
    const el = ref.current; if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setProg(max > 0 ? el.scrollTop / max : 0);
    let cur = null;
    heads.forEach(h => {
      const t = el.querySelector("#" + (window.CSS && CSS.escape ? CSS.escape(h.id) : h.id));
      if (t && t.offsetTop - 24 <= el.scrollTop) cur = h.id;
    });
    setActive(cur);
  };
  const goTo = (id) => {
    const el = ref.current; if (!el) return;
    const t = el.querySelector("#" + (window.CSS && CSS.escape ? CSS.escape(id) : id));
    if (t) el.scrollTo({ top: Math.max(0, t.offsetTop - 8) });
  };

  if (!body) return <div className="empty" style={{ padding: 50 }}>No draft yet. Hit Generate to write one from your blueprint.</div>;

  return (
    <div className="reading">
      <aside className="toc">
        <div className="toc-h">On this page</div>
        <nav>
          {heads.length === 0
            ? <span className="toc-link" style={{ opacity: .6 }}>No sections yet</span>
            : heads.map(h => (
                <a key={h.id} className={`toc-link l${h.level} ${active === h.id ? "active" : ""}`} onClick={() => goTo(h.id)}>{h.text}</a>
              ))}
        </nav>
        <div className="toc-meta">
          <span>{words.toLocaleString()} words</span>
          <span>{mins} min read</span>
          <span>{heads.length} sections</span>
        </div>
      </aside>
      <div className="reading-main">
        <div className="read-progress"><i style={{ width: (prog * 100).toFixed(1) + "%" }}></i></div>
        <div className="article-head">
          <div className="row" style={{ gap: 8, marginBottom: 10 }}>
            <CatChip cat={post.cat} />
            <span className={`chip ${words >= 2000 ? "green" : "warn"}`}>
              <Icon n={words >= 2000 ? "check" : "alert"} s={11} /> {words >= 2000 ? "Meets 2000-word target" : `${2000 - words} words short`}
            </span>
          </div>
          <h1>{post.title}</h1>
          <div className="byline">
            <div className="av">MP</div>
            <div>
              <div className="bn">Meet Patel</div>
              <div className="bm">Updated today · {mins} min read · {post.cat}</div>
            </div>
          </div>
        </div>
        <div className="article scroll" ref={ref} onScroll={onScroll}
          style={{ maxHeight: 460, overflowY: "auto", paddingRight: 16, position: "relative" }}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }} />
      </div>
    </div>
  );
}

/* ---------- Blueprint tab UI ---------- */
function BlueprintTab({ bp, setBp, post, onInsert }) {
  const set = (k, v) => setBp({ ...bp, [k]: v });
  const toggleEl = (k) => setBp({ ...bp, elements: { ...bp.elements, [k]: !bp.elements[k] } });
  const toggleTone = (t) => setBp({ ...bp, tone: bp.tone.includes(t) ? bp.tone.filter(x => x !== t) : [...bp.tone, t] });
  const targets = portfolioTargets();

  return (
    <div className="stack" style={{ gap: 18 }}>
      <div className="card card-pad" style={{ display: "flex", gap: 14, alignItems: "center", background: "linear-gradient(110deg, var(--accent-soft), transparent 60%)", borderColor: "var(--accent-line)" }}>
        <div className="kpi-ic" style={{ width: 40, height: 40, borderRadius: 11 }}><Icon n="flask" s={20} /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>Writing formula</div>
          <div style={{ fontSize: 12, color: "var(--slate)" }}>These parameters shape every draft. Tune them, then hit Generate on the Content tab.</div>
        </div>
        <span className="chip accent"><Icon n="zap" s={11} /> Groq · Llama-3.3-70B</span>
      </div>

      <div className="bp-grid">
        <div className="field"><label>Article type</label>
          <div className="seg">{TEMPLATES.map(t => <button key={t} className={bp.template === t ? "on" : ""} onClick={() => set("template", t)}>{t}</button>)}</div>
        </div>
        <div className="field"><label>Reading level</label>
          <div className="seg">{LEVELS.map(t => <button key={t} className={bp.level === t ? "on" : ""} onClick={() => set("level", t)}>{t}</button>)}</div>
        </div>
      </div>

      <div className="field">
        <label>Target length <span className="count ok">{bp.words} words · ~{Math.round(bp.words / 220)} min read</span></label>
        <input type="range" className="rng" min="800" max="3200" step="100" value={bp.words} onChange={e => set("words", +e.target.value)} />
      </div>

      <div className="field">
        <label>Tone <span className="hint" style={{ float: "none", display: "inline" }}>· pick a few</span></label>
        <div className="chipset">{TONES.map(t => <button key={t} className={`chip-tog ${bp.tone.includes(t) ? "on" : ""}`} onClick={() => toggleTone(t)}>{t}</button>)}</div>
      </div>

      <div className="bp-grid">
        <div className="field"><label>Audience</label><input className="inp" value={bp.audience} onChange={e => set("audience", e.target.value)} /></div>
        <div className="field"><label>Secondary keywords</label><input className="inp" placeholder="comma, separated" value={bp.secondary} onChange={e => set("secondary", e.target.value)} /></div>
      </div>

      <div className="field" style={{ marginBottom: 0 }}>
        <label>Required elements <span className="hint" style={{ float: "none", display: "inline" }}>· what every post must contain</span></label>
        <div className="el-grid">
          {ELEMENTS.map(el => (
            <div key={el.id} className={`el-tog ${bp.elements[el.id] ? "on" : ""}`} onClick={() => toggleEl(el.id)}>
              <span className="el-ic"><Icon n={el.icon} s={15} /></span>
              <div style={{ flex: 1 }}><div className="el-t">{el.label}</div><div className="el-d">{el.desc}</div></div>
              <span className={`toggle ${bp.elements[el.id] ? "on" : ""}`}></span>
            </div>
          ))}
        </div>
      </div>

      <div className="bp-grid">
        <div className="field"><label>SEO schema</label>
          <select className="sel" value={bp.schema} onChange={e => set("schema", e.target.value)}>{SCHEMAS.map(s => <option key={s}>{s}</option>)}</select>
        </div>
        <div className="field">
          <label>E-E-A-T signal</label>
          <div className="el-tog on" onClick={() => set("experience", !bp.experience)}>
            <span className="el-ic"><Icon n="user" s={15} /></span>
            <div style={{ flex: 1 }}><div className="el-t">Write from real project work</div><div className="el-d">adds first-hand experience</div></div>
            <span className={`toggle ${bp.experience ? "on" : ""}`}></span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head" style={{ padding: "12px 16px" }}>
          <Icon n="link" s={15} style={{ color: "var(--accent)" }} />
          <h3 style={{ fontSize: 13 }}>Link to your portfolio</h3>
          <span className="sub">· internal links lift rankings</span>
        </div>
        <div className="card-pad" style={{ paddingTop: 12 }}>
          {targets.map((x, i) => (
            <div className="pf-link" key={i}>
              <CatChip cat={x.cat} />
              <div style={{ flex: 1, minWidth: 0 }}><div className="pf-t">{x.t}</div><div className="pf-u">{x.u}</div></div>
              <button className="btn btn-ghost btn-sm" onClick={() => onInsert(`[${x.t}](${x.u})`)}><Icon n="plus" s={13} /> Insert</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  renderMarkdown, mdInline, richSampleBody, defaultBlueprint, buildPrompt,
  BlueprintTab, portfolioTargets, TEMPLATES, LEVELS, TONES, ELEMENTS, SCHEMAS,
  slugify, extractHeadings, ReadingPreview,
});

/* ===== SOURCE: view-dashboard.jsx ===== */
/* =====================================================
   VIEW: Dashboard (showpiece) + Trend Radar
   ===================================================== */

function feedColor(c) {
  return { green:"var(--good-bg)", warn:"var(--warn-bg)", accent:"var(--accent-soft)",
    purple:"rgba(124,58,237,.1)", info:"var(--info-bg)" }[c] || "var(--mist)";
}
function feedInk(c) {
  return { green:"var(--good)", warn:"var(--warn)", accent:"var(--accent)",
    purple:"var(--purple)", info:"var(--info)" }[c] || "var(--dusk)";
}

function DashboardView({ setView, openPost, push }) {
  const D = window.ADMIN;
  const reviewQueue = D.POSTS.filter(p => p.stage === "review");
  const inFlight = D.POSTS.filter(p => p.auto);

  // stage counts for the flow strip
  const counts = {};
  D.STAGES.forEach(s => counts[s.id] = D.POSTS.filter(p => p.stage === s.id).length);

  return (
    <div className="view-wrap stack">

      {/* hero strip: the one thing that needs you */}
      {reviewQueue.length > 0 && (
        <div className="card" style={{ borderColor: "var(--accent-line)", background: "linear-gradient(110deg, var(--accent-soft), transparent 60%)" }}>
          <div className="card-pad" style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: "var(--accent)", color: "#fff", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Icon n="eye" s={22} />
            </div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.01em" }}>
                {reviewQueue.length} {reviewQueue.length === 1 ? "post is" : "posts are"} drafted and waiting for you
              </div>
              <div style={{ fontSize: 12.5, color: "var(--slate)", marginTop: 3 }}>
                Fully written, humanized and SEO-scored. Your only job: read, add the cover image, publish.
              </div>
            </div>
            <button className="btn btn-primary btn-lg" onClick={() => openPost(reviewQueue[0])}>
              Review next <Icon n="arrowR" s={15} />
            </button>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="kpi-grid">
        <Stat icon="trend" val="4,182" sub="Organic clicks · 28 days" delta="29%" dir="up" />
        <Stat icon="star" val={`#3 <em>avg</em>`} sub="Avg position · tracked keywords" delta="2.1" dir="up" />
        <Stat icon="layers" val={`5 <em>live</em>`} sub="Posts in the automation pipeline" delta="auto" dir="flat" />
        <Stat icon="zap" val="86%" sub="Hands-off rate · only review left" delta="11%" dir="up" />
      </div>

      {/* pipeline flow strip */}
      <div className="card">
        <div className="card-head">
          <Icon n="layers" s={17} style={{ color: "var(--accent)" }} />
          <h3>Automation pipeline</h3>
          <span className="sub">· research to publish, mostly hands-off</span>
          <div className="spacer"></div>
          <button className="btn btn-ghost btn-sm" onClick={() => setView("pipeline")}>Open board <Icon n="arrowR" s={14} /></button>
        </div>
        <div className="flow scroll">
          {D.STAGES.map((s, i) => (
            <div className={`flow-step ${s.tag}`} key={s.id}>
              <div className="fs-head">
                <div className="fs-ic"><Icon n={s.icon} s={14} /></div>
                <div>
                  <div className="fs-name">{s.name}</div>
                  <div className="fs-tag">{s.tag === "manual" ? "you" : "auto"}</div>
                </div>
              </div>
              <div className="fs-count">{counts[s.id]}<em> {counts[s.id] === 1 ? "post" : "posts"}</em></div>
              {i < D.STAGES.length - 1 && <div className="fs-arrow"><Icon n="arrowR" s={16} /></div>}
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2">
        {/* LEFT: review queue + traffic */}
        <div className="stack">
          <div className="card">
            <div className="card-head">
              <Icon n="eye" s={17} style={{ color: "var(--warn)" }} />
              <h3>Waiting on you</h3>
              <div className="spacer"></div>
              <span className="chip warn"><span className="chip-dot" style={{ background: "var(--warn)" }}></span>{reviewQueue.length} to review</span>
            </div>
            <table className="tbl">
              <tbody>
                {reviewQueue.map(p => (
                  <tr key={p.id} style={{ cursor: "pointer" }} onClick={() => openPost(p)}>
                    <td style={{ width: 54 }}>
                      <div className="ph" style={{ width: 40, height: 40, borderRadius: 8 }}>
                        <Icon n="image" s={14} style={{ color: "var(--faint)" }} />
                      </div>
                    </td>
                    <td>
                      <div className="t-title" style={{ lineHeight: 1.3 }}>{p.title}</div>
                      <div className="row" style={{ gap: 8, marginTop: 5 }}>
                        <CatChip cat={p.cat} />
                        <span className="t-sub">{p.words.toLocaleString()} words · {p.readMin} min</span>
                      </div>
                    </td>
                    <td style={{ textAlign: "right", width: 90 }}>
                      <span className={`chip ${scoreClass(p.seoScore)}`}>SEO {p.seoScore}</span>
                    </td>
                    <td style={{ width: 40, textAlign: "right", color: "var(--faint)" }}><Icon n="arrowR" s={16} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <div className="card-head">
              <Icon n="trend" s={17} style={{ color: "var(--accent)" }} />
              <h3>Organic clicks</h3>
              <span className="sub">· last 28 days · GSC</span>
              <div className="spacer"></div>
              <span className="chip green"><Icon n="arrowUp" s={11} /> +29%</span>
            </div>
            <div className="card-pad" style={{ paddingTop: 14 }}>
              <Sparkline data={D.TRAFFIC_SERIES} h={88} w={560} />
              <div className="row" style={{ justifyContent: "space-between", marginTop: 10 }}>
                <span className="t-sub">May 24</span>
                <span className="t-sub">Today · 151 clicks</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: activity feed */}
        <div className="card">
          <div className="card-head">
            <Icon n="bolt" s={17} style={{ color: "var(--accent)" }} />
            <h3>Automation log</h3>
            <div className="spacer"></div>
            <span className="auto-line"><span className="spin"></span> live</span>
          </div>
          <div className="card-pad" style={{ paddingTop: 6, paddingBottom: 8 }}>
            <div className="feed">
              {D.ACTIVITY.map((a, i) => (
                <div className="feed-item" key={i}>
                  <div className="feed-ic" style={{ background: feedColor(a.color), color: feedInk(a.color) }}>
                    <Icon n={a.ic} s={15} />
                  </div>
                  <div className="feed-tx" dangerouslySetInnerHTML={{ __html: a.tx }}></div>
                  <div className="feed-tm">{a.tm}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* trend radar teaser */}
      <div className="section-title">
        <span className="eyebrow">Radar</span>
        <h2>Fresh topics worth writing</h2>
        <div className="spacer"></div>
        <a className="link" onClick={() => setView("trends")}>See all {D.TRENDS.length} <Icon n="arrowR" s={13} /></a>
      </div>
      <div className="trend-grid">
        {D.TRENDS.slice(0, 3).map(t => <TrendCard key={t.id} t={t} push={push} />)}
      </div>
    </div>
  );
}

/* ---------- Trend card (shared) ---------- */
function TrendCard({ t, push }) {
  const [queued, setQueued] = useState(t.queued);
  return (
    <div className="trend-card">
      <div className="tc-top">
        <CatChip cat={t.cat} />
        <span className="chip green"><Icon n="arrowUp" s={11} /> {t.growth}</span>
      </div>
      <h3>{t.title}</h3>
      <div className="tc-src">{t.source}</div>
      <div className="tc-metrics">
        <div className="tc-metric"><div className="mn">{t.volume}</div><div className="ml">Volume / mo</div></div>
        <div className="tc-metric"><div className="mn">{t.difficulty}</div><div className="ml">Difficulty</div></div>
        <div className="tc-metric"><div className="mn" style={{ display: "flex" }}><Relevance n={t.relevance} /></div><div className="ml">Fit for you</div></div>
      </div>
      <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 14, lineHeight: 1.5 }}>
        <span style={{ color: "var(--accent)", fontWeight: 600 }}>Why: </span>{t.why}
      </div>
      <div className="tc-foot">
        {queued
          ? <button className="btn btn-soft btn-sm" style={{ flex: 1 }} disabled><Icon n="check" s={14} /> Queued to pipeline</button>
          : <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => { setQueued(true); push && push("Topic queued, drafting starts automatically"); }}>
              <Icon n="plus" s={14} /> Queue for draft
            </button>}
        <button className="btn btn-ghost btn-sm"><Icon n="external" s={14} /></button>
      </div>
    </div>
  );
}

function TrendsView({ push }) {
  const D = window.ADMIN;
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const runScan = () => {
    setScanning(true); setScanned(false);
    setTimeout(() => { setScanning(false); setScanned(true); push && push("Scan complete · 6 topics above threshold"); }, 2200);
  };
  return (
    <div className="view-wrap stack">
      <div className="card">
        <div className="card-pad" style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
          <div className="kpi-ic" style={{ width: 44, height: 44, borderRadius: 12 }}><Icon n="radar" s={22} /></div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>Topic discovery</div>
            <div style={{ fontSize: 12.5, color: "var(--slate)", marginTop: 3 }}>
              Scans Google Trends, Reddit, Hacker News & X for rising topics in your niches, then scores each on search volume, difficulty and fit to your profile.
            </div>
          </div>
          <div className="row" style={{ gap: 10 }}>
            <div className="row" style={{ gap: 7, fontSize: 12, color: "var(--dusk)" }}>
              <span className="toggle on"></span> Auto-scan daily
            </div>
            <button className={`btn ${scanning ? "btn-ghost" : "btn-primary"}`} onClick={runScan} disabled={scanning}>
              {scanning ? <><span className="spin"></span> Scanning…</> : <><Icon n="refresh" s={15} /> Scan now</>}
            </button>
          </div>
        </div>
      </div>

      {scanned && (
        <div className="chip green" style={{ alignSelf: "flex-start" }}><Icon n="check" s={12} /> Just scanned · 2 new topics since yesterday</div>
      )}

      <div className="row wrap" style={{ gap: 8 }}>
        <button className="btn btn-dark btn-sm"><Icon n="filter" s={13} /> All niches</button>
        {["SEO","AI","Power BI","Cloud"].map(c => <button key={c} className="btn btn-ghost btn-sm">{c}</button>)}
        <div style={{ flex: 1 }}></div>
        <span className="t-sub" style={{ alignSelf: "center" }}>Sorted by fit × growth</span>
      </div>

      <div className="trend-grid">
        {D.TRENDS.map(t => <TrendCard key={t.id} t={t} push={push} />)}
      </div>
    </div>
  );
}

Object.assign(window, { DashboardView, TrendsView, TrendCard });

/* ===== SOURCE: view-pipeline.jsx ===== */
/* =====================================================
   VIEW: Blog Pipeline (kanban) + Draft editor drawer
   The drawer is the heart: AI draft, humanize, SEO checklist,
   meta/OG, image prompt, then manual image + publish.
   ===================================================== */

const STAGE_META = {
  discover:  { color: "var(--info)",   bg: "var(--info-bg)",   icon: "radar" },
  outline:   { color: "var(--info)",   bg: "var(--info-bg)",   icon: "list" },
  draft:     { color: "var(--purple)", bg: "rgba(124,58,237,.1)", icon: "pen" },
  humanize:  { color: "var(--purple)", bg: "rgba(124,58,237,.1)", icon: "sparkle" },
  seo:       { color: "var(--accent)", bg: "var(--accent-soft)", icon: "gauge" },
  image:     { color: "var(--accent)", bg: "var(--accent-soft)", icon: "image" },
  review:    { color: "var(--warn)",   bg: "var(--warn-bg)",   icon: "eye" },
  published: { color: "var(--good)",   bg: "var(--good-bg)",   icon: "globe" },
};

function PipelineView({ openPost }) {
  const D = window.ADMIN;
  const cols = D.STAGES;
  return (
    <div className="view-wrap stack">
      <div className="row wrap" style={{ gap: 10 }}>
        <span className="chip accent"><Icon n="zap" s={12} /> 5 posts auto-advancing</span>
        <span className="chip warn"><Icon n="eye" s={12} /> 2 waiting on you</span>
        <span className="chip green"><Icon n="globe" s={12} /> 3 published</span>
        <div style={{ flex: 1 }}></div>
        <div className="row" style={{ gap: 7, fontSize: 12, color: "var(--dusk)" }}>
          <span className="toggle on"></span> Auto-advance stages
        </div>
      </div>

      <div className="kanban scroll">
        {cols.map(col => {
          const posts = D.POSTS.filter(p => p.stage === col.id);
          const m = STAGE_META[col.id];
          return (
            <div className="kan-col" key={col.id}>
              <div className="kan-col-h">
                <div className="kc-ic" style={{ background: m.bg, color: m.color }}><Icon n={m.icon} s={13} /></div>
                <span className="nm">{col.name}</span>
                <span className="ct">{posts.length}</span>
              </div>
              <div className="kan-body scroll">
                {posts.length === 0 && <div className="empty" style={{ padding: 20, fontSize: 12 }}>·</div>}
                {posts.map(p => (
                  <div className="kan-card" key={p.id} onClick={() => openPost(p)}>
                    <div className="row" style={{ justifyContent: "space-between" }}>
                      <CatChip cat={p.cat} />
                      {p.seoScore != null && <span className={`chip ${scoreClass(p.seoScore)}`} style={{ padding: "2px 7px" }}>{p.seoScore}</span>}
                    </div>
                    <div className="kt">{p.title}</div>
                    {p.auto ? (
                      <div className="auto-line"><span className="spin"></span> {p.autoNote}</div>
                    ) : p.stage === "review" ? (
                      <div className="row" style={{ gap: 6, fontFamily: "var(--mono)", fontSize: 10, color: "var(--warn)" }}>
                        <Icon n="eye" s={11} /> needs image + publish
                      </div>
                    ) : (
                      <div className="kmeta"><span>{p.views ? p.views + " views" : ""}</span><span>{p.updated}</span></div>
                    )}
                    {p.auto && <div className="kbar"><i style={{ width: p.progress + "%" }}></i></div>}
                    <div className="kmeta" style={{ marginTop: 9 }}>
                      <span className="mono">{p.keyword}</span>
                      <span>{p.updated}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ====================== DRAFT EDITOR DRAWER ====================== */

const SEO_CHECKS = (p, body, meta) => {
  const kw = (p.keyword || "").toLowerCase();
  const titleHas = (meta.title || p.title || "").toLowerCase().includes(kw.split(" ")[0]);
  const descLen = (meta.desc || "").length;
  const wordOk = (p.words || (body ? body.split(/\s+/).length : 0)) >= 1000;
  return [
    { group: "Basic SEO", items: [
      { label: <span>Focus keyword <b>in SEO title</b></span>, state: titleHas ? "ok" : "warn" },
      { label: <span>Focus keyword <b>in meta description</b></span>, state: (meta.desc||"").toLowerCase().includes(kw.split(" ")[0]) ? "ok" : "warn" },
      { label: <span>Keyword <b>in URL slug</b></span>, state: (p.slug||"").includes(kw.split(" ")[0]) ? "ok" : "bad" },
      { label: <span>Keyword in <b>first 10%</b> of content</span>, state: "ok" },
      { label: <span>Content is <b>{p.words||0} words</b> (1000+ target)</span>, state: wordOk ? "ok" : "warn" },
    ]},
    { group: "Additional", items: [
      { label: <span>Keyword in <b>subheadings (H2/H3)</b></span>, state: "ok" },
      { label: <span><b>Image alt text</b> uses keyword</span>, state: p.hasImage ? "ok" : "bad" },
      { label: <span>Keyword density <b>0.9%</b> (ideal)</span>, state: "ok" },
      { label: <span><b>3 internal links</b> to related posts</span>, state: "ok" },
      { label: <span><b>2 external</b> authority links</span>, state: "warn" },
    ]},
    { group: "Title readability", items: [
      { label: <span>Title has a <b>positive/power word</b></span>, state: "ok" },
      { label: <span>Title has a <b>number</b></span>, state: /\d/.test(meta.title||p.title) ? "ok" : "warn" },
      { label: <span>SEO title <b>{(meta.title||p.title||"").length}/60 chars</b></span>, state: (meta.title||p.title||"").length <= 60 ? "ok" : "warn" },
    ]},
    { group: "Meta & social", items: [
      { label: <span>Meta description <b>{descLen}/160 chars</b></span>, state: descLen >= 120 && descLen <= 160 ? "ok" : descLen ? "warn" : "bad" },
      { label: <span><b>Open Graph</b> title + description set</span>, state: meta.title && meta.desc ? "ok" : "warn" },
      { label: <span><b>OG image</b> (1200×630) attached</span>, state: p.hasImage ? "ok" : "bad" },
      { label: <span><b>Twitter card</b> = summary_large_image</span>, state: "ok" },
    ]},
  ];
};

function CheckRow({ c }) {
  const ic = c.state === "ok" ? "check" : c.state === "warn" ? "alert" : "x";
  return (
    <div className={`check ${c.state}`}>
      <span className="ci"><Icon n={ic} s={11} /></span>
      <span>{c.label}</span>
    </div>
  );
}

const PIPELINE_TABS = [
  { id: "blueprint", label: "Blueprint", icon: "flask" },
  { id: "content", label: "Content", icon: "doc" },
  { id: "seo", label: "SEO", icon: "gauge" },
  { id: "social", label: "Meta & OG", icon: "tag" },
  { id: "image", label: "Image", icon: "image" },
];

function DraftDrawer({ post, onClose, onPublish, push }) {
  const open = !!post;
  const [tab, setTab] = useState("content");
  const [body, setBody] = useState("");
  const [meta, setMeta] = useState({ title: "", desc: "", slug: "" });
  const [busy, setBusy] = useState(null); // 'draft' | 'humanize' | 'meta' | 'image'
  const [imgPrompt, setImgPrompt] = useState("");
  const [hasImage, setHasImage] = useState(false);
  const [bp, setBp] = useState(defaultBlueprint());
  const [previewMode, setPreviewMode] = useState("preview");

  useEffect(() => {
    if (post) {
      setTab("content");
      setBody(post.body || richSampleBody(post));
      setMeta({ title: post.metaTitle || post.title, desc: post.metaDesc || "", slug: post.slug || "" });
      setImgPrompt(post.imagePrompt || "");
      setHasImage(!!post.hasImage);
    }
  }, [post]);

  if (!post) return <><div className="drawer-overlay" /><div className="drawer" /></>;

  const seoGroups = SEO_CHECKS(post, body, meta);
  const allChecks = seoGroups.flatMap(g => g.items);
  const okCount = allChecks.filter(c => c.state === "ok").length;
  const liveScore = Math.round((okCount / allChecks.length) * 100);

  /* ---- real AI calls via window.claude.complete ---- */
  async function genDraft() {
    setBusy("draft");
    try {
      const internal = portfolioTargets().map(x => `[${x.t}](${x.u})`).join(", ");
      const prompt = buildPrompt(post, { ...bp, _internal: internal });
      const out = await window.claude.complete(prompt);
      setBody(out.trim());
      setPreviewMode("preview");
      push("Draft generated from your blueprint + profile");
    } catch (e) { push("Generation unavailable, kept the existing draft"); }
    setBusy(null);
  }

  async function genHumanize() {
    setBusy("humanize");
    try {
      const out = await window.claude.complete(
        `Rewrite the following blog draft to sound more human and less AI-generated. Vary sentence length, add a little personality and one concrete aside, cut hedging and repetition, keep all headings and meaning. No em-dashes. Return only the rewritten markdown.\n\n---\n${body}`
      );
      setBody(out.trim());
      push("Humanized, readability improved");
    } catch (e) { push("Humanize unavailable right now"); }
    setBusy(null);
  }

  async function genMeta() {
    setBusy("meta");
    try {
      const out = await window.claude.complete(
        `For a blog post titled "${post.title}" with focus keyword "${post.keyword}", return STRICT JSON only: {"title":"SEO title under 60 chars including the keyword","desc":"meta description 140-160 chars, compelling, includes the keyword, no em-dashes","slug":"kebab-case-url-slug"}. No commentary.`
      );
      const m = JSON.parse(out.match(/\{[\s\S]*\}/)[0]);
      setMeta(prev => ({ ...prev, ...m }));
      push("Meta + OG tags generated");
    } catch (e) { push("Couldn't parse meta, try again"); }
    setBusy(null);
  }

  async function genImagePrompt() {
    setBusy("image");
    try {
      const out = await window.claude.complete(
        `Write a single richly-detailed image-generation prompt for the cover image of a blog post titled "${post.title}". Editorial, premium tech-blog aesthetic, emerald + warm-white palette, no text, no logos, 1600x900. One paragraph, return only the prompt.`
      );
      setImgPrompt(out.trim());
      push("Image prompt ready, generate it then drop it in");
    } catch (e) { push("Prompt generation unavailable"); }
    setBusy(null);
  }

  return (
    <>
      <div className={`drawer-overlay ${open ? "open" : ""}`} onClick={onClose} />
      <div className={`drawer ${open ? "open" : ""}`}>
        <div className="drawer-top">
          <button className="icon-btn" onClick={onClose}><Icon n="x" s={17} /></button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="row" style={{ gap: 8 }}>
              <CatChip cat={post.cat} />
              <span className="chip gray"><Icon n={STAGE_META[post.stage].icon} s={11} /> {post.stage}</span>
            </div>
            <h2 style={{ marginTop: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{post.title}</h2>
          </div>
          <div className="dial-wrap" style={{ flexShrink: 0 }}>
            <Dial value={liveScore} size={56} stroke={6} label="SEO" />
          </div>
        </div>

        {/* tabs */}
        <div className="row" style={{ gap: 4, padding: "10px 24px 0", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
          {PIPELINE_TABS.map(t => (
            <button key={t.id} className="nav-item" onClick={() => setTab(t.id)}
              style={{ width: "auto", padding: "9px 14px", borderRadius: "9px 9px 0 0",
                color: tab === t.id ? "var(--accent)" : "var(--dusk)",
                background: tab === t.id ? "var(--accent-soft)" : "transparent",
                borderBottom: tab === t.id ? "2px solid var(--accent)" : "2px solid transparent" }}>
              <Icon n={t.icon} s={15} /> <span>{t.label}</span>
            </button>
          ))}
        </div>

        <div className="drawer-body scroll">
          {tab === "blueprint" && (
            <BlueprintTab bp={bp} setBp={setBp} post={post}
              onInsert={(md) => { setBody(b => (b ? b + "\n\n" : "") + md); push("Inserted into draft"); }} />
          )}

          {tab === "content" && (
            <div className="stack" style={{ gap: 14 }}>
              <div className="row wrap" style={{ gap: 8 }}>
                <button className="btn btn-soft btn-sm" onClick={genDraft} disabled={busy}>
                  {busy === "draft" ? <><span className="spin"></span> Writing…</> : <><Icon n="pen" s={14} /> Generate draft</>}
                </button>
                <button className="btn btn-soft btn-sm" onClick={genHumanize} disabled={busy || !body}>
                  {busy === "humanize" ? <><span className="spin"></span> Humanizing…</> : <><Icon n="sparkle" s={14} /> Humanize</>}
                </button>
                <div className="model-pill row" style={{ gap: 6, marginLeft: 2 }}>
                  <select className="sel" defaultValue="groq1" title="Generation model">
                    <option value="groq1">Groq · Llama-3.3-70B</option>
                    <option value="groq2">Groq · Mixtral-8x7B</option>
                    <option value="azure">Azure OpenAI · GPT-4o</option>
                  </select>
                </div>
                <div className="seg" style={{ marginLeft: "auto" }}>
                  <button className={previewMode === "preview" ? "on" : ""} onClick={() => setPreviewMode("preview")}>Preview</button>
                  <button className={previewMode === "markdown" ? "on" : ""} onClick={() => setPreviewMode("markdown")}>Markdown</button>
                </div>
                <span className="chip gray">{body ? body.split(/\s+/).filter(Boolean).length : 0} words</span>
              </div>
              <div className="card">
                <div className="card-head" style={{ padding: "11px 16px" }}>
                  <Icon n="doc" s={15} style={{ color: "var(--dusk)" }} />
                  <h3 style={{ fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{post.title}</h3>
                  <div className="spacer"></div>
                  <span className="auto-line" style={{ color: "var(--good)" }}><Icon n="check" s={12} /> Blueprint applied</span>
                </div>
                {previewMode === "preview"
                  ? <div style={{ padding: "20px 22px" }}><ReadingPreview body={body} post={post} /></div>
                  : <textarea className="ta" value={body} onChange={e => setBody(e.target.value)}
                      style={{ border: "none", borderRadius: 0, minHeight: 460, fontSize: 13.5, lineHeight: 1.7, padding: "16px 18px" }} />}
              </div>
            </div>
          )}

          {tab === "seo" && (
            <div className="grid-2b" style={{ alignItems: "start", gridTemplateColumns: "1.2fr 1fr" }}>
              <div className="card card-pad">
                <div className="row" style={{ gap: 16, marginBottom: 4 }}>
                  <Dial value={liveScore} size={84} stroke={8} />
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>{scoreWord(liveScore)} · {okCount}/{allChecks.length} passed</div>
                    <div style={{ fontSize: 12.5, color: "var(--slate)", marginTop: 4, lineHeight: 1.5 }}>
                      On-page analysis for <b className="mono" style={{ color: "var(--accent-strong)" }}>{post.keyword}</b>. Fix the flagged items to push past 80.
                    </div>
                    <div className="row" style={{ gap: 14, marginTop: 12 }}>
                      <span className="t-sub"><b style={{ color: "var(--good)" }}>{allChecks.filter(c=>c.state==="ok").length}</b> good</span>
                      <span className="t-sub"><b style={{ color: "var(--warn)" }}>{allChecks.filter(c=>c.state==="warn").length}</b> improve</span>
                      <span className="t-sub"><b style={{ color: "var(--bad)" }}>{allChecks.filter(c=>c.state==="bad").length}</b> errors</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card card-pad seo-groups">
                {seoGroups.map((g, i) => (
                  <div className="seo-group" key={i}>
                    <div className="seo-group-h">{g.group}<span className="ct chip gray">{g.items.filter(x=>x.state==="ok").length}/{g.items.length}</span></div>
                    {g.items.map((c, j) => <CheckRow c={c} key={j} />)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "social" && (
            <div className="stack" style={{ gap: 18 }}>
              <button className="btn btn-soft btn-sm" style={{ alignSelf: "flex-start" }} onClick={genMeta} disabled={busy}>
                {busy === "meta" ? <><span className="spin"></span> Generating…</> : <><Icon n="zap" s={14} /> Auto-generate meta + OG</>}
              </button>
              <div className="grid-2b" style={{ alignItems: "start" }}>
                <div className="card card-pad">
                  <div className="field">
                    <label>SEO title <span className={`count ${(meta.title||"").length>60?"over":(meta.title||"").length>=30?"ok":""}`}>{(meta.title||"").length}/60</span></label>
                    <input className="inp" value={meta.title} onChange={e => setMeta({ ...meta, title: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Meta description <span className={`count ${(meta.desc||"").length>160?"over":(meta.desc||"").length>=120?"ok":""}`}>{(meta.desc||"").length}/160</span></label>
                    <textarea className="ta" value={meta.desc} onChange={e => setMeta({ ...meta, desc: e.target.value })} style={{ minHeight: 70 }} />
                  </div>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label>URL slug</label>
                    <div className="row" style={{ gap: 0 }}>
                      <span className="mono" style={{ fontSize: 12, color: "var(--dusk)", padding: "10px 0 10px 12px", background: "var(--mist)", borderRadius: "9px 0 0 9px", border: "1px solid var(--border)", borderRight: "none" }}>/blog/</span>
                      <input className="inp" value={meta.slug} onChange={e => setMeta({ ...meta, slug: e.target.value })} style={{ borderRadius: "0 9px 9px 0" }} />
                    </div>
                  </div>
                </div>
                <div className="stack" style={{ gap: 14 }}>
                  <div>
                    <div className="t-sub" style={{ marginBottom: 8 }}>Google preview</div>
                    <div className="serp">
                      <div className="u"><Icon n="globe" s={12} /> meetpatel.dev › blog › {meta.slug}</div>
                      <div className="t">{meta.title || post.title}</div>
                      <div className="d">{meta.desc || "Add a meta description to preview the snippet."}</div>
                    </div>
                  </div>
                  <div>
                    <div className="t-sub" style={{ marginBottom: 8 }}>Social card (OG)</div>
                    <div className="card" style={{ overflow: "hidden" }}>
                      {hasImage ? <div className="ph" style={{ height: 150, borderRadius: 0 }}><Icon n="image" s={22} style={{ color: "var(--faint)" }} /></div>
                        : <PhImage h={150} label="OG image needed · 1200×630" style={{ borderRadius: 0, border: "none", borderBottom: "1px solid var(--border)" }} />}
                      <div style={{ padding: "11px 14px" }}>
                        <div className="t-sub">MEETPATEL.DEV</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", marginTop: 3, lineHeight: 1.3 }}>{meta.title || post.title}</div>
                        <div style={{ fontSize: 12, color: "var(--dusk)", marginTop: 4 }}>{(meta.desc||"").slice(0, 90)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "image" && (
            <div className="grid-2b" style={{ alignItems: "start" }}>
              <div className="stack" style={{ gap: 14 }}>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <div className="t-sub">Generated image prompt</div>
                  <button className="btn btn-soft btn-sm" onClick={genImagePrompt} disabled={busy}>
                    {busy === "image" ? <><span className="spin"></span> Writing…</> : <><Icon n="refresh" s={13} /> Regenerate</>}
                  </button>
                </div>
                <div className="prompt-box">
                  <button className="copy btn btn-ghost btn-sm" onClick={() => { navigator.clipboard?.writeText(imgPrompt); push("Prompt copied"); }} style={{ background: "rgba(255,255,255,.1)", borderColor: "rgba(255,255,255,.15)", color: "#d6e4dc" }}><Icon n="copy" s={13} /></button>
                  {imgPrompt || "Click Regenerate to build a cover-image prompt from this post."}
                </div>
                <div className="card card-pad" style={{ fontSize: 12, color: "var(--slate)", lineHeight: 1.6 }}>
                  <div className="row" style={{ gap: 8, marginBottom: 6 }}><Icon n="alert" s={14} style={{ color: "var(--warn)" }} /><b style={{ color: "var(--ink)" }}>Your manual step</b></div>
                  Paste this into Midjourney / DAL·E / your tool, generate the image, then drop the result here. Everything else is automated.
                </div>
              </div>
              <div className="stack" style={{ gap: 12 }}>
                <div className="t-sub">Cover image · 1600×900</div>
                {hasImage ? (
                  <div className="card" style={{ overflow: "hidden" }}>
                    <div className="ph" style={{ height: 180, borderRadius: 0 }}><Icon n="check" s={26} style={{ color: "var(--good)" }} /></div>
                    <div className="row" style={{ padding: "10px 14px", justifyContent: "space-between" }}>
                      <span className="t-sub" style={{ color: "var(--good)" }}><Icon n="check" s={12} /> Image attached</span>
                      <button className="btn btn-ghost btn-sm" onClick={() => setHasImage(false)}><Icon n="trash" s={13} /> Remove</button>
                    </div>
                  </div>
                ) : (
                  <div className="dropzone" onClick={() => { setHasImage(true); push("Image attached, ready to publish"); }}>
                    <div className="dz-ic"><Icon n="upload" s={20} /></div>
                    <div className="dz-t">Drop cover image or click to upload</div>
                    <div className="dz-s">PNG or JPG · 1600×900 · the OG crop is auto-made</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="drawer-foot">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <span className="t-sub" style={{ marginLeft: 4 }}>
            {hasImage ? <span style={{ color: "var(--good)" }}><Icon n="check" s={12} /> Image ready</span> : <span style={{ color: "var(--warn)" }}><Icon n="alert" s={12} /> Add an image to publish</span>}
          </span>
          <div style={{ flex: 1 }}></div>
          <button className="btn btn-ghost"><Icon n="clock" s={15} /> Schedule</button>
          <button className="btn btn-primary" disabled={!hasImage} onClick={() => { onPublish(post); push("Published to meetpatel.dev/blog 🎉"); }}>
            <Icon n="rocket" s={15} /> Publish now
          </button>
        </div>
      </div>
    </>
  );
}

function sampleBody(p) {
  return `Most teams I talk to assume their ${p.cat} setup is "fine" until a bill, a benchmark, or a stakeholder proves otherwise. ${p.excerpt} Here is exactly how I approach it, end to end, from a real project rather than a textbook.

## Where the problem actually starts

The first thing I do is measure before I touch anything. You cannot improve what you have not baselined, and most of the wins hide in places nobody is looking.

### The quick audit

I pull the current numbers, tag the obvious offenders, and rank them by effort versus payoff. Nine times out of ten, a handful of items account for most of the pain.

## The changes that moved the needle

This is where the real work happens. I walk through each fix, why it works, and the trade-offs I weighed before shipping it.

## What I would do differently

No project is perfect. Here is what I would tighten next time, and the one thing I would not bother with again.

## Takeaway

Start with measurement, fix the few things that matter, and automate the audit so it never drifts again. That is the whole game.`;
}

Object.assign(window, { PipelineView, DraftDrawer, STAGE_META });

/* ===== SOURCE: view-inbox.jsx ===== */
/* =====================================================
   VIEW: Query Inbox (with AI reply composer)
   ===================================================== */

function tagChip(tag) {
  const m = { Lead: "green", Recruiter: "info", Networking: "purple" };
  return <span className={`chip ${m[tag] || "gray"}`}>{tag}</span>;
}

function InboxView({ push }) {
  const D = window.ADMIN;
  const [sel, setSel] = useState(D.QUERIES[0]);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [tone, setTone] = useState("Warm & professional");

  async function draftReply() {
    setBusy(true);
    try {
      const out = await window.claude.complete(
        `You are Meet Patel, an Azure-certified IT Business Analyst, data analyst (Power BI, Python, SQL) and freelance web developer in Saint John, New Brunswick. Email: patelmeet20112000@gmail.com.

Write a reply to this contact-form message. Tone: ${tone}. Be specific, helpful and concise (max ~140 words). If it's a lead, propose a concrete next step (a short discovery call) and one clarifying question. No em-dashes, no fluff, sign off as "Meet".

From: ${sel.name} (${sel.company})
Subject: ${sel.subject}
Message: ${sel.body}

Return only the reply body.`
      );
      setReply(out.trim());
      push("Reply drafted, review and send");
    } catch (e) { push("Draft unavailable right now"); }
    setBusy(false);
  }

  function pick(q) { setSel(q); setReply(""); }

  return (
    <div className="view-wrap">
      <div className="inbox">
        <div className="inbox-list scroll">
          <div className="row" style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", gap: 8 }}>
            <button className="btn btn-dark btn-sm">All</button>
            <button className="btn btn-ghost btn-sm">Leads</button>
            <button className="btn btn-ghost btn-sm">Unread</button>
            <div style={{ flex: 1 }}></div>
            <span className="chip accent">{D.QUERIES.filter(q=>q.unread).length} new</span>
          </div>
          {D.QUERIES.map(q => (
            <div className={`q-item ${sel.id === q.id ? "active" : ""}`} key={q.id} onClick={() => pick(q)}>
              <div className="q-top">
                {q.unread && <span className="unread"></span>}
                <span className="q-name">{q.name}</span>
                <span className="q-time">{q.time}</span>
              </div>
              <div className="q-subj">{q.subject}</div>
              <div className="q-prev">{q.body}</div>
              <div className="row" style={{ gap: 6, marginTop: 2 }}>{tagChip(q.tag)}{q.budget !== "·" && <span className="chip gray">{q.budget}</span>}</div>
            </div>
          ))}
        </div>

        <div className="inbox-detail">
          <div className="inbox-detail-body scroll">
            <div className="row" style={{ justifyContent: "space-between", marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.01em" }}>{sel.subject}</div>
                <div className="row" style={{ gap: 8, marginTop: 6 }}>{tagChip(sel.tag)}{sel.budget !== "·" && <span className="chip green">Budget · {sel.budget}</span>}</div>
              </div>
              <div className="row" style={{ gap: 8 }}>
                <button className="icon-btn"><Icon n="star" s={16} /></button>
                <button className="icon-btn"><Icon n="trash" s={16} /></button>
              </div>
            </div>
            <div className="row" style={{ gap: 12, padding: "14px 0", borderBottom: "1px solid var(--border-2)", marginBottom: 18 }}>
              <div className="avatar" style={{ background: "linear-gradient(150deg,var(--info),#1c4f7a)" }}>{sel.name.split(" ").map(s=>s[0]).slice(0,2).join("")}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: "var(--ink)", fontSize: 14 }}>{sel.name} {sel.company !== "·" && <span style={{ color: "var(--dusk)", fontWeight: 400 }}>· {sel.company}</span>}</div>
                <div className="mono" style={{ fontSize: 11.5, color: "var(--accent-strong)" }}>{sel.email}</div>
              </div>
              <span className="t-sub">{sel.time} ago</span>
            </div>
            <div className="msg-bubble">{sel.body}</div>

            <div className="row" style={{ gap: 8, margin: "20px 0 12px", flexWrap: "wrap" }}>
              <span className="t-sub" style={{ marginRight: 4 }}>Reply tone:</span>
              {["Warm & professional", "Short & direct", "Decline politely"].map(t => (
                <button key={t} className={`btn btn-sm ${tone === t ? "btn-dark" : "btn-ghost"}`} onClick={() => setTone(t)}>{t}</button>
              ))}
              <button className="btn btn-soft btn-sm" style={{ marginLeft: "auto" }} onClick={draftReply} disabled={busy}>
                {busy ? <><span className="spin"></span> Drafting…</> : <><Icon n="sparkle" s={14} /> Draft reply</>}
              </button>
            </div>
          </div>
          <div className="reply-area">
            <textarea className="ta" placeholder={`Reply to ${sel.name}… or hit "Draft reply" to let AI write it from context.`} value={reply} onChange={e => setReply(e.target.value)} style={{ minHeight: 96 }} />
            <div className="row" style={{ marginTop: 10 }}>
              <button className="btn btn-ghost btn-sm"><Icon n="doc" s={14} /> Templates</button>
              <div style={{ flex: 1 }}></div>
              <span className="t-sub" style={{ marginRight: 10 }}>Sends from patelmeet20112000@gmail.com</span>
              <button className="btn btn-primary" disabled={!reply} onClick={() => { push("Reply sent to " + sel.name); setReply(""); }}><Icon n="send" s={15} /> Send reply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { InboxView });

/* ===== SOURCE: view-misc.jsx ===== */
/* =====================================================
   VIEWS: Projects manager · SEO Center · Media · Settings
   ===================================================== */

/* ---------------- PROJECTS ---------------- */
function ProjectsView({ push }) {
  const D = window.ADMIN;
  const [filter, setFilter] = useState("all");
  const [items, setItems] = useState(D.PROJECTS);
  const statusChip = { live: ["green","Live"], build: ["warn","In build"], planned: ["gray","Planned"] };
  const shown = filter === "all" ? items : items.filter(p => p.status === filter);

  function toggleVis(id) {
    setItems(items.map(p => p.id === id ? { ...p, visible: !p.visible } : p));
    push("Project visibility updated");
  }

  return (
    <div className="view-wrap stack">
      <div className="kpi-grid">
        <Stat icon="briefcase" val={String(items.length)} sub="Total projects on roadmap" />
        <Stat icon="check" val={String(items.filter(p=>p.status==="live").length)} sub="Shipped & live" />
        <Stat icon="bolt" val={String(items.filter(p=>p.status==="build").length)} sub="In active build" />
        <Stat icon="eye" val={String(items.filter(p=>p.visible).length)} sub="Visible on public site" />
      </div>

      <div className="card">
        <div className="card-head">
          <Icon n="briefcase" s={17} style={{ color: "var(--accent)" }} />
          <h3>Project roadmap</h3>
          <div className="spacer"></div>
          <div className="row" style={{ gap: 6 }}>
            {[["all","All"],["live","Live"],["build","In build"],["planned","Planned"]].map(([k,l]) => (
              <button key={k} className={`btn btn-sm ${filter===k?"btn-dark":"btn-ghost"}`} onClick={() => setFilter(k)}>{l}</button>
            ))}
            <button className="btn btn-primary btn-sm"><Icon n="plus" s={14} /> Add</button>
          </div>
        </div>
        <div>
          {shown.map(p => (
            <div className="proj-row" key={p.id}>
              <div className="pn">{p.num}</div>
              <div>
                <div className="row" style={{ gap: 9 }}>
                  <span className="pt">{p.title}</span>
                  <CatChip cat={p.cat} />
                  <span className={`chip ${statusChip[p.status][0]}`}>{statusChip[p.status][1]}</span>
                </div>
                <div className="pd">{p.desc}</div>
                <div className="row wrap" style={{ gap: 5, marginTop: 7 }}>
                  {p.stack.map(s => <span key={s} className="chip gray" style={{ fontSize: 10 }}>{s}</span>)}
                </div>
              </div>
              <div className="row" style={{ gap: 10 }}>
                <div className="row" style={{ gap: 6, fontSize: 11, color: "var(--dusk)" }}>
                  <span className={`toggle ${p.visible ? "on" : ""}`} onClick={() => toggleVis(p.id)}></span>
                  {p.visible ? "Public" : "Hidden"}
                </div>
                <button className="btn btn-ghost btn-sm"><Icon n="edit" s={13} /> Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- MEDIA ---------------- */
function MediaView({ push }) {
  const D = window.ADMIN;
  const needed = D.MEDIA.filter(m => m.kind === "needed");
  return (
    <div className="view-wrap stack">
      {needed.length > 0 && (
        <div className="card" style={{ borderColor: "var(--warn)", background: "var(--warn-bg)" }}>
          <div className="card-pad row" style={{ gap: 14 }}>
            <Icon n="alert" s={20} style={{ color: "var(--warn)" }} />
            <div style={{ flex: 1 }}>
              <b style={{ color: "var(--ink)" }}>{needed.length} cover images needed</b>
              <span style={{ color: "var(--slate)" }}> · posts in Review are written and waiting on artwork from you.</span>
            </div>
          </div>
        </div>
      )}
      <div className="card">
        <div className="card-head">
          <Icon n="image" s={17} style={{ color: "var(--accent)" }} />
          <h3>Media library</h3>
          <span className="sub">· hero & OG images</span>
          <div className="spacer"></div>
          <button className="btn btn-primary btn-sm" onClick={() => push("Upload dialog (prototype)")}><Icon n="upload" s={14} /> Upload</button>
        </div>
        <div className="card-pad">
          <div className="media-grid">
            {D.MEDIA.map(m => (
              <div className="media-card" key={m.id}>
                {m.kind === "needed"
                  ? <div className="ph media-thumb"><span className="ph-l">Needed</span></div>
                  : <div className="media-thumb" style={{ background: `linear-gradient(135deg, ${tint(m.cat)}, ${tint(m.cat,1)})`, display: "grid", placeItems: "center" }}><Icon n="image" s={24} style={{ color: "rgba(255,255,255,.7)" }} /></div>}
                <div className="media-meta">
                  <div className="mn">{m.name}</div>
                  <div className="ms">{m.dim} · {m.size}{m.kind==="needed" && <span style={{ color: "var(--warn)" }}> · upload</span>}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
function tint(cat, alt) {
  const m = { seo: ["#0E8A6B","#0A6E55"], ai: ["#7C3AED","#5b21b6"], bi: ["#2A6FB0","#1c4f7a"], cloud: ["#2A6FB0","#1c4f7a"] };
  return (m[cat] || ["#6F7670","#3B423C"])[alt ? 1 : 0];
}

/* ---------------- SETTINGS ---------------- */
const INTEGRATIONS = [
  { name: "Groq API", desc: "Fast drafting, humanizing & meta generation (Llama-3.3-70B)", on: true, logo: "Gq", bg: "#F55036" },
  { name: "WordPress REST", desc: "Publishes approved drafts to meetpatel.dev/blog", on: true, logo: "WP", bg: "#21759b" },
  { name: "Google Search Console", desc: "Rankings, clicks, indexation & Core Web Vitals", on: true, logo: "G", bg: "#4285F4" },
  { name: "Azure OpenAI", desc: "Fallback model for drafting & meta", on: true, logo: "AI", bg: "#0E8A6B" },
  { name: "X / Twitter", desc: "Auto-shares new posts via AutoShare plugin", on: true, logo: "X", bg: "#111" },
  { name: "Ahrefs / keyword API", desc: "Search volume & difficulty for Trend Radar", on: false, logo: "Ah", bg: "#ff8800" },
  { name: "Midjourney", desc: "Manual: you run image prompts here", on: false, logo: "Mj", bg: "#4945ff" },
];
function SettingsView({ push }) {
  const [integ, setInteg] = useState(INTEGRATIONS);
  const [autos, setAutos] = useState({ discover: true, draft: true, humanize: true, seo: true, image: true, publish: false });
  const autoRows = [
    ["discover", "Auto-discover topics daily", "Scan the web and queue topics above your fit threshold"],
    ["draft", "Auto-draft queued topics", "Write a full draft from profile.md the moment a topic is queued"],
    ["humanize", "Auto-humanize every draft", "Run the de-robotify pass before SEO scoring"],
    ["seo", "Auto-score SEO + generate meta/OG", "Score on-page, write meta title, description and OG tags"],
    ["image", "Auto-generate image prompts", "Build the cover-image prompt and save to draft"],
    ["publish", "Auto-publish after review", "Off by design: nothing goes live without your approval"],
  ];
  return (
    <div className="view-wrap stack" style={{ maxWidth: 920 }}>
      <div className="card">
        <div className="card-head"><Icon n="zap" s={17} style={{ color: "var(--accent)" }} /><h3>Automation rules</h3><span className="sub">· what runs hands-off</span></div>
        <div>
          {autoRows.map(([k, t, d]) => (
            <div className="intg" key={k}>
              <div className="intg-info">
                <div className="in">{t}</div>
                <div className="id">{d}</div>
              </div>
              <span className={`toggle ${autos[k] ? "on" : ""}`} onClick={() => { setAutos({ ...autos, [k]: !autos[k] }); push("Automation rule updated"); }}></span>
            </div>
          ))}
        </div>
        <div className="card-pad" style={{ borderTop: "1px solid var(--border-2)", background: "var(--mist)", fontSize: 12, color: "var(--slate)", display: "flex", gap: 9, alignItems: "center" }}>
          <Icon n="alert" s={15} style={{ color: "var(--accent)" }} />
          <span>The full chain runs automatically. Your <b style={{ color: "var(--ink)" }}>only</b> manual steps stay: review, add image, publish.</span>
        </div>
      </div>

      <div className="card">
        <div className="card-head"><Icon n="link" s={17} style={{ color: "var(--accent)" }} /><h3>Integrations</h3></div>
        <div>
          {integ.map((it, i) => (
            <div className="intg" key={it.name}>
              <div className="intg-logo" style={{ background: it.bg, color: "#fff" }}>{it.logo}</div>
              <div className="intg-info">
                <div className="in">{it.name}</div>
                <div className="id">{it.desc}</div>
              </div>
              {it.on ? <span className="chip green"><Icon n="check" s={11} /> Connected</span> : <span className="chip gray">Off</span>}
              <span className={`toggle ${it.on ? "on" : ""}`} onClick={() => { setInteg(integ.map((x,j)=>j===i?{...x,on:!x.on}:x)); push(it.name + (it.on?" disconnected":" connected")); }}></span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-head"><Icon n="user" s={17} style={{ color: "var(--accent)" }} /><h3>Site & author</h3></div>
        <div className="card-pad grid-2b">
          <div className="field"><label>Author name</label><input className="inp" defaultValue="Meet Patel" /></div>
          <div className="field"><label>Publish email</label><input className="inp" defaultValue="patelmeet20112000@gmail.com" /></div>
          <div className="field"><label>Site URL</label><input className="inp" defaultValue="https://meetpatel.dev" /></div>
          <div className="field"><label>Default post category</label>
            <select className="sel" defaultValue="SEO"><option>SEO</option><option>AI</option><option>Power BI</option><option>Cloud</option></select>
          </div>
          <div className="field" style={{ gridColumn: "1 / -1", marginBottom: 0 }}>
            <label>Voice & context source</label>
            <div className="row" style={{ gap: 8 }}>
              <input className="inp" defaultValue="profile.md" readOnly style={{ maxWidth: 200 }} />
              <span className="chip green"><Icon n="check" s={11} /> Synced · single source of truth</span>
            </div>
            <div className="hint">All drafts pull voice, facts and project context from this file.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ProjectsView, MediaView, SettingsView });

/* ===== SOURCE: view-seo.jsx ===== */
/* =====================================================
   SEO CENTER — real Rank Math-style content analysis.
   Fetches the actual published blog HTML, parses it and
   scores it live with window.RankMath. No mock numbers.
   ===================================================== */

function useAnalyzablePages() {
  // derive from the real published posts → real files on disk
  return useMemo(function () {
    var D = window.ADMIN;
    return D.POSTS.filter(function (p) { return p.stage === "published"; }).map(function (p) {
      return {
        id: p.id,
        title: p.title,
        file: "../blog/" + p.slug + ".html",
        url: "/blog/" + p.slug,
        keyword: p.keyword,
        metaTitle: p.metaTitle || p.title,
        cat: p.cat,
      };
    });
  }, []);
}

/* ---- small UI bits ---- */
function PointsBadge({ got, max }) {
  var cls = got >= max ? "ok" : got > 0 ? "warn" : "fail";
  return <span className={`rm-pts ${cls}`}>{got}<i>/{max}</i></span>;
}

function SeoCheckRow({ t }) {
  var icon = t.status === "ok" ? "check" : t.status === "warn" ? "alert" : "x";
  return (
    <div className={`check ${t.status}`}>
      <span className="ci"><Icon n={icon} s={11} /></span>
      <div className="ck-body">
        <div className="ck-top"><b>{t.label}</b><PointsBadge got={t.got} max={t.max} /></div>
        {t.tip && <div className="ck-tip">{t.tip}</div>}
      </div>
    </div>
  );
}

function CategoryGroup({ cat, tests }) {
  var [open, setOpen] = useState(true);
  var passed = tests.filter(function (t) { return t.status === "ok"; }).length;
  var got = tests.reduce(function (a, t) { return a + t.got; }, 0);
  var max = tests.reduce(function (a, t) { return a + t.max; }, 0);
  return (
    <div className={`rm-cat ${open ? "open" : ""}`}>
      <button className="rm-cat-h" onClick={function () { setOpen(!open); }}>
        <Icon n="arrowR" s={13} style={{ transition: "transform .18s", transform: open ? "rotate(90deg)" : "none" }} />
        <span className="rm-cat-name">{cat}</span>
        <span className="rm-cat-meta">{passed}/{tests.length} · {got}/{max} pts</span>
      </button>
      {open && <div className="rm-cat-body">{tests.map(function (t) { return <SeoCheckRow key={t.id} t={t} />; })}</div>}
    </div>
  );
}

function StatTile({ k, v, sub, tone }) {
  return (
    <div className={`rm-stat ${tone || ""}`}>
      <div className="v">{v}</div>
      <div className="k">{k}</div>
      {sub && <div className="s">{sub}</div>}
    </div>
  );
}

function DensityBar({ density }) {
  var pct = Math.min(density / 4, 1) * 100;          // scale 0–4%
  var lo = (0.75 / 4) * 100, hi = (2.5 / 4) * 100;   // ideal band
  var col = density >= 0.75 && density <= 2.5 ? "var(--good)" : density > 3.5 ? "var(--bad)" : "var(--warn)";
  return (
    <div className="rm-bar">
      <div className="rm-bar-ideal" style={{ left: lo + "%", width: (hi - lo) + "%" }}></div>
      <div className="rm-bar-fill" style={{ width: pct + "%", background: col }}></div>
      <div className="rm-bar-mark" style={{ left: Math.min(pct, 99) + "%" }}></div>
    </div>
  );
}

/* ---- recommendations: turn failing checks into an action list ---- */
function Recommendations({ result }) {
  var recs = result.tests.filter(function (t) { return t.status !== "ok"; })
    .sort(function (a, b) { return (b.max - b.got) - (a.max - a.got); });
  var gain = recs.reduce(function (a, t) { return a + (t.max - t.got); }, 0);
  if (!recs.length) {
    return (
      <div className="card rm-recs">
        <div className="rm-recs-done">
          <span className="rec-sev ok"><Icon n="check" s={13} /></span>
          <div><b>Every check is passing.</b> This page is fully optimised for its focus keyword. Nothing left to fix.</div>
        </div>
      </div>
    );
  }
  return (
    <div className="card rm-recs">
      <div className="card-head">
        <Icon n="zap" s={17} style={{ color: "var(--accent)" }} />
        <h3>How to improve this score</h3>
        <span className="sub">· SEO strategies, ranked by impact</span>
        <div className="spacer"></div>
        <span className="chip accent" style={{ fontWeight: 700 }}>+{gain} pts available</span>
      </div>
      <div>
        {recs.map(function (t) {
          var sev = t.status === "fail" ? "fail" : "warn";
          return (
            <div className="rec" key={t.id}>
              <span className={`rec-sev ${sev}`}><Icon n={sev === "fail" ? "x" : "alert"} s={12} /></span>
              <div className="rec-body">
                <div className="rec-top"><b>{t.label}</b><span className="rec-cat">{t.cat}</span></div>
                <div className="rec-tip">{t.tip}</div>
              </div>
              <span className="rec-pts">+{t.max - t.got}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---- main view ---- */
function SeoView() {
  var D = window.ADMIN;
  var pages = useAnalyzablePages();

  var [mode, setMode] = useState("page");        // page | paste
  var [sel, setSel] = useState(0);
  var [parsed, setParsed] = useState(null);      // RankMath.extract() result
  var [loading, setLoading] = useState(true);
  var [err, setErr] = useState(null);

  var [keyword, setKeyword] = useState(pages[0] ? pages[0].keyword : "");
  var [title, setTitle] = useState(pages[0] ? pages[0].metaTitle : "");
  var [metaDesc, setMetaDesc] = useState("");
  var [pasteText, setPasteText] = useState("");

  var [avg, setAvg] = useState(null);            // real average across all posts
  var [pageScores, setPageScores] = useState({});

  var page = pages[sel];

  // fetch + parse the selected page
  useEffect(function () {
    if (mode !== "page" || !page) return;
    var alive = true;
    setLoading(true); setErr(null); setParsed(null);
    fetch(page.file, { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.text(); })
      .then(function (html) {
        if (!alive) return;
        var ex = window.RankMath.extract(html);
        setParsed(ex);
        setTitle(ex.seoTitle || page.metaTitle);
        setMetaDesc(ex.metaDesc || "");
        setKeyword(page.keyword);
        setLoading(false);
      })
      .catch(function (e) { if (alive) { setErr(e.message || String(e)); setLoading(false); } });
    return function () { alive = false; };
  }, [sel, mode]);

  // analyze all pages once for a real site average
  useEffect(function () {
    var alive = true;
    Promise.all(pages.map(function (p) {
      return window.RankMath.analyzeUrl(p.file, { keyword: p.keyword, url: p.url, title: p.metaTitle });
    })).then(function (rs) {
      if (!alive) return;
      var scored = rs.filter(function (r) { return r && r.score != null; });
      var map = {};
      pages.forEach(function (p, i) { if (rs[i] && rs[i].score != null) map[p.id] = rs[i].score; });
      setPageScores(map);
      if (scored.length) setAvg(Math.round(scored.reduce(function (a, r) { return a + r.score; }, 0) / scored.length));
    });
    return function () { alive = false; };
  }, []);

  // live analysis of the current page/input
  var result = useMemo(function () {
    if (mode === "paste") {
      if (!pasteText.trim()) return null;
      var isHtml = /<\w+[\s\S]*?>/.test(pasteText);
      return window.RankMath.analyze(isHtml
        ? { html: pasteText, keyword: keyword, url: "/", title: title, metaDesc: metaDesc }
        : { content: pasteText, keyword: keyword, url: "/", title: title, metaDesc: metaDesc });
    }
    if (!parsed) return null;
    return window.RankMath.analyze({ page: parsed, keyword: keyword, url: page ? page.url : "/", title: title, metaDesc: metaDesc });
  }, [mode, parsed, pasteText, keyword, title, metaDesc, sel]);

  var s = result && result.stats;
  var cats = window.RankMath.CATEGORIES;

  return (
    <div className="view-wrap stack">
      {/* KPI row — every number below is computed live */}
      <div className="kpi-grid">
        <Stat icon="gauge" val={result ? String(result.score) : "·"} sub="Live on-page score · this page" delta={result ? result.grade : ""} dir={result && result.score >= 80 ? "up" : result && result.score >= 50 ? "flat" : "down"} />
        <Stat icon="check" val={result ? `${result.passed}<em>/${result.total}</em>` : "·"} sub="SEO tests passing" />
        <Stat icon="star" val={avg != null ? String(avg) : "·"} sub={`Avg score · ${Object.keys(pageScores).length} published posts`} delta={avg != null && avg >= 80 ? "Good" : ""} dir={avg != null && avg >= 80 ? "up" : "flat"} />
        <Stat icon="doc" val={s ? String(s.flesch) : "·"} sub={s ? "Readability · " + s.fleschGrade : "Flesch reading ease"} />
      </div>

      {/* ANALYZER */}
      <div className="card rm-card">
        <div className="card-head">
          <Icon n="gauge" s={17} style={{ color: "var(--accent)" }} />
          <h3>Content Analysis</h3>
          <span className="sub">· live Rank Math engine</span>
          <div className="spacer"></div>
          <div className="seg">
            <button className={mode === "page" ? "on" : ""} onClick={function () { setMode("page"); }}>Published pages</button>
            <button className={mode === "paste" ? "on" : ""} onClick={function () { setMode("paste"); }}>Paste draft</button>
          </div>
        </div>

        <div className="rm-grid">
          {/* LEFT — inputs + score */}
          <div className="rm-left">
            {mode === "page" ? (
              <div className="field">
                <label>Page</label>
                <select className="sel" value={sel} onChange={function (e) { setSel(+e.target.value); }}>
                  {pages.map(function (p, i) { return <option key={p.id} value={i}>{p.title}</option>; })}
                </select>
                <div className="hint">Fetched from {page ? page.file.replace("../", "/") : ""}</div>
              </div>
            ) : (
              <div className="field">
                <label>Paste content <span className="count">{window.RankMath.wordCount(pasteText)} words</span></label>
                <textarea className="ta" style={{ minHeight: 150 }} placeholder="Paste your draft HTML or plain text…" value={pasteText} onChange={function (e) { setPasteText(e.target.value); }}></textarea>
              </div>
            )}

            <div className="field">
              <label>Focus keyword</label>
              <input className="inp" value={keyword} onChange={function (e) { setKeyword(e.target.value); }} placeholder="e.g. reduce azure costs" />
            </div>
            <div className="field">
              <label>SEO title <span className={`count ${title.length > 60 ? "over" : title.length >= 40 ? "ok" : ""}`}>{title.length}/60</span></label>
              <input className="inp" value={title} onChange={function (e) { setTitle(e.target.value); }} />
            </div>
            <div className="field">
              <label>Meta description <span className={`count ${metaDesc.length > 160 ? "over" : metaDesc.length >= 120 ? "ok" : ""}`}>{metaDesc.length}/160</span></label>
              <textarea className="ta" value={metaDesc} onChange={function (e) { setMetaDesc(e.target.value); }}></textarea>
            </div>

            <div className="rm-score">
              <Dial value={result ? result.score : null} size={104} stroke={9} label="SEO" />
              <div className="rm-score-side">
                <span className={`chip ${result ? (result.score >= 80 ? "green" : result.score >= 50 ? "warn" : "bad") : "gray"}`} style={{ fontWeight: 700 }}>{result ? result.grade : "—"}</span>
                <div className="rm-score-note">{result ? `${result.passed} of ${result.total} checks passing` : "Analyzing…"}</div>
              </div>
            </div>

            {s && (
              <div className="rm-stats">
                <StatTile k="Words" v={s.words.toLocaleString()} />
                <StatTile k="Readability" v={s.flesch} sub={s.fleschGrade} />
                <StatTile k="Headings" v={s.headings} />
                <StatTile k="Internal links" v={s.internalLinks} />
                <StatTile k="External links" v={s.externalLinks} />
                <StatTile k="Images" v={s.images} />
              </div>
            )}

            {s && (
              <div className="rm-density">
                <div className="rm-density-top"><span>Keyword density</span><b>{s.density.toFixed(2)}%</b></div>
                <DensityBar density={s.density} />
                <div className="rm-density-scale"><span>0%</span><span className="ideal">ideal 0.75–2.5%</span><span>4%+</span></div>
              </div>
            )}
          </div>

          {/* RIGHT — checklist */}
          <div className="rm-right">
            {loading && mode === "page" && <div className="rm-empty"><Icon n="refresh" s={20} /> Fetching & parsing page…</div>}
            {err && mode === "page" && (
              <div className="rm-empty bad">
                <Icon n="alert" s={20} />
                <div>Couldn't load the page ({err}).<br /><button className="btn btn-ghost btn-sm" style={{ marginTop: 10 }} onClick={function () { setSel(sel); setMode("paste"); }}>Use paste mode instead</button></div>
              </div>
            )}
            {!result && !loading && !err && <div className="rm-empty"><Icon n="doc" s={20} /> Paste content to analyze.</div>}
            {result && (
              <div className="rm-checklist">
                {cats.map(function (c) {
                  var ts = result.tests.filter(function (t) { return t.cat === c; });
                  return ts.length ? <CategoryGroup key={c} cat={c} tests={ts} /> : null;
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {result && <Recommendations result={result} />}

      {/* RANKINGS + SITE AUDIT (Google Search Console data) */}
      <div className="grid-2" style={{ gridTemplateColumns: "1.7fr 1fr", alignItems: "start" }}>
        <div className="card">
          <div className="card-head">
            <Icon n="trend" s={17} style={{ color: "var(--accent)" }} />
            <h3>Keyword rankings</h3>
            <span className="sub">· Search Console</span>
            <div className="spacer"></div>
            <button className="btn btn-ghost btn-sm"><Icon n="refresh" s={13} /> Refresh</button>
          </div>
          <table className="tbl">
            <thead><tr><th>Keyword</th><th>Vol</th><th>Pos</th><th>Change</th><th>Clicks</th></tr></thead>
            <tbody>
              {D.RANKINGS.map(function (r, i) {
                return (
                  <tr key={i}>
                    <td><div className="t-title" style={{ fontSize: 12.5 }}>{r.kw}</div><div className="t-sub">{r.url}</div></td>
                    <td className="num-cell">{r.vol}</td>
                    <td><span className={`chip ${r.pos <= 3 ? "green" : r.pos <= 10 ? "warn" : "gray"}`} style={{ fontWeight: 700 }}>#{r.pos}</span></td>
                    <td className="num-cell">
                      {r.change > 0 ? <span className="delta-up"><Icon n="arrowUp" s={12} style={{ display: "inline" }} /> {r.change}</span>
                        : r.change < 0 ? <span className="delta-down"><Icon n="arrowDown" s={12} style={{ display: "inline" }} /> {Math.abs(r.change)}</span>
                          : <span className="delta-flat">·</span>}
                    </td>
                    <td className="num-cell">{r.traffic}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-head">
            <Icon n="gauge" s={17} style={{ color: "var(--accent)" }} />
            <h3>Site health audit</h3>
            <div className="spacer"></div>
            <Dial value={84} size={40} stroke={5} label="" />
          </div>
          <div className="card-pad seo-groups" style={{ paddingTop: 8 }}>
            {D.SITE_HEALTH.map(function (g, i) {
              return (
                <div className="seo-group" key={i}>
                  <div className="seo-group-h">{g.group}<span className="ct chip gray">{g.items.filter(function (x) { return x.state === "ok"; }).length}/{g.items.length}</span></div>
                  {g.items.map(function (c, j) {
                    return (
                      <div className={`check ${c.state}`} key={j}>
                        <span className="ci"><Icon n={c.state === "ok" ? "check" : c.state === "warn" ? "alert" : "x"} s={11} /></span>
                        <span style={{ flex: 1 }}>{c.label}</span>
                        <span className="t-sub" style={{ whiteSpace: "nowrap" }}>{c.note}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SeoView });

/* =====================================================
   LOGIN GATE — required sign-in + OTP password reset.
   Renders instead of the console when not authenticated.
   ===================================================== */
function EmailSetup({ onClose }) {
  const c = (window.Auth.getEmailCfg && window.Auth.getEmailCfg()) || {};
  const [serviceId, setServiceId] = useState(c.serviceId || "");
  const [templateId, setTemplateId] = useState(c.templateId || "");
  const [publicKey, setPublicKey] = useState(c.publicKey || "");
  const [fromName, setFromName] = useState(c.fromName || "Operator Console");
  const [saved, setSaved] = useState(false);
  function save() {
    window.Auth.setEmailCfg({ serviceId: serviceId.trim(), templateId: templateId.trim(), publicKey: publicKey.trim(), fromName: fromName.trim() });
    setSaved(true); setTimeout(() => setSaved(false), 1800);
  }
  function clearCfg() {
    window.Auth.setEmailCfg(null); setServiceId(""); setTemplateId(""); setPublicKey("");
  }
  return (
    <div className="auth-cfg">
      <div className="auth-cfg-head">
        <Icon n="mailCheck" s={15} style={{ color: "var(--accent)" }} />
        <b>Email delivery (EmailJS)</b>
        <span className="spacer" style={{ flex: 1 }}></span>
        <button className="auth-x" onClick={onClose} aria-label="Close"><Icon n="x" s={14} /></button>
      </div>
      <p className="auth-cfg-note">Free, no backend. Create a service + template at emailjs.com, then paste the three IDs. Until then, reset codes show on screen in demo mode. Your template should include a <code>{"{{passcode}}"}</code> variable and send to <code>{"{{to_email}}"}</code>.</p>
      <div className="auth-cfg-grid">
        <label>Service ID<input className="inp" value={serviceId} onChange={e => setServiceId(e.target.value)} placeholder="service_xxxxxxx" /></label>
        <label>Template ID<input className="inp" value={templateId} onChange={e => setTemplateId(e.target.value)} placeholder="template_xxxxxxx" /></label>
        <label>Public key<input className="inp" value={publicKey} onChange={e => setPublicKey(e.target.value)} placeholder="xXxXxXxXxXxXxX" /></label>
        <label>From name<input className="inp" value={fromName} onChange={e => setFromName(e.target.value)} placeholder="Operator Console" /></label>
      </div>
      <div className="row" style={{ gap: 8, marginTop: 12 }}>
        <button className="btn btn-primary btn-sm" onClick={save}><Icon n="check" s={13} /> {saved ? "Saved" : "Save email settings"}</button>
        <button className="btn btn-ghost btn-sm" onClick={clearCfg}>Clear</button>
        <span className="spacer" style={{ flex: 1 }}></span>
        <span className={`chip ${window.Auth.emailConfigured() ? "green" : "gray"}`}>{window.Auth.emailConfigured() ? "Configured" : "Demo mode"}</span>
      </div>
    </div>
  );
}

function LoginGate({ onAuthed }) {
  const A = window.Auth;
  const [mode, setMode] = useState("login");        // login | f-email | f-otp | f-reset
  const [email, setEmail] = useState((A.getUser() && A.getUser().email) || A.DEFAULT_EMAIL || "");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [otp, setOtp] = useState("");
  const [np1, setNp1] = useState("");
  const [np2, setNp2] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [devCode, setDevCode] = useState("");
  const [cfgOpen, setCfgOpen] = useState(false);

  function reset(keepInfo) { setErr(""); if (!keepInfo) setInfo(""); setDevCode(""); }

  async function doLogin(e) {
    e.preventDefault(); reset(); setBusy(true);
    const r = await A.login(email, pw); setBusy(false);
    if (r.ok) onAuthed(); else setErr(r.error);
  }
  async function sendCode(e) {
    e.preventDefault(); reset(); setBusy(true);
    const r = await A.requestOtp(email); setBusy(false);
    if (!r.ok) { setErr(r.error); return; }
    setMode("f-otp"); setOtp("");
    if (r.delivery === "email") setInfo("We sent a 6-digit code to " + email + ". It expires in 10 minutes.");
    else { setInfo(r.error ? r.error + " Showing the code here so you can continue:" : "Demo mode (no email provider yet). Use the code below."); setDevCode(r.devCode); }
  }
  async function checkCode(e) {
    e.preventDefault(); reset(); setBusy(true);
    const r = await A.verifyOtp(otp); setBusy(false);
    if (r.ok) { setMode("f-reset"); } else setErr(r.error);
  }
  async function doReset(e) {
    e.preventDefault(); reset();
    if (np1.length < 8) { setErr("Use at least 8 characters."); return; }
    if (np1 !== np2) { setErr("Passwords do not match."); return; }
    setBusy(true); const r = await A.resetPassword(np1); setBusy(false);
    if (r.ok) { setMode("login"); setPw(""); setNp1(""); setNp2(""); setInfo("Password updated. Sign in with your new password."); }
    else setErr(r.error);
  }

  return (
    <div className="auth-screen">
      <div className="auth-brand">
        <div className="auth-brand-inner">
          <div className="auth-logo">MP</div>
          <h1>Operator Console</h1>
          <p>Meet Patel · content & SEO operations</p>
          <ul className="auth-points">
            <li><Icon n="gauge" s={15} /> Live Rank Math SEO scoring</li>
            <li><Icon n="layers" s={15} /> Automated blog pipeline</li>
            <li><Icon n="radar" s={15} /> Trend radar & query inbox</li>
          </ul>
          <span className="auth-foot">Protected area · authorised access only</span>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-card">
          {mode === "login" && (
            <form onSubmit={doLogin} className="auth-form">
              <div className="auth-head"><span className="auth-lock"><Icon n="lock" s={16} /></span><div><h2>Sign in</h2><p>Enter your credentials to access the console.</p></div></div>
              {info && <div className="auth-info ok"><Icon n="check" s={14} /> {info}</div>}
              {err && <div className="auth-info bad"><Icon n="alert" s={14} /> {err}</div>}
              <label className="auth-field"><span>Email</span>
                <input className="inp" type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
              </label>
              <label className="auth-field"><span>Password</span>
                <div className="auth-pw">
                  <input className="inp" type={showPw ? "text" : "password"} autoComplete="current-password" value={pw} onChange={e => setPw(e.target.value)} placeholder="••••••••" required />
                  <button type="button" className="auth-eye" onClick={() => setShowPw(s => !s)} aria-label="Toggle password"><Icon n={showPw ? "eyeOff" : "eye"} s={16} /></button>
                </div>
              </label>
              <button className="btn btn-primary auth-submit" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
              <button type="button" className="auth-link" onClick={() => { reset(); setMode("f-email"); }}>Forgot password?</button>
              <div className="auth-demo"><Icon n="shield" s={13} /> Demo access · <b>{A.DEFAULT_EMAIL}</b> / <b>{A.DEFAULT_PW}</b></div>
            </form>
          )}

          {mode === "f-email" && (
            <form onSubmit={sendCode} className="auth-form">
              <div className="auth-head"><span className="auth-lock"><Icon n="mailCheck" s={16} /></span><div><h2>Reset password</h2><p>We'll email a 6-digit verification code.</p></div></div>
              {err && <div className="auth-info bad"><Icon n="alert" s={14} /> {err}</div>}
              <label className="auth-field"><span>Account email</span>
                <input className="inp" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
              </label>
              <button className="btn btn-primary auth-submit" type="submit" disabled={busy}>{busy ? "Sending…" : "Send verification code"}</button>
              <button type="button" className="auth-link" onClick={() => { reset(); setMode("login"); }}>← Back to sign in</button>
              <button type="button" className="auth-link subtle" onClick={() => setCfgOpen(o => !o)}>{window.Auth.emailConfigured() ? "Email delivery: configured" : "Set up email delivery (free)"}</button>
              {cfgOpen && <EmailSetup onClose={() => setCfgOpen(false)} />}
            </form>
          )}

          {mode === "f-otp" && (
            <form onSubmit={checkCode} className="auth-form">
              <div className="auth-head"><span className="auth-lock"><Icon n="shield" s={16} /></span><div><h2>Enter code</h2><p>Check your inbox for the 6-digit code.</p></div></div>
              {info && <div className="auth-info ok"><Icon n="mailCheck" s={14} /> {info}</div>}
              {devCode && <div className="auth-code">{devCode}</div>}
              {err && <div className="auth-info bad"><Icon n="alert" s={14} /> {err}</div>}
              <label className="auth-field"><span>Verification code</span>
                <input className="inp auth-otp" inputMode="numeric" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ""))} placeholder="000000" required />
              </label>
              <button className="btn btn-primary auth-submit" type="submit" disabled={busy || otp.length < 6}>{busy ? "Verifying…" : "Verify code"}</button>
              <div className="row" style={{ gap: 14, justifyContent: "center" }}>
                <button type="button" className="auth-link" onClick={sendCode}>Resend code</button>
                <button type="button" className="auth-link" onClick={() => { reset(); setMode("login"); }}>Cancel</button>
              </div>
            </form>
          )}

          {mode === "f-reset" && (
            <form onSubmit={doReset} className="auth-form">
              <div className="auth-head"><span className="auth-lock"><Icon n="lock" s={16} /></span><div><h2>New password</h2><p>Choose a new password for your account.</p></div></div>
              {err && <div className="auth-info bad"><Icon n="alert" s={14} /> {err}</div>}
              <label className="auth-field"><span>New password</span>
                <input className="inp" type="password" value={np1} onChange={e => setNp1(e.target.value)} placeholder="At least 8 characters" required />
              </label>
              <label className="auth-field"><span>Confirm password</span>
                <input className="inp" type="password" value={np2} onChange={e => setNp2(e.target.value)} placeholder="Re-enter password" required />
              </label>
              <button className="btn btn-primary auth-submit" type="submit" disabled={busy}>{busy ? "Saving…" : "Update password"}</button>
            </form>
          )}
        </div>
        <p className="auth-disclaimer">Prototype gate · access state is stored in this browser. Backend auth still governs the live site.</p>
      </div>
    </div>
  );
}

Object.assign(window, { LoginGate, EmailSetup });

