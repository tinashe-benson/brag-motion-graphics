// Generates composition/index.html and the SFX cue list for the Argo showreel.
// Every timing lives in T so picture and the pre-mixed SFX stem stay in lockstep.
import fs from "node:fs";
import path from "node:path";
import { slackCSS, slackHTML } from "./slack.mjs";

const FORMAT = process.argv[2] === "vertical" ? "vertical" : "landscape";
const V = FORMAT === "vertical";
const W = V ? 1080 : 1920, H = V ? 1920 : 1080;
const OUT = path.resolve(V ? "../composition-vertical" : "../composition");
if (V) { fs.mkdirSync(OUT, { recursive: true }); fs.cpSync(path.resolve("../composition/assets"), path.join(OUT, "assets"), { recursive: true }); }

// ---------------------------------------------------------------- timing
// Music: vol-12, 109.96 BPM, beat ≈ 0.545s. 8-bar phrases land on
// 8.74 / 17.47 / 26.20 / 34.93 / 43.65 / 52.38.
const T = {
  // S1 the noise
  tile0: 0.3, tileGap: 0.27,
  line1: 0.7, line2: 2.62, line3: 4.55,
  implode: 7.75, drop: 8.74, // beat-locked: 8.74 strong cue
  // S2 reveal
  wordIn: 9.29, // beat-locked: 9.29
  tagIn: 10.37, s2out: 12.7,
  // S3 FounderOS
  rain0: 13.2, rainGap: 0.15,
  fosTitle: 15.29, merge: 17.47, // beat-locked: 17.47
  fosSub: 17.6, swap: 18.95, never: 19.05, starts: 19.66, // beat-locked: 19.66
  s3out: 21.45,
  // S4 dashboard
  winIn: 21.84, click1: 22.95, apHead: 23.15, cards0: 23.46, cardGap: 0.272, // beat-grid: every half beat from 23.46
  pullBack: 25.9, click2: 27.3, skills: 27.45, s4out: 30.1,
  // S5 slack
  slackIn: 30.48, type1: 31.05, type1End: 33.7, send1: 33.95,
  reply: 34.93, chip0: 35.47, chip1: 36.55, chip2: 37.65, // beat-grid: every other beat
  card: 38.2, row0: 38.2, row1: 38.75, row2: 39.29, buttons: 39.83,
  cursorIn: 40.55, approve: 43.65, // beat-locked: 43.65 (cue 1.00)
  type2: 44.3, type2End: 45.15, send2: 45.38, reply2: 45.84,
  s5out: 47.45,
  // S6 governance
  govEyebrow: 48.02, gov0: 48.3, gov1: 48.85, gov2: 49.4, gov3: 49.95, game: 50.25,
  // S7 lockup
  verb0: 52.38, verb1: 53.47, verb2: 54.56, verb3: 55.65, // beat-locked: 52.38, then every other beat
  lockup: 56.74, // beat-locked: 56.74 (bar line)
  end: 60,
};

// ---------------------------------------------------------------- copy
const M1 = "prep me for tomorrow's investor call. Pull last week's Fathom notes, check my calendar and draft the follow-up.";
const M3 = "screen today's applicants for the ops role.";

// ---------------------------------------------------------------- logos
// Official artwork only (see assets/logos/SOURCES.md). Fathom's mark sits on
// black, the way the Argo dashboard and Fathom's app icon present it.
const ICON = (id) => id === "fathom"
  ? `<span class="fathom-ic"><img src="assets/logos/fathom.svg" alt="Fathom"></span>`
  : `<img class="lg" src="assets/logos/${id}.svg" alt="">`;
const LOGO = () => `<img class="argo" src="assets/argo-mark.png" alt="Argo Agent">`;
const WORDMARK = `<img class="wordmark" src="assets/argo-wordmark-white.png" alt="Argo Agent by Hire Zim">`;

const NAV_ICON = {
  Projects: `<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>`,
  Chats: `<path d="M4 5h16v11H9l-5 4z"/>`,
  Files: `<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/>`,
  Crons: `<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>`,
  Webhooks: `<circle cx="7" cy="17" r="2.5"/><circle cx="17" cy="17" r="2.5"/><circle cx="12" cy="7" r="2.5"/><path d="M10.6 9.2L8 14.8M13.4 9.2L16 14.8M9.5 17h5"/>`,
  Keychain: `<circle cx="8" cy="15" r="4"/><path d="M11 12l8-8M16 7l2.5 2.5"/>`,
  Apps: `<path d="M5 19c2-6 6-11 14-14-3 8-8 12-14 14z"/><path d="M9 15l-3-3"/>`,
  Memory: `<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c3 3 3 14 0 17M12 3.5c-3 3-3 14 0 17"/>`,
  Skills: `<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>`,
  "Connected apps": `<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0z"/><path d="M12 17v4"/>`,
};
const navIcon = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${NAV_ICON[n]}</svg>`;

const CURSOR = `<svg viewBox="0 0 28 34"><path d="M3 2 L3 27 L9.5 21 L14 31.5 L18.5 29.5 L14 19.5 L23 19.5 Z" fill="#111" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"/></svg>`;
const CHECK = `<svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// ---------------------------------------------------------------- data
const TILE_BASE = [
  { id: "slack", name: "Slack", n: [3, 4, 7, 12] },
  { id: "gmail", name: "Gmail", n: [12, 14, 19, 27] },
  { id: "gcal", name: "Google Calendar", n: [2, 3, 5] },
  { id: "gdrive", name: "Google Drive", n: [1, 4, 6] },
  { id: "gdocs", name: "Google Docs", n: [5, 6, 9] },
  { id: "gsheets", name: "Google Sheets", n: [2, 3, 8] },
  { id: "gtasks", name: "Google Tasks", n: [8, 9, 14] },
  { id: "clickup", name: "ClickUp", n: [6, 9, 13] },
  { id: "fathom", name: "Fathom", n: [1, 2, 4] },
];
// [x, y, scale] per format; the centre band stays clear for the hook type
const TILE_POS = V ? [
  [215, 330, 1.0], [865, 330, 1.0], [365, 600, 0.78], [215, 1420, 0.95], [420, 1690, 0.8],
  [865, 1420, 0.9], [540, 215, 0.74], [715, 600, 0.76], [680, 1690, 0.74],
] : [
  [330, 255, 1.05], [1590, 235, 1.0], [205, 640, 0.86], [1725, 625, 0.9], [470, 925, 0.8],
  [1450, 930, 0.84], [790, 150, 0.7], [1165, 145, 0.74], [960, 965, 0.7],
];
const TILES = TILE_BASE.map((t, i) => ({ ...t, x: TILE_POS[i][0], y: TILE_POS[i][1], s: TILE_POS[i][2] }));
// badge bumps after the pop-in: [tileIndex, time]; accelerates into the drop
const BUMPS = [[1, 3.15], [0, 3.7], [6, 4.15], [3, 4.85], [1, 5.3], [4, 5.65], [7, 6.0], [0, 6.3], [2, 6.6], [5, 6.85], [1, 7.05], [8, 7.22], [6, 7.38], [0, 7.52], [3, 7.64]];

const CARDS = [
  ["gtasks", "Google Tasks", "Google Tasks provides a simple to-do list and task management system integrated into…"],
  ["fathom", "Fathom", "AI meeting assistant that records, transcribes, and summarizes meetings"],
  ["gsheets", "Google Sheets", "Google Sheets is a cloud-based spreadsheet tool enabling real-time collaboration, data…"],
  ["gdocs", "Google Docs", "Google Docs is a cloud-based word processor with real-time collaboration,…"],
  ["gcal", "Google Calendar", "Google Calendar is a time management tool providing scheduling features, event…"],
  ["slack", "Slack", "Slack is a channel-based messaging platform. With Slack, people can work together more…"],
  ["gmail", "Gmail", "Gmail is Google's email service, featuring spam protection, search functions, and…"],
  ["clickup", "ClickUp", "ClickUp unifies tasks, docs, goals, and chat in a single platform, allowing teams to plan,…"],
  ["gdrive", "Google Drive", "Google Drive is a cloud storage solution for uploading, sharing, and collaborating on fil…"],
];
const SKILLS = [
  ["/admin", "Act for an org admin — the admin API (scope directory, per-scope config &amp; SOUL, any scope's memory, transcripts &amp; captured prompts, files,…", "Org · v1 · Created here"],
  ["/argo-connectors", "Connect and use a teammate's own apps — Gmail, Calendar, Slack, Drive and others — through Argo's connector gateway. Use whenever so…", "Org · v11 · Created here · 1 asset"],
  ["/browse", "Drive a real stealth browser from your shell — act on websites (order food, file an expense, pull data behind a login), with per-person persiste…", "Org · v2 · Created here · 3 assets"],
  ["/cloud-cli", "", ""],
];
const WORDS = ["tools", "systems", "processes", "voice", "memory", "knowledge", "clients", "competition", "offers", "content", "SOPs", "goals"];
const GOV = ["Sandboxed execution.", "Policy enforcement.", "Privacy-aware routing.", "Founder oversight."];
const VERBS = ["Research.", "Write.", "Operate.", "Follow up."];
const NAV = ["Projects", "Chats", "Files", "Crons", "Webhooks", "Keychain", "Apps", "Memory", "Skills", "Connected apps"];

// ---------------------------------------------------------------- markup
const tilesHTML = TILES.map((t, i) => `
  <div class="tile" id="tile${i}" style="left:${t.x - 85}px;top:${t.y - 85}px">
    <div class="tile-depth" style="transform:scale(${t.s})">
      <div class="tile-pop"><div class="tile-float">
        <div class="tile-face"><span class="ic">${ICON(t.id)}</span></div>
        <div class="tile-badge"><span class="badge-n">${t.n[0]}</span></div>
        <div class="tile-name">${t.name}</div>
      </div></div>
    </div>
  </div>`).join("");

const chipsHTML = WORDS.map((w, i) => `<div class="chip" id="chip${i}"><div class="chip-in"><span class="cg"></span><span class="ct">${w}</span></div></div>`).join("");

const navHTML = NAV.map((n) => `<div class="nav-item${n === "Connected apps" ? " is-ca" : ""}${n === "Skills" ? " is-sk" : ""}"><span class="nav-hl"></span>${navIcon(n)}<span>${n}</span></div>`).join("");

const cardsHTML = CARDS.map(([id, name, desc], i) => `
  <div class="ca-card" id="card${i}">
    <div class="ca-top"><div class="ca-icon">${ICON(id)}</div><div class="ca-name">${name}</div>
      <div class="ca-badge">${CHECK}<span>Connected</span></div></div>
    <div class="ca-desc">${desc}</div>
    <div class="ca-btn">Disconnect</div>
  </div>`).join("");

const skillsHTML = SKILLS.map(([n, d, m], i) => `
  <div class="sk-row" id="sk${i}">
    <div class="sk-name">${n}</div>
    ${d ? `<div class="sk-desc">${d}</div><div class="sk-meta">${navIcon("Skills")}<span>${m}</span><span class="sk-active">ACTIVE</span></div>` : ""}
  </div>`).join("");

const slackChannels = ["general", "founders-office", "hiring", "sales-pipeline"].map((c) => `<div class="sl-ch${c === "founders-office" ? " on" : ""}"><span class="hash">#</span>${c}</div>`).join("");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=${W}, height=${H}" />
<title>Argo — launch showreel</title>
<script src="assets/vendor/gsap.min.js"></script>
<script src="assets/audio-data.js"></script>
<style>
${[400, 500, 600, 700, 800, 900].map((w) => `@font-face{font-family:"Inter";font-weight:${w};font-style:normal;src:url("assets/fonts/inter-latin-${w}-normal.woff2") format("woff2");}`).join("\n")}
${[400, 700, 900].map((w) => `@font-face{font-family:"Lato";font-weight:${w};font-style:normal;src:url("assets/fonts/lato-latin-${w}-normal.woff2") format("woff2");}`).join("\n")}
@font-face{font-family:"Instrument Serif";font-weight:400;font-style:italic;src:url("assets/fonts/instrument-serif-latin-400-italic.woff2") format("woff2");}
:root{--navy:#0a1f3b;--void:#061428;--surface:#1b2f49;--green:#6ec75a;--green-soft:#b7dfb3;--ink:#0f172a;}
*{box-sizing:border-box}
body{margin:0;background:var(--void);color:#fff;font-family:"Inter",sans-serif;-webkit-font-smoothing:antialiased}
#root{position:relative;width:100%;height:100%;overflow:hidden;background:var(--void)}
.clip{position:absolute;inset:0}
.inner{position:absolute;inset:0}
.serif{font-family:"Instrument Serif",serif;font-style:italic;font-weight:400;letter-spacing:-0.01em}
.g{color:var(--green)}
.lg,.argo{display:block;width:100%;height:100%;object-fit:contain}
.fathom-ic{display:flex;align-items:center;justify-content:center;width:100%;height:100%;background:#000;border-radius:22%}
.fathom-ic img{display:block;width:64%;height:64%;object-fit:contain}
.wordmark{display:block;height:100%;width:auto}

/* ---------- background ---------- */
#bg .base{position:absolute;inset:0;background:radial-gradient(ellipse 80% 70% at 50% 42%,#11305a 0%,#0a1f3b 45%,#061428 100%)}
#bg .dots{position:absolute;inset:-60px;background-image:radial-gradient(rgba(255,255,255,.07) 1.2px,transparent 1.3px);background-size:44px 44px;
  -webkit-mask-image:radial-gradient(ellipse 70% 60% at 50% 50%,#000 30%,transparent 80%);mask-image:radial-gradient(ellipse 70% 60% at 50% 50%,#000 30%,transparent 80%)}
#glowA,#glowB{position:absolute;left:50%;top:50%;width:1500px;height:1100px;margin:-550px 0 0 -750px;border-radius:50%;
  background:radial-gradient(closest-side,rgba(110,199,90,.30),rgba(110,199,90,.10) 45%,transparent 75%)}
#glowA{opacity:.25}
#glowB{opacity:0}
#bg .vig{position:absolute;inset:0;background:radial-gradient(ellipse 75% 70% at 50% 50%,transparent 55%,rgba(2,8,18,.75) 100%)}
#bg .grain{position:absolute;inset:0;opacity:.06;mix-blend-mode:overlay}
#flash{position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,rgba(190,255,170,.9),rgba(110,199,90,.35) 35%,transparent 70%);opacity:0}

/* ---------- S1 noise ---------- */
.tile{position:absolute;width:170px;height:170px}
.tile-depth,.tile-pop,.tile-float{position:absolute;inset:0}
.tile-face{position:absolute;inset:0;border-radius:40px;background:linear-gradient(160deg,#ffffff,#e9eef5);
  box-shadow:0 30px 60px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.9);display:flex;align-items:center;justify-content:center}
.tile-face .ic{display:block;width:100px;height:100px}
.tile-badge{position:absolute;right:-12px;top:-12px;min-width:52px;height:52px;padding:0 14px;border-radius:26px;background:#d4144f;
  border:4px solid #0a1f3b;display:flex;align-items:center;justify-content:center;font:800 24px/1 "Inter";color:#fff}
.tile-name{position:absolute;left:-60px;right:-60px;top:188px;text-align:center;font:600 22px/1 "Inter";color:rgba(255,255,255,.82);letter-spacing:.01em}
#s1-scrim{position:absolute;left:50%;top:50%;width:1300px;height:700px;margin:-350px 0 0 -650px;border-radius:50%;
  background:radial-gradient(closest-side,rgba(6,20,40,.92),rgba(6,20,40,.6) 60%,transparent)}
#s1-text{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.s1-line{display:block;font:800 132px/1.08 "Inter";letter-spacing:-.035em;color:#fff}
.s1-line .serif{font-size:150px}

/* ---------- S2 reveal ---------- */
#s2-center{position:absolute;left:0;right:0;top:0;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
#s2-row{position:relative;height:250px;display:flex;align-items:center;gap:56px}
#s2-logo{position:relative;width:250px;height:250px;flex:none}
#s2-logo .logo-wrap{position:absolute;inset:0;border-radius:44px;box-shadow:0 40px 90px rgba(0,0,0,.5),0 0 120px rgba(110,199,90,.35)}
#s2-word{height:190px}
.ring{position:absolute;left:50%;top:50%;width:250px;height:250px;margin:-125px 0 0 -125px;border-radius:64px;border:3px solid rgba(110,199,90,.9)}
#s2-tag{margin-top:64px;font:500 64px/1.1 "Inter";letter-spacing:-.02em;color:#fff;white-space:nowrap}
#s2-tag .serif{font-size:82px}
#s2-tag .w{display:inline-block}

/* ---------- S3 FounderOS ---------- */
#s3-top{position:absolute;left:0;right:0;top:120px;height:330px;text-align:center}
.s3-block{position:absolute;left:0;right:0;top:0}
.eyebrow{font:700 26px/1 "Inter";letter-spacing:.24em;text-transform:uppercase;color:var(--green)}
#fos-title{margin-top:28px;font:800 136px/1 "Inter";letter-spacing:-.045em;color:#fff}
#fos-title sup{font-size:.32em;font-weight:600;vertical-align:top;position:relative;top:.25em;letter-spacing:0;margin-left:.06em}
#fos-sub{margin-top:30px;font:400 44px/1.2 "Inter";color:rgba(255,255,255,.86)}
#never{font:700 84px/1.08 "Inter";letter-spacing:-.035em;color:#fff;margin-top:24px}
#starts{font-size:132px;line-height:1.05;color:var(--green);margin-top:6px}
#slab-wrap{position:absolute;left:50%;top:560px;width:1320px;height:380px;margin-left:-660px}
#slab{position:absolute;left:-30px;right:-30px;top:-28px;bottom:-28px;border-radius:36px;
  background:linear-gradient(180deg,rgba(110,199,90,.22),rgba(110,199,90,.05));border:2px solid rgba(110,199,90,.55);
  box-shadow:0 0 120px rgba(110,199,90,.25),inset 0 2px 0 rgba(190,255,170,.5);opacity:0}
#slab-label{position:absolute;left:0;right:0;bottom:-96px;text-align:center;font:700 24px/1 "Inter";letter-spacing:.3em;color:var(--green);opacity:0}
#chips{position:absolute;inset:0;display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(3,1fr);gap:20px}
.chip{position:relative}
.cg{position:absolute;inset:0;border-radius:22px;background:linear-gradient(180deg,#25624a,#163f34);opacity:0}
.ct{position:relative}
.chip-in{position:absolute;inset:0;border-radius:22px;background:linear-gradient(180deg,#1d3a63,#15304f);border:1.5px solid rgba(183,223,179,.28);
  display:flex;align-items:center;justify-content:center;font:700 46px/1 "Inter";letter-spacing:-.02em;color:#fff;box-shadow:0 18px 40px rgba(0,0,0,.35)}

/* ---------- shared window ---------- */
.win{position:absolute;left:120px;top:68px;width:1680px;height:945px;border-radius:20px;overflow:hidden;background:#fcfcfc;
  box-shadow:0 60px 140px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.08)}
.chrome{position:absolute;left:0;right:0;top:0;height:40px;background:#e7ebf0;display:flex;align-items:center;padding-left:20px;gap:9px}
.chrome i{width:13px;height:13px;border-radius:50%;background:#ff5f57;display:block}.chrome i:nth-child(2){background:#febc2e}.chrome i:nth-child(3){background:#28c840}
.cursor{position:absolute;left:0;top:0;width:34px;height:42px;z-index:20;filter:drop-shadow(0 6px 10px rgba(0,0,0,.35))}
.cursor svg{width:100%;height:100%}
.cur-ring{position:absolute;left:-26px;top:-26px;width:52px;height:52px;border-radius:50%;border:3px solid rgba(110,199,90,.9);opacity:0}

/* ---------- S4 dashboard ---------- */
#s4-cam{position:absolute;inset:0}
.ag-side{position:absolute;left:0;top:40px;bottom:0;width:300px;background:var(--navy);color:#fff}
.ag-brand{position:absolute;left:22px;top:20px;display:flex;align-items:center;gap:12px;font:700 25px/1 "Inter"}
.ag-brand .mk{width:34px;height:34px}
.ag-new{position:absolute;left:12px;right:12px;top:70px;height:54px;border-radius:12px;background:var(--green);color:#0a1f3b;
  display:flex;align-items:center;gap:14px;padding-left:24px;font:600 20px/1 "Inter"}
.ag-new b{font-weight:400;font-size:30px;margin-top:-3px}
.ag-browse{position:absolute;left:0;right:0;top:142px;height:42px;background:var(--surface);display:flex;align-items:center;padding-left:22px;font:700 15px/1 "Inter";letter-spacing:.08em;color:#e6edf5}
.ag-nav{position:absolute;left:10px;right:10px;top:192px}
.nav-item{position:relative;height:44px;display:flex;align-items:center;gap:14px;padding-left:16px;font:500 19px/1 "Inter";color:#e3e9f1}
.nav-item svg{width:22px;height:22px;flex:none;position:relative}
.nav-item span{position:relative}
.nav-item .nav-hl{position:absolute;inset:0;border-radius:10px;background:var(--surface);opacity:0}
.ag-sess{position:absolute;left:22px;top:650px;font:700 14px/1 "Inter";letter-spacing:.08em;color:#c9d3df}
.ag-user{position:absolute;left:0;right:0;bottom:0;height:62px;border-top:1px solid rgba(255,255,255,.1);display:flex;align-items:center;gap:12px;padding-left:18px;font:500 17px/1 "Inter";color:#e3e9f1}
.ag-user .av{width:32px;height:32px;border-radius:50%;background:#2a3d58;display:flex;align-items:center;justify-content:center;font:700 13px/1 "Inter"}
.ag-main{position:absolute;left:300px;right:0;top:40px;bottom:0;background:#fcfcfc;color:var(--ink)}
.page{position:absolute;inset:0;padding:46px 90px 0 90px}
.pg-title{font:700 36px/1 "Inter";letter-spacing:-.02em;color:#0b1220}
.pg-sub{margin-top:14px;width:640px;font:400 20px/1.45 "Inter";color:#3f4652}
.pg-btn{position:absolute;right:90px;top:42px;height:48px;padding:0 20px;border:1px solid #d6dbe1;border-radius:12px;display:flex;align-items:center;gap:10px;font:600 18px/1 "Inter";color:#111;background:#fff}
.tabrow{margin-top:24px;display:flex;align-items:center;justify-content:space-between}
.tabs{display:inline-flex;padding:5px;border-radius:12px;background:#eef1f4}
.tab{padding:11px 16px;border-radius:9px;font:600 17px/1 "Inter";color:#4b5361}
.tab.on{background:#fff;color:#0b1220;box-shadow:0 1px 3px rgba(0,0,0,.12)}
.search{width:270px;height:46px;border:1px solid #d6dbe1;border-radius:12px;display:flex;align-items:center;padding-left:16px;gap:10px;font:400 17px/1 "Inter";color:#5b6370;background:#fff}
.grid{margin-top:22px;display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.ca-card{position:relative;height:184px;border:1.5px solid var(--green-soft);border-radius:14px;background:#fff;padding:18px 20px}
.ca-top{display:flex;align-items:center;gap:12px}
.ca-icon{width:34px;height:34px;flex:none}
.ca-name{font:600 20px/1 "Inter";color:#0b1220;white-space:nowrap}
.ca-badge{margin-left:auto;display:flex;align-items:center;gap:6px;height:30px;padding:0 12px;border:1.5px solid #8fd081;border-radius:999px;font:600 15px/1 "Inter";color:#2b7a2b;background:#f3fbf1}
.ca-badge svg{width:14px;height:14px}
.ca-desc{margin-top:12px;font:400 16px/1.4 "Inter";color:#4b5361;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.ca-btn{position:absolute;left:20px;bottom:16px;height:42px;padding:0 16px;border:1px solid #d6dbe1;border-radius:9px;display:flex;align-items:center;font:600 16.5px/1 "Inter";color:#111}
#pg-skills .pg-btn.new{right:90px;background:#0b1220;color:#fff;border-color:#0b1220}
#pg-skills .pg-btn.ref{right:262px;width:48px;padding:0;justify-content:center;border-radius:50%}
.sk-search{margin-top:28px;height:56px;border:1px solid #d6dbe1;border-radius:12px;display:flex;align-items:center;padding-left:20px;font:400 19px/1 "Inter";color:#5b6370;background:#fff}
.sk-tabs{margin-top:26px;display:flex;gap:36px;border-bottom:1px solid #e3e6ea;padding-bottom:14px;font:500 19px/1 "Inter";color:#4b5361}
.sk-tabs .on{color:#0b1220;position:relative}
.sk-tabs .on:after{content:"";position:absolute;left:-10px;right:-10px;bottom:-15px;height:2px;background:#0b1220}
.sk-tabs em{font-style:normal;font-size:14px;padding:3px 8px;border-radius:999px;background:#eef1f4;margin-left:6px}
.sk-count{margin-top:22px;font:400 17px/1 "Inter";color:#4b5361}
.sk-row{padding:26px 14px 22px;border-bottom:1px solid #eceef1}
.sk-name{font:700 22px/1 "Inter";color:#0b1220}
.sk-desc{margin-top:16px;font:400 19px/1.3 "Inter";color:#1f2733;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:1000px;padding-left:28px}
.sk-meta{margin-top:10px;display:flex;align-items:center;gap:10px;font:400 16px/1 "Inter";color:#4b5361}
.sk-meta svg{width:20px;height:20px}
.sk-active{margin-left:auto;font:700 13px/1 "Inter";letter-spacing:.06em;color:#1f6f43;background:#e4f5ea;padding:6px 9px;border-radius:5px}
#s4-callout{position:absolute;right:56px;bottom:56px;padding:18px 26px;border-radius:16px;background:rgba(10,31,59,.94);border:1.5px solid rgba(110,199,90,.6);
  font:700 30px/1 "Inter";color:#fff;box-shadow:0 20px 50px rgba(0,0,0,.4);display:flex;align-items:center;gap:0;opacity:0;white-space:nowrap}
#s4-callout b{margin-right:.32em}
#s4-callout b{color:var(--green);font-weight:800}

${slackCSS(V)}
/* ---------- S6 governance ---------- */
#s6-left{position:absolute;left:150px;top:0;bottom:0;width:980px;display:flex;flex-direction:column;justify-content:center}
.gov{font:800 92px/1.14 "Inter";letter-spacing:-.04em;color:#fff;white-space:nowrap;width:max-content;padding-right:.08em}
.gov .dot{color:var(--green)}
#gov-eyebrow{margin-bottom:34px}
#game{margin-top:44px;font:500 30px/1.3 "Inter";color:rgba(255,255,255,.86)}
#game b{color:var(--green);font-weight:800;letter-spacing:.02em}
#s6-right{position:absolute;left:1180px;top:140px;width:600px;height:800px}
#s6-right svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
#s6-core{position:absolute;left:240px;top:340px;width:120px;height:120px;border-radius:22px;box-shadow:0 0 80px rgba(110,199,90,.55)}

/* ---------- S7 lockup ---------- */
#verb-stage{position:absolute;left:0;right:0;top:0;bottom:120px;display:flex;align-items:center;justify-content:center}
.verb{position:absolute;font:900 250px/1 "Inter";letter-spacing:-.055em;color:#fff;white-space:nowrap}
#verb-rail{position:absolute;left:0;right:0;bottom:200px;display:flex;justify-content:center;gap:44px}
.vr{font:700 26px/1 "Inter";letter-spacing:.24em;text-transform:uppercase;color:#7f93ad}
.vr.on{color:var(--green)}
#lock{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
#lock-row{display:flex;align-items:center;gap:50px}
#lock-logo{width:210px;height:210px;border-radius:38px;box-shadow:0 40px 90px rgba(0,0,0,.5),0 0 140px rgba(110,199,90,.4)}
#lock-word{height:158px}
#lock-tag{margin-top:52px;font:500 58px/1.1 "Inter";letter-spacing:-.02em}
#lock-tag .serif{font-size:76px}
#lock-url{margin-top:52px;height:72px;padding:0 34px;border-radius:999px;background:var(--green);color:#0a1f3b;display:flex;align-items:center;font:800 32px/1 "Inter";letter-spacing:-.01em}
${V ? `
/* ================= vertical 1080x1920 overrides ================= */
#s1-scrim{width:1080px;height:600px;margin:-300px 0 0 -540px}
.s1-line{font-size:126px}
.s1-line .serif{font-size:144px}
#s2-row{flex-direction:column;height:auto;gap:70px}
#s2-logo{width:300px;height:300px}
#s2-logo .logo-wrap{border-radius:52px}
.ring{width:300px;height:300px;margin:-150px 0 0 -150px;border-radius:70px}
#s2-word{height:236px}
#s2-tag{white-space:normal;text-align:center;max-width:920px;margin-top:84px;font-size:66px;line-height:1.15}
#s2-tag .serif{font-size:88px}
#s3-top{top:190px;height:640px;padding:0 50px}
#fos-title{font-size:112px;margin-top:30px}
#fos-sub{font-size:46px;margin-top:34px}
#never{font-size:82px}
#starts{font-size:128px;margin-top:14px}
#slab-wrap{top:930px;width:960px;height:660px;margin-left:-480px}
#chips{grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(4,1fr)}
.chip-in{font-size:46px}
#slab-label{bottom:-112px}
.win{left:0;top:0}
#s4-callout{left:0;right:0;bottom:auto;top:1600px;margin:0 auto;width:max-content;font-size:46px;padding:24px 36px;border-radius:22px}
#s6-right{left:240px;top:40px}
#s6-left{left:96px;right:96px;width:auto;top:880px;bottom:auto;display:block}
#gov-eyebrow{margin-bottom:30px;font-size:28px}
.gov{font-size:84px;line-height:1.16}
#game{margin-top:44px;font-size:34px;max-width:880px}
#verb-stage{bottom:260px}
.verb{font-size:184px}
#verb-rail{bottom:560px;gap:30px}
.vr{font-size:24px}
#lock-row{flex-direction:column;gap:72px}
#lock-logo{width:290px;height:290px;border-radius:52px}
#lock-word{height:232px}
#lock-tag{font-size:62px;text-align:center;max-width:920px;line-height:1.15;margin-top:70px}
#lock-tag .serif{font-size:84px}
#lock-url{margin-top:70px;height:84px;font-size:38px;padding:0 42px}
` : ""}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-width="${W}" data-height="${H}" data-duration="60">

  <div id="bg" class="clip" data-start="0" data-duration="60" data-track-index="0">
    <div class="base"></div>
    <div class="dots" id="dots"></div>
    <div id="glowB"></div>
    <div id="glowA"></div>
    <svg class="grain" width="${W}" height="${H}"><filter id="nz"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="4"/></filter><rect width="100%" height="100%" filter="url(#nz)"/></svg>
    <div class="vig"></div>
  </div>

  <!-- S1: the noise -->
  <section id="s1" class="clip" data-start="0" data-duration="8.9" data-track-index="1">
    <div class="inner" id="s1-in">
      ${tilesHTML}
      <div id="s1-scrim"></div>
      <div id="s1-text">
        <span class="s1-line" id="l1">Nine tools.</span>
        <span class="s1-line" id="l2">One founder.</span>
        <span class="s1-line" id="l3">Zero <span class="serif">context.</span></span>
      </div>
    </div>
  </section>

  <!-- S2: Argo -->
  <section id="s2" class="clip" data-start="8.6" data-duration="4.75" data-track-index="2">
    <div class="inner" id="s2-in">
      <div id="s2-center">
        <div id="s2-row">
          <div id="s2-logo"><div class="ring" id="ring1"></div><div class="ring" id="ring2"></div><div class="logo-wrap" id="s2-logo-in">${LOGO()}</div></div>
          <div id="s2-word">${WORDMARK}</div>
        </div>
        <div id="s2-tag"><span class="w">The</span> <span class="w">AI</span> <span class="w">Agent</span> <span class="w">for</span> <span class="w serif g">scaling founders.</span></div>
      </div>
    </div>
  </section>

  <!-- S3: FounderOS -->
  <section id="s3" class="clip" data-start="13.0" data-duration="8.85" data-track-index="1">
    <div class="inner" id="s3-in">
      <div id="s3-top">
        <div class="s3-block" id="fos-a">
          <div class="eyebrow" id="fos-eyebrow">The context engine behind the Argo Agent</div>
          <div id="fos-title">Argo FounderOS<sup>™</sup></div>
          <div id="fos-sub">Your private business intelligence layer.</div>
        </div>
        <div class="s3-block" id="fos-b">
          <div id="never">Your agent never starts from scratch.</div>
          <div id="starts" class="serif">It starts from your business.</div>
        </div>
      </div>
      <div id="slab-wrap">
        <div id="slab"></div>
        <div id="chips">${chipsHTML}</div>
        <div id="slab-label">ARGO FOUNDEROS™</div>
      </div>
    </div>
  </section>

  <!-- S4: dashboard -->
  <section id="s4" class="clip" data-start="21.7" data-duration="8.9" data-track-index="2">
    <div class="inner" id="s4-in">
      <div id="s4-cam">
        <div class="win" id="win4">
          <div class="chrome"><i></i><i></i><i></i></div>
          <div class="ag-side">
            <div class="ag-brand"><div class="mk">${LOGO()}</div>Argo</div>
            <div class="ag-new"><b>+</b>New chat</div>
            <div class="ag-browse">BROWSE</div>
            <div class="ag-nav">${navHTML}</div>
            <div class="ag-sess">SESSIONS</div>
            <div class="ag-user"><div class="av">MO</div>maya@northwind.co</div>
          </div>
          <div class="ag-main">
            <div class="page" id="pg-ca">
              <div id="ca-head">
                <div class="pg-title">Connected apps</div>
                <div class="pg-sub">Connect your own work accounts so Argo can use them for you. Only you can see or use your connections.</div>
                <div class="pg-btn">↻ Refresh</div>
                <div class="tabrow"><div class="tabs"><div class="tab on">Yours (<span id="yours-n">0</span>)</div><div class="tab">Available (36)</div></div>
                <div class="search">⌕ Search apps</div></div>
              </div>
              <div class="grid">${cardsHTML}</div>
            </div>
            <div class="page" id="pg-skills">
              <div class="pg-title">Skills</div>
              <div class="pg-btn ref">↻</div><div class="pg-btn new">+ New skill</div>
              <div class="sk-search">⌕ Search skills…</div>
              <div class="sk-tabs"><span class="on">Active<em>22</em></span><span>Archived<em>0</em></span><span>All<em>22</em></span></div>
              <div class="sk-count">22 skills in 22 groups</div>
              <div id="sk-list">${skillsHTML}</div>
            </div>
          </div>
          <div class="cursor" id="cur4"><div class="cur-ring" id="cur4-ring"></div>${CURSOR}</div>
        </div>
        <div id="s4-callout"><b>9</b>&nbsp;tools. One agent.</div>
      </div>
    </div>
  </section>

  <!-- S5: slack -->
  <section id="s5" class="clip" data-start="30.25" data-duration="17.95" data-track-index="1">
    <div class="inner" id="s5-in">
      <div id="s5-cam">
        ${slackHTML({ V, LOGO, ICON, M1, M3 }).replace("__CURSOR__", CURSOR)}
      </div>
    </div>
  </section>

  <!-- S6: governance -->
  <section id="s6" class="clip" data-start="47.85" data-duration="4.6" data-track-index="2">
    <div class="inner" id="s6-in">
      <div id="s6-left">
        <div class="eyebrow" id="gov-eyebrow">Every action runs inside</div>
        ${GOV.map((g, i) => `<div class="gov" id="gov${i}">${g.slice(0, -1)}<span class="dot">.</span></div>`).join("")}
        <div id="game"><b>The G.A.M.E. Framework</b> · authority · monitoring · enablement</div>
      </div>
      <div id="s6-right">
        <svg viewBox="0 0 600 800">
          ${[0, 1, 2, 3].map((i) => { const s = 200 + i * 112; const o = (600 - s) / 2; const y = (800 - s) / 2; return `<rect id="ring-g${i}" x="${o}" y="${y}" width="${s}" height="${s}" rx="${44 + i * 14}" fill="none" stroke="#6ec75a" stroke-width="${3 - i * 0.4}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" opacity="${1 - i * 0.16}"/>`; }).join("")}
        </svg>
        <div id="s6-core">${LOGO()}</div>
      </div>
    </div>
  </section>

  <!-- S7: verbs + lockup -->
  <section id="s7" class="clip" data-start="52.38" data-duration="7.62" data-track-index="1">
    <div class="inner" id="s7-in">
      <div id="verb-stage">${VERBS.map((v, i) => `<div class="verb" id="verb${i}">${v}</div>`).join("")}</div>
      <div id="verb-rail">${VERBS.map((v, i) => `<div class="vr" id="vr${i}">${v.replace(".", "")}</div>`).join("")}</div>
      <div id="lock">
        <div id="lock-row"><div id="lock-logo">${LOGO()}</div><div id="lock-word">${WORDMARK}</div></div>
        <div id="lock-tag">The AI Agent for <span class="serif g">scaling founders.</span></div>
        <div id="lock-url">hireargo.ai</div>
      </div>
    </div>
  </section>

  <div id="fx" class="clip" data-start="0" data-duration="60" data-track-index="3" style="pointer-events:none"><div id="flash"></div></div>

  <audio id="music" src="assets/music/happy-beats-business-moves-vol-12-by-ende-dot-app.mp3" data-start="0" data-duration="60" data-track-index="10" data-volume="0.42"
    data-automation='{"version":1,"lanes":[{"target":"volume","points":[{"t":0,"v":1},{"t":57.4,"v":1},{"t":60,"v":0}]}]}'></audio>
  <audio id="sfx" src="assets/sfx/sfx-stem.wav" data-start="0" data-duration="60" data-track-index="11" data-volume="1"></audio>
</div>

<script>
const T = ${JSON.stringify(T)};
const M1 = ${JSON.stringify(M1)};
const M3 = ${JSON.stringify(M3)};
const W = ${W}, H = ${H}, V = ${V};
const TILES = ${JSON.stringify(TILES.map((t) => ({ x: t.x, y: t.y, n: t.n })))};
const BUMPS = ${JSON.stringify(BUMPS)};
${fs.readFileSync("timeline.js", "utf8")}
</script>
</body>
</html>`;

fs.writeFileSync(path.join(OUT, "index.html"), html);

// ---------------------------------------------------------------- SFX cue list
// [file, time, gainDb, pan(-1..1)]
const cues = [];
const S = (f, t, db = 0, pan = 0) => cues.push([f, +t.toFixed(3), db, pan]);
TILES.forEach((t, i) => S(`synth/ping${i}.wav`, T.tile0 + i * T.tileGap, -12, (t.x - 960) / 1200));
BUMPS.forEach(([i, t], k) => S(`synth/ping${(i + 3) % 9}.wav`, t, -16 - k * 0.25, (TILES[i].x - 960) / 1200));
S("synth/riser.wav", T.drop - 2.4, -9);
S("synth/boom.wav", T.drop, -7);
S("impactBell_heavy_000.ogg", T.drop, -11);
S("synth/whoosh.wav", T.wordIn - 0.2, -10);
S("synth/whoosh.wav", T.s2out, -9);
WORDS.forEach((w, i) => { if (i % 3 === 0 || i === 11) S(i % 2 ? "drop_002.ogg" : "drop_001.ogg", T.rain0 + i * T.rainGap + 0.42, -12); });
S("impactSoft_medium_001.ogg", T.fosTitle, -6);
S("synth/boom.wav", T.merge, -10);
S("synth/tick1.wav", T.merge, -8);
S("impactSoft_medium_004.ogg", T.starts, -6);
S("synth/whoosh.wav", T.s3out, -7);
S("click_003.ogg", T.click1, -3);
[0, 4, 8].forEach((i) => S(`synth/tick${i % 4}.wav`, T.cards0 + i * T.cardGap + 0.12, -11));
S("click_003.ogg", T.click2, -3);
S("rollover2.ogg", T.skills + 0.1, -10);
S("synth/tick2.wav", T.skills + 0.9, -9);
S("synth/whoosh.wav", T.s4out, -7);
// typing: a key every ~3rd character, seeded
let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const KEYS = ["003", "005", "007", "009", "011", "013", "015", "017", "019", "021", "023", "025"];
const typeKeys = (t0, t1, n) => { const step = (t1 - t0) / n; for (let i = 0; i < n; i += 3) S(`keys/keypress-${KEYS[Math.floor(rnd() * KEYS.length)]}.wav`, t0 + i * step + rnd() * 0.015, -15 - rnd() * 4, 0.1); };
const m1len = ("@Argo " + M1).length, m3len = ("@Argo " + M3).length;
typeKeys(T.type1, T.type1End, m1len);
S("click2.ogg", T.send1, -6);
S("synth/whoosh.wav", T.send1, -14);
S("bong_001.ogg", T.reply, -8);
S("synth/tick1.wav", T.chip0, -8); S("synth/tick2.wav", T.chip1, -8); S("synth/tick3.wav", T.chip2, -8);
S("drop_001.ogg", T.card, -11);
S("rollover2.ogg", T.row1, -12); S("rollover2.ogg", T.row2, -12);
S("drop_002.ogg", T.buttons, -11);
S("click_003.ogg", T.approve, -2);
S("synth/success.wav", T.approve + 0.06, -5);
typeKeys(T.type2, T.type2End, m3len);
S("click2.ogg", T.send2, -6);
S("synth/tick3.wav", T.reply2 + 0.1, -9);
S("synth/whoosh.wav", T.s5out, -7);
[T.gov0, T.gov1, T.gov2, T.gov3].forEach((t, i) => S(`synth/tick${i}.wav`, t, -7));
S("impactSoft_medium_002.ogg", T.game, -10);
[T.verb0, T.verb1, T.verb2, T.verb3].forEach((t, i) => S(`impactSoft_medium_00${[1, 2, 4, 1][i]}.ogg`, t, -6));
S("synth/boom.wav", T.verb0, -9);
S("synth/riser.wav", T.lockup - 2.4, -10);
S("synth/boom.wav", T.lockup, -8);
S("impactBell_heavy_003.ogg", T.lockup, -11);
S("synth/pad.wav", T.lockup - 0.4, -9);
fs.writeFileSync("cues.json", JSON.stringify(cues, null, 0));
console.log("wrote index.html and", cues.length, "cues");
