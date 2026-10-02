// Slack desktop (post-2023 redesign), rebuilt from real captures in slackref/real/:
// 40px top bar with history arrows + centred search, 70px rail (Home / DMs /
// Activity / Later / More, Create + avatar at the foot), sidebar + white pane as
// one inset rounded panel, channel header with bookmark row, Block Kit app
// messages, and the two-row composer. Authored in Slack's own logical pixels and
// scaled up as a whole (like a UI zoom) so text stays legible on video.

const i = (d, extra = "") => `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`;
export const SI = {
  back: i(`<path d="M16 10H4M9 5l-5 5 5 5"/>`),
  fwd: i(`<path d="M4 10h12M11 5l5 5-5 5"/>`),
  clock: i(`<circle cx="10" cy="10" r="7"/><path d="M10 6v4l2.5 1.5"/>`),
  search: i(`<circle cx="9" cy="9" r="5.5"/><path d="M13.2 13.2L17 17"/>`),
  help: i(`<circle cx="10" cy="10" r="7.5"/><path d="M8 8a2 2 0 1 1 2.8 1.8c-.5.3-.8.7-.8 1.2v.5M10 14.2v.1"/>`),
  home: i(`<path d="M3.5 9L10 3.5 16.5 9v7a1 1 0 0 1-1 1h-3.5v-5h-4v5H4.5a1 1 0 0 1-1-1z"/>`),
  dms: i(`<path d="M3 4.5h10v7H7.5L4.5 14v-2.5H3z"/><path d="M13 7.5h4v6.5h-1.5V16l-2.5-2h-4.5v-2.5"/>`),
  bell: i(`<path d="M5 13V9a5 5 0 0 1 10 0v4l1.5 2h-13zM8.5 17h3"/>`),
  later: i(`<path d="M5.5 3.5h9v13L10 13l-4.5 3.5z"/>`),
  more: i(`<circle cx="4.5" cy="10" r="1.1" fill="currentColor"/><circle cx="10" cy="10" r="1.1" fill="currentColor"/><circle cx="15.5" cy="10" r="1.1" fill="currentColor"/>`),
  plus: i(`<path d="M10 4.5v11M4.5 10h11"/>`),
  filter: i(`<path d="M3.5 6h13M6 10h8M8.5 14h3"/>`),
  compose: i(`<path d="M15.5 10.5V16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1h5.5"/><path d="M14.5 3l2.5 2.5L10 12.5H7.5V10z"/>`),
  threads: i(`<path d="M3.5 4h13v9H10l-3.5 3v-3h-3z"/><path d="M7 7.5h6M7 10h4"/>`),
  huddle: i(`<path d="M4 12V10a6 6 0 0 1 12 0v2"/><rect x="3" y="11" width="3.2" height="5" rx="1.2"/><rect x="13.8" y="11" width="3.2" height="5" rx="1.2"/>`),
  sent: i(`<path d="M3.5 10L16.5 4l-4 13-2.5-5.5z"/><path d="M10 11.5l6.5-7.5"/>`),
  caret: i(`<path d="M6 8l4 4 4-4"/>`, `class="caret-ic"`),
  tri: `<svg viewBox="0 0 20 20"><path d="M6 8h8l-4 5z" fill="currentColor"/></svg>`,
  bold: `<svg viewBox="0 0 20 20"><text x="10" y="15" text-anchor="middle" font-family="Lato" font-weight="900" font-size="14" fill="currentColor">B</text></svg>`,
  ital: `<svg viewBox="0 0 20 20"><text x="10" y="15" text-anchor="middle" font-family="Lato" font-style="italic" font-size="14" fill="currentColor">I</text></svg>`,
  strike: i(`<path d="M13.5 6.5c-.6-1.2-1.9-2-3.5-2-2 0-3.5 1.1-3.5 2.6 0 3.2 7 1.9 7 5.4 0 1.6-1.6 2.9-3.6 2.9-1.7 0-3.1-.8-3.7-2.1M4 10h12"/>`),
  link: i(`<path d="M8.5 11.5a3 3 0 0 0 4.2 0l2.6-2.6a3 3 0 0 0-4.2-4.2l-1 1M11.5 8.5a3 3 0 0 0-4.2 0l-2.6 2.6a3 3 0 0 0 4.2 4.2l1-1"/>`),
  ol: i(`<path d="M8.5 5.5h8M8.5 10h8M8.5 14.5h8M3.5 4.5h1.2v3M3.3 9.5h1.9l-1.9 2h1.9"/>`),
  ul: i(`<circle cx="4.5" cy="5.5" r=".9" fill="currentColor"/><circle cx="4.5" cy="10" r=".9" fill="currentColor"/><circle cx="4.5" cy="14.5" r=".9" fill="currentColor"/><path d="M8 5.5h8.5M8 10h8.5M8 14.5h8.5"/>`),
  quote: i(`<path d="M4.5 4.5v11M8.5 6.5h8M8.5 10h8M8.5 13.5h5"/>`),
  code: i(`<path d="M7 6l-4 4 4 4M13 6l4 4-4 4M11 4.5l-2 11"/>`),
  codeblock: i(`<rect x="3" y="3.5" width="14" height="13" rx="2"/><path d="M8 8l-2 2 2 2M12 8l2 2-2 2"/>`),
  plusc: i(`<circle cx="10" cy="10" r="7.5"/><path d="M10 6.5v7M6.5 10h7"/>`),
  aa: `<svg viewBox="0 0 20 20"><text x="10" y="14.5" text-anchor="middle" font-family="Lato" font-size="13" fill="currentColor">Aa</text><path d="M4 17h12" stroke="currentColor" stroke-width="1.2"/></svg>`,
  emoji: i(`<circle cx="10" cy="10" r="7.5"/><path d="M7 11.5c.8 1.2 1.8 1.8 3 1.8s2.2-.6 3-1.8"/><circle cx="7.6" cy="8" r=".6" fill="currentColor"/><circle cx="12.4" cy="8" r=".6" fill="currentColor"/>`),
  at: i(`<circle cx="10" cy="10" r="3"/><path d="M13 10v1.2a2.2 2.2 0 0 0 4.4 0V10a7.4 7.4 0 1 0-3 6"/>`),
  video: i(`<rect x="2.5" y="5.5" width="10.5" height="9" rx="2"/><path d="M13 9l4.5-2.5v7L13 11"/>`),
  mic: i(`<rect x="7.5" y="2.8" width="5" height="9.2" rx="2.5"/><path d="M4.8 9.5a5.2 5.2 0 0 0 10.4 0M10 15v2.5"/>`),
  slash: i(`<rect x="3" y="3" width="14" height="14" rx="3"/><path d="M12 6l-4 8"/>`),
  send: `<svg viewBox="0 0 20 20"><path d="M3 10L17 3.5 13.5 17l-3-6z" fill="currentColor"/></svg>`,
  check: `<svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

export const slackDims = (V) => V
  ? { LW: 860, LH: 1290, SB: 232, S: 1.16 }
  : { LW: 1680 / 1.35, LH: 945 / 1.35, SB: 262, S: 1.35 };

export const slackCSS = (V) => {
  const { LW, LH, SB, S } = slackDims(V);
  return `
/* ---------- S5 slack (real desktop layout) ---------- */
#win5{width:${LW * S}px;height:${LH * S}px;background:#350d36}
.slz{position:absolute;left:0;top:0;width:${LW}px;height:${LH}px;transform:scale(${S});transform-origin:0 0;font-family:"Lato",sans-serif;color:#1d1c1d;
  background:linear-gradient(180deg,#4a154b 0%,#3f0e40 38%,#350d36 100%)}
.slz svg{display:block;width:100%;height:100%}
.st-top{position:absolute;left:0;right:0;top:0;height:40px}
.st-hist{position:absolute;top:10px;left:${70 + SB - 92}px;display:flex;gap:12px;color:rgba(255,255,255,.75)}
.st-hist i{display:block;width:20px;height:20px}
.st-hist i:nth-child(2){color:rgba(255,255,255,.4)}
.st-search{position:absolute;top:6px;left:${70 + SB}px;width:${Math.round((LW - 70 - SB) * (V ? 0.86 : 0.66))}px;height:28px;border-radius:7px;background:rgba(255,255,255,.2);
  display:flex;align-items:center;gap:7px;padding-left:9px;font:400 13px/1 "Lato";color:rgba(255,255,255,.92)}
.st-search i{display:block;width:15px;height:15px}
.st-help{position:absolute;top:10px;right:12px;width:20px;height:20px;color:rgba(255,255,255,.85)}
.st-rail{position:absolute;left:0;top:40px;bottom:0;width:70px}
.st-ws{position:absolute;left:17px;top:8px;width:36px;height:36px;border-radius:8px;background:#e8e2e8;color:#3f0e40;font:900 15px/36px "Lato";text-align:center}
.st-ri{position:absolute;left:0;width:70px;text-align:center;font:700 11px/1 "Lato";color:#fff}
.st-ri .t{width:36px;height:36px;margin:0 auto 5px;border-radius:8px;display:flex;align-items:center;justify-content:center}
.st-ri .t i{display:block;width:20px;height:20px}
.st-ri.on .t{background:rgba(255,255,255,.22)}
.st-ri .dot{position:absolute;left:44px;top:3px;width:8px;height:8px;border-radius:50%;background:#e01e5a;box-shadow:0 0 0 2px #461447}
.st-create{position:absolute;left:19px;bottom:58px;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.22);color:#fff;padding:7px}
.st-me{position:absolute;left:19px;bottom:14px;width:32px;height:32px;border-radius:8px;background:#b85a0c;color:#fff;font:900 12px/32px "Lato";text-align:center}
.st-me:after{content:"";position:absolute;right:-3px;bottom:-3px;width:10px;height:10px;border-radius:50%;background:#2bac76;box-shadow:0 0 0 2.5px #350d36}
.st-panel{position:absolute;left:70px;top:40px;right:4px;bottom:4px;border-radius:8px;overflow:hidden;border:1px solid rgba(255,255,255,.12)}
.st-side{position:absolute;left:0;top:0;bottom:0;width:${SB}px;background:rgba(255,255,255,.055);color:rgba(255,255,255,.72)}
.st-wsn{position:absolute;left:16px;top:14px;font:900 18px/1.2 "Lato";color:#fff;display:flex;align-items:center;gap:2px}
.st-wsn i{display:block;width:16px;height:16px}
.st-hicons{position:absolute;right:12px;top:15px;display:flex;gap:14px;color:#fff}
.st-hicons i{display:block;width:19px;height:19px}
.st-list{position:absolute;left:8px;right:8px;top:56px}
.st-row{height:28px;border-radius:6px;display:flex;align-items:center;gap:9px;padding-left:10px;font:400 15px/1 "Lato";color:rgba(255,255,255,.76);white-space:nowrap}
.st-row i{display:block;width:17px;height:17px;flex:none}
.st-row .hash{width:17px;text-align:center;font-size:16px;flex:none}
.st-row.sec{color:rgba(255,255,255,.76);margin-top:10px;padding-left:4px;gap:6px}
.st-row.sec i{width:16px;height:16px}
.st-row.on{background:#f9edff;color:#39063a;font-weight:700}
.st-row.bold{color:#fff;font-weight:900}
.st-row .av{width:20px;height:20px;border-radius:5px;flex:none;position:relative}
.st-row .av img{border-radius:5px}
.st-pane{position:absolute;left:${SB}px;top:0;right:0;bottom:0;background:#fff;border-left:1px solid rgba(255,255,255,.12)}
.st-head{position:absolute;left:0;right:0;top:0;height:49px;display:flex;align-items:center;padding:0 16px 0 20px}
.st-ch{display:flex;align-items:center;gap:3px;font:900 18px/1 "Lato";color:#1d1c1d}
.st-ch i{display:block;width:16px;height:16px}
.st-hr{margin-left:auto;display:flex;align-items:center;gap:8px}
.st-stack{height:28px;display:flex;align-items:center;gap:6px;padding:0 6px 0 4px;border:1px solid #dddddd;border-radius:6px;font:700 13px/1 "Lato";color:#616061}
.st-stack span{display:block;width:20px;height:20px;border-radius:5px;margin-right:-10px;box-shadow:0 0 0 2px #fff;font:900 9px/20px "Lato";color:#fff;text-align:center}
.st-stack b{margin-left:12px;font-weight:700}
.st-hud{height:28px;width:52px;border:1px solid #dddddd;border-radius:6px;display:flex;align-items:center;justify-content:space-around;color:#454245;padding:0 4px}
.st-hud i{display:block;width:17px;height:17px}.st-hud i+i{width:12px;height:12px}
.st-bm{position:absolute;left:0;right:0;top:49px;height:32px;border-bottom:1px solid #e3e1e3;display:flex;align-items:center;gap:5px;padding-left:20px;font:400 13px/1 "Lato";color:#616061}
.st-bm i{display:block;width:13px;height:13px}
.st-feed{position:absolute;left:0;right:0;top:82px;bottom:144px;overflow:hidden}
.st-col{position:absolute;left:0;right:0;bottom:0}
.st-day{position:relative;height:40px;display:flex;align-items:center;justify-content:center}
.st-day:before{content:"";position:absolute;left:0;right:0;top:50%;border-top:1px solid #e3e1e3}
.st-day span{position:relative;display:flex;align-items:center;gap:3px;padding:5px 10px 5px 14px;border:1px solid #e3e1e3;border-radius:999px;background:#fff;font:700 13px/1 "Lato";color:#1d1c1d}
.st-day span i{display:block;width:12px;height:12px}
.st-msg{position:relative;padding:8px 20px 8px 72px}
.st-msg .av{position:absolute;left:20px;top:10px;width:36px;height:36px;border-radius:8px;overflow:hidden;font:900 14px/36px "Lato";color:#fff;text-align:center}
.st-nm{font:900 15px/1.4 "Lato";color:#1d1c1d}
.st-nm .app{display:inline-block;margin-left:5px;padding:1px 3px;border-radius:3px;background:rgba(29,28,29,.13);font:700 10px/1.25 "Lato";color:#3d3c3d;vertical-align:2px}
.st-nm .ts{margin-left:7px;font:400 12px/1 "Lato";color:#575657}
.st-tx{font:400 15px/1.47 "Lato";color:#1d1c1d}
.st-men{background:rgba(29,155,209,.1);color:#1264a3;border-radius:3px;padding:0 2px}
.st-ctx{display:flex;flex-wrap:wrap;align-items:center;gap:6px 14px;margin-top:6px}
.st-src{display:flex;align-items:center;gap:6px;font:400 13px/1 "Lato";color:#575657}
.st-src .ic{display:block;width:18px;height:18px;flex:none}
.st-src .st{position:relative;width:14px;height:14px;flex:none}
.st-src .spin{position:absolute;inset:0;border-radius:50%;border:2px solid #dddddd;border-top-color:#1264a3}
.st-src .ok{position:absolute;inset:0;border-radius:50%;background:#2bac76;color:#fff;padding:2px}
.st-blk{margin-top:6px;max-width:${V ? 500 : 640}px}
.st-blk h4{margin:0 0 6px;font:900 15px/1.47 "Lato";color:#1d1c1d}
.st-li{display:flex;align-items:flex-start;gap:8px;margin-top:5px;font:400 15px/1.4 "Lato";color:#1d1c1d}
.st-li .ic{display:block;width:18px;height:18px;flex:none;margin-top:1px}
.st-acts{position:relative;margin-top:12px;min-height:36px}
.st-btns{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.st-btn{height:36px;padding:0 12px;border-radius:4px;display:flex;align-items:center;font:700 15px/1 "Lato";border:1px solid rgba(29,28,29,.3);background:#fff;color:#1d1c1d}
.st-btn.pri{background:#007a5a;border-color:#007a5a;color:#fff}
.st-wait{display:flex;align-items:center;gap:6px;margin-left:6px;font:400 13px/1 "Lato";color:#575657}
.st-wait i{width:8px;height:8px;border-radius:50%;background:#e8912d;display:block}
.st-done{position:absolute;left:0;top:0;height:36px;display:flex;align-items:center;gap:7px;font:400 13px/1 "Lato";color:#575657}
.st-done .ok{width:16px;height:16px;border-radius:50%;background:#2bac76;color:#fff;padding:2px}
.st-done b{color:#1d1c1d}
.st-comp{position:absolute;left:20px;right:20px;bottom:20px;height:116px;border:1px solid #bbbabb;border-radius:8px;background:#fff;overflow:hidden}
.st-fmt{position:absolute;left:0;right:0;top:0;height:34px;background:#f8f8f8;display:flex;align-items:center;gap:${V ? 4 : 6}px;padding-left:8px;color:#6e6d6e}
.st-fmt i{display:block;width:22px;height:22px;padding:3px}
.st-fmt u{display:block;width:1px;height:18px;background:#dddddd;margin:0 2px}
.st-in{position:absolute;left:12px;right:44px;top:40px;height:44px;font:400 15px/22px "Lato";color:#1d1c1d;overflow:hidden}
.st-ph{position:absolute;left:12px;top:40px;font:400 15px/22px "Lato";color:#696869}
.st-caret{display:inline-block;width:1.5px;height:18px;background:#1d1c1d;vertical-align:-3px;margin-left:1px}
.st-bot{position:absolute;left:6px;right:8px;bottom:5px;height:28px;display:flex;align-items:center;gap:${V ? 2 : 4}px;color:#616061}
.st-bot i{display:block;width:26px;height:26px;padding:4px}
.st-bot u{display:block;width:1px;height:18px;background:#dddddd;margin:0 3px}
.st-send{position:absolute;right:8px;bottom:5px;height:28px;display:flex;align-items:center;border-radius:5px;color:#b9b9b9}
.st-send i{display:block;width:28px;height:28px;padding:6px}
.st-send u{display:block;width:1px;height:16px;background:rgba(0,0,0,.12)}
.st-send i+u+i{width:20px;padding:5px}
.st-send.live{background:#007a5a;color:#fff}
.st-send.live u{background:rgba(255,255,255,.4)}
#cur5{width:24px;height:30px}
`;
};

export const slackHTML = ({ V, LOGO, ICON, M1, M3 }) => {
  const { SB } = slackDims(V);
  const rail = [["home", "Home", true], ["dms", "DMs"], ["bell", "Activity"], ["later", "Later"], ["more", "More"]]
    .map(([ic, l, on], k) => `<div class="st-ri${on ? " on" : ""}" style="top:${62 + k * 68}px"><div class="t"><i>${SI[ic]}</i></div>${l}${k === 2 ? '<span class="dot"></span>' : ""}</div>`).join("");
  const ch = (name, cls = "") => `<div class="st-row ${cls}"><span class="hash">#</span>${name}</div>`;
  return `
        <div class="win sl" id="win5"><div class="slz" id="slz">
          <div class="st-top">
            <div class="st-hist"><i>${SI.back}</i><i>${SI.fwd}</i><i>${SI.clock}</i></div>
            <div class="st-search"><i>${SI.search}</i>Search Northwind</div>
            <div class="st-help">${SI.help}</div>
          </div>
          <div class="st-rail"><div class="st-ws">N</div>${rail}<div class="st-create">${SI.plus}</div><div class="st-me">MO</div></div>
          <div class="st-panel">
            <div class="st-side">
              <div class="st-wsn">Northwind<i>${SI.caret}</i></div>
              <div class="st-hicons"><i>${SI.filter}</i><i>${SI.compose}</i></div>
              <div class="st-list">
                <div class="st-row"><i>${SI.threads}</i>Threads</div>
                <div class="st-row"><i>${SI.huddle}</i>Huddles</div>
                <div class="st-row"><i>${SI.sent}</i>Drafts &amp; sent</div>
                <div class="st-row sec"><i>${SI.tri}</i>Channels</div>
                ${ch("general")}${ch("founders-office", "on")}${ch("hiring", "bold")}${ch("sales-pipeline")}
                <div class="st-row sec"><i>${SI.tri}</i>Direct messages</div>
                <div class="st-row"><span class="av" style="background:#46658c"></span>Jordan Lee</div>
                <div class="st-row"><span class="av" style="background:#3d6550"></span>Priya Shah</div>
                <div class="st-row sec"><i>${SI.tri}</i>Apps</div>
                <div class="st-row"><span class="av">${LOGO()}</span>Argo</div>
              </div>
            </div>
            <div class="st-pane" id="pane">
              <div class="st-head"><div class="st-ch"># founders-office<i>${SI.caret}</i></div>
                <div class="st-hr"><div class="st-stack" data-layout-allow-overlap data-layout-allow-occlusion><span data-layout-allow-occlusion data-layout-allow-overlap style="background:#b85a0c">MO</span><span data-layout-allow-occlusion data-layout-allow-overlap style="background:#46658c">JL</span><span data-layout-allow-occlusion data-layout-allow-overlap style="background:#3d6550">PS</span><b>4</b></div>
                <div class="st-hud"><i>${SI.huddle}</i><i>${SI.caret}</i></div></div></div>
              <div class="st-bm"><i>${SI.plus}</i>Add a bookmark</div>
              <div class="st-feed"><div class="st-col" id="col">
                <div class="feed-item" id="fi-hist">
                  <div class="st-msg"><div class="av" style="background:#3d6550">PS</div><div class="st-nm">Priya Shah<span class="ts">2:14 PM</span></div><div class="st-tx">Reminder: board update is due Friday.</div></div>
                  <div class="st-msg"><div class="av" style="background:#3d6550">PS</div><div class="st-nm">Priya Shah<span class="ts">4:31 PM</span></div><div class="st-tx">Ops role is live. Applications are coming in.</div></div>
                  <div class="st-msg"><div class="av" style="background:#46658c">JL</div><div class="st-nm">Jordan Lee<span class="ts">5:03 PM</span></div><div class="st-tx">Northstar confirmed for tomorrow at 10.</div></div>
                  <div class="st-day"><span>Today<i>${SI.caret}</i></span></div>
                  <div class="st-msg"><div class="av" style="background:#46658c">JL</div><div class="st-nm">Jordan Lee<span class="ts">9:58 AM</span></div><div class="st-tx">Pushed the updated pitch deck to Drive.</div></div>
                </div>
                <div class="feed-item" id="fi-m1">
                  <div class="st-msg"><div class="av" style="background:#b85a0c">MO</div><div class="st-nm">Maya Okafor<span class="ts">10:41 AM</span></div>
                    <div class="st-tx"><span class="st-men">@Argo</span> ${M1}</div></div>
                </div>
                <div class="feed-item" id="fi-m2a">
                  <div class="st-msg"><div class="av">${LOGO()}</div><div class="st-nm">Argo<span class="app">APP</span><span class="ts">10:41 AM</span></div>
                    <div class="st-tx">On it. Pulling from your connected apps.</div>
                    <div class="st-ctx">
                      ${[["fathom", "Fathom"], ["gcal", "Google Calendar"], ["gmail", "Gmail"]].map(([id, n], k) => `<div class="st-src" id="tc${k}"><span class="ic">${ICON(id)}</span>${n}<span class="st"><span class="spin" id="tc${k}s"></span><span class="ok" id="tc${k}k">${SI.check}</span></span></div>`).join("")}
                    </div></div>
                </div>
                <div class="feed-item" id="fi-m2b">
                  <div class="st-msg" style="padding-top:2px"><div class="st-blk" id="brief">
                    <h4>Investor call prep · Tomorrow, 10:00 AM</h4>
                    <div class="st-li" id="br0"><span class="ic">${ICON("gcal")}</span><span><b>Calendar:</b> 30-min sync with Northstar Ventures</span></div>
                    <div class="st-li" id="br1"><span class="ic">${ICON("fathom")}</span><span><b>Fathom:</b> 3 open questions from last week's call</span></div>
                    <div class="st-li" id="br2"><span class="ic">${ICON("gmail")}</span><span><b>Gmail:</b> follow-up drafted, waiting for your approval</span></div>
                    <div class="st-acts" id="acts">
                      <div class="st-btns" id="btns"><div class="st-btn pri" id="approve">Approve &amp; send</div><div class="st-btn">Edit draft</div><div class="st-wait"><i id="wdot"></i>Waiting for Maya</div></div>
                      <div class="st-done" id="approved"><span class="ok">${SI.check}</span><span><b>Approved by Maya</b> · sent from Gmail</span></div>
                    </div>
                  </div></div>
                </div>
                <div class="feed-item" id="fi-m3">
                  <div class="st-msg"><div class="av" style="background:#b85a0c">MO</div><div class="st-nm">Maya Okafor<span class="ts">10:43 AM</span></div>
                    <div class="st-tx"><span class="st-men">@Argo</span> ${M3}</div></div>
                </div>
                <div class="feed-item" id="fi-m4">
                  <div class="st-msg"><div class="av">${LOGO()}</div><div class="st-nm">Argo<span class="app">APP</span><span class="ts">10:43 AM</span></div>
                    <div class="st-tx">Done. Here's where the ops role stands:</div>
                    <div class="st-ctx">
                      <div class="st-src" id="dc0"><span class="st"><span class="ok" style="opacity:1">${SI.check}</span></span>3 applicants screened</div>
                      <div class="st-src" id="dc1"><span class="st"><span class="ok" style="opacity:1">${SI.check}</span></span>Resumes summarized</div>
                      <div class="st-src" id="dc2"><span class="st"><span class="ok" style="opacity:1">${SI.check}</span></span>Next steps scheduled</div>
                    </div></div>
                </div>
              </div></div>
              <div class="st-comp" id="comp">
                <div class="st-fmt"><i>${SI.bold}</i><i>${SI.ital}</i><i>${SI.strike}</i><u></u><i>${SI.link}</i><u></u><i>${SI.ol}</i><i>${SI.ul}</i><u></u><i>${SI.quote}</i><u></u><i>${SI.code}</i><i>${SI.codeblock}</i></div>
                <div class="st-ph" id="ph" data-layout-allow-overlap>Message #founders-office</div>
                <div class="st-in" id="typed" data-layout-allow-overlap><span id="typed-t"></span><span class="st-caret" id="caret"></span></div>
                <div class="st-bot"><i>${SI.plusc}</i><i>${SI.aa}</i><i>${SI.emoji}</i><i>${SI.at}</i><u></u><i>${SI.video}</i><i>${SI.mic}</i><u></u><i>${SI.slash}</i></div>
                <div class="st-send" id="send"><i>${SI.send}</i><u></u><i>${SI.caret}</i></div>
              </div>
            </div>
          </div>
          <div class="cursor" id="cur5"><div class="cur-ring" id="cur5-ring"></div>${"__CURSOR__"}</div>
        </div></div>`;
};
