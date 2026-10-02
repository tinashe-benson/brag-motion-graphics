// Argo showreel timeline. All positions are global composition seconds (see T).
// A single paused timeline; procedural motion (float, drift, caret, audio-reactive
// glow) is derived from tl.time() in one ticker so every frame is seekable.
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

// Layout position of an element relative to the composition root (ignores transforms;
// inactive clips are visibility:hidden, so layout is measurable at build time).
const posIn = (el, stop) => { let x = 0, y = 0; while (el && el !== stop) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; } return { x, y }; };
const ROOT = () => document.getElementById("root");

document.fonts.ready.then(() => {
  const tl = gsap.timeline({ paused: true });
  const AD = window.AUDIO_DATA;

  // ------------------------------------------------------------------ ticker
  const floats = $$(".tile-float");
  const dots = $("#dots");
  const glowA = $("#glowA");
  const caret = $("#caret");
  const wdot = $("#wdot");
  const spins = $$(".spin");
  const typingWindows = [[30.95, T.send1], [T.type2 - 0.25, T.send2]];
  tl.to({ v: 0 }, {
    v: 1, duration: T.end, ease: "none",
    onUpdate() {
      const t = tl.time();
      floats.forEach((el, i) => gsap.set(el, { y: Math.sin(t * 0.9 + i * 1.3) * 12, rotation: Math.sin(t * 0.55 + i * 1.7) * 3.2 }));
      gsap.set(dots, { x: (t * 7) % 44, y: (t * 4) % 44 });
      // audio-reactive: bass breathes the green glow (subtle, never strobing)
      const fr = AD.f[Math.min(AD.totalFrames - 1, Math.max(0, Math.floor(t * AD.fps)))];
      const bass = fr[0] * 0.65 + fr[1] * 0.35;
      gsap.set(glowA, { opacity: 0.14 + 0.3 * bass, scale: 0.94 + 0.09 * bass });
      const typing = typingWindows.some(([a, b]) => t >= a && t < b);
      gsap.set(caret, { opacity: typing && Math.floor(t * 2.4) % 2 === 0 ? 1 : 0 });
      gsap.set(wdot, { opacity: 0.45 + 0.55 * Math.abs(Math.sin(t * 3.2)) });
      spins.forEach((el) => gsap.set(el, { rotation: t * 420 }));
    },
  }, 0);

  // ------------------------------------------------------------------ S1 the noise
  TILES.forEach((tile, i) => {
    const at = T.tile0 + i * T.tileGap;
    tl.fromTo(`#tile${i} .tile-pop`, { scale: 0.2, opacity: 0, rotation: (i % 2 ? 1 : -1) * 18 },
      { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: "back.out(1.9)" }, at);
    tl.fromTo(`#tile${i} .tile-badge`, { scale: 0 }, { scale: 1, duration: 0.35, ease: "back.out(3)" }, at + 0.22);
  });
  const nextN = TILES.map(() => 1);
  BUMPS.forEach(([i, at]) => {
    const n = TILES[i].n;
    const val = n[Math.min(nextN[i]++, n.length - 1)];
    tl.set(`#tile${i} .badge-n`, { textContent: String(val) }, at);
    tl.fromTo(`#tile${i} .tile-badge`, { scale: 1.45 }, { scale: 1, duration: 0.3, ease: "back.out(2.6)", immediateRender: false }, at);
  });
  tl.fromTo("#s1-scrim", { opacity: 0 }, { opacity: 1, duration: 1.2, ease: "sine.out" }, 0.4);
  tl.fromTo("#l1", { y: 70, opacity: 0, filter: "blur(14px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.9, ease: "expo.out" }, T.line1);
  tl.fromTo("#l2", { opacity: 0, x: -110 }, { opacity: 1, x: 0, duration: 0.9, ease: "power4.out" }, T.line2);
  tl.fromTo("#l3", { scale: 1.35, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.5)" }, T.line3);
  // pressure builds under the riser, then everything implodes into the drop
  tl.fromTo("#glowB", { opacity: 0, scale: 0.5 }, { opacity: 0.95, scale: 1.25, duration: 2.3, ease: "power2.in" }, T.drop - 2.3);
  tl.to("#s1-text", { scale: 0.86, opacity: 0, filter: "blur(16px)", duration: 0.5, ease: "power2.in" }, T.implode - 0.15);
  tl.to("#s1-scrim", { opacity: 0, duration: 0.4, ease: "power1.in" }, T.implode);
  TILES.forEach((tile, i) => {
    const at = T.implode + (i % 3) * 0.05;
    tl.to(`#tile${i}`, { x: W / 2 - tile.x, y: H / 2 - tile.y, duration: 0.95 - (i % 3) * 0.05, ease: "power3.in" }, at);
    tl.to(`#tile${i} .tile-pop`, { scale: 0.12, opacity: 0, duration: 0.3, ease: "power2.in" }, T.drop - 0.32);
  });

  // ------------------------------------------------------------------ S2 Argo
  tl.fromTo("#flash", { opacity: 0 }, { opacity: 0.9, duration: 0.06, ease: "none" }, T.drop - 0.03); // beat-locked: 8.74s
  tl.to("#flash", { opacity: 0, duration: 0.7, ease: "power2.out" }, T.drop + 0.04);
  tl.to("#glowB", { opacity: 0.35, scale: 1, duration: 1.6, ease: "power2.out" }, T.drop + 0.05);
  tl.fromTo("#s2-logo-in", { scale: 0, rotation: -28 }, { scale: 1, rotation: 0, duration: 0.75, ease: "back.out(1.7)" }, T.drop); // beat-locked: 8.74s
  tl.fromTo("#ring1", { scale: 0.9, opacity: 0.95 }, { scale: 3.4, opacity: 0, duration: 1.2, ease: "power2.out" }, T.drop);
  tl.fromTo("#ring2", { scale: 0.9, opacity: 0.7 }, { scale: 5.2, opacity: 0, duration: 1.6, ease: "power2.out" }, T.drop + 0.12);
  // the mark lands dead centre on the drop, then slides into the lockup
  const lp = posIn($("#s2-logo"), ROOT()), lsz = $("#s2-logo").offsetWidth;
  const dx = W / 2 - (lp.x + lsz / 2), dy = H / 2 - (lp.y + lsz / 2);
  if (V) {
    tl.fromTo("#s2-logo", { x: dx, y: dy }, { x: 0, y: 0, duration: 0.8, ease: "power3.inOut" }, T.wordIn - 0.12);
    tl.fromTo("#s2-word", { y: dy * 0.6, opacity: 0, clipPath: "inset(0% 0% 100% 0%)" },
      { y: 0, opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power3.out" }, T.wordIn); // beat-locked: 9.29s
  } else {
    // mark and wordmark travel together so the reveal never collides with the mark
    tl.fromTo(["#s2-logo", "#s2-word"], { x: dx, y: dy }, { x: 0, y: 0, duration: 0.8, ease: "power3.inOut" }, T.wordIn - 0.12);
    tl.fromTo("#s2-word", { clipPath: "inset(0% 100% 0% 0%)", opacity: 0 },
      { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 0.8, ease: "power3.out" }, T.wordIn); // beat-locked: 9.29s
  }
  tl.fromTo("#s2-tag .w", { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.075 }, T.tagIn);
  tl.to("#s2-in", { scale: 0.93, opacity: 0, filter: "blur(10px)", duration: 0.45, ease: "power2.in" }, T.s2out);
  tl.to("#glowB", { opacity: 0, duration: 1.2, ease: "sine.inOut" }, T.s2out);

  // ------------------------------------------------------------------ S3 FounderOS
  $$(".chip").forEach((el, i) => {
    const at = T.rain0 + i * T.rainGap;
    tl.fromTo(el, { y: -820 - (i % 4) * 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.42, ease: "power3.in" }, at);
    tl.fromTo(el.firstElementChild, { scaleY: 0.8, scaleX: 1.08 }, { scaleY: 1, scaleX: 1, duration: 0.5, ease: "elastic.out(1, 0.45)", immediateRender: false }, at + 0.42);
  });
  tl.fromTo("#fos-eyebrow", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, T.fosTitle - 0.2);
  tl.fromTo("#fos-title", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "expo.out" }, T.fosTitle);
  tl.fromTo("#fos-sub", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, T.fosSub);
  // beat-locked: 17.47s — the twelve pieces fuse into one foundation
  tl.fromTo("#chips", { columnGap: 20, rowGap: 20 }, { columnGap: 6, rowGap: 6, duration: 0.55, ease: "power4.inOut" }, T.merge - 0.1);
  tl.to(".chip-in", { borderColor: "rgba(110,199,90,0.75)", duration: 0.5, ease: "power2.out", stagger: { each: 0.02, from: "center" } }, T.merge);
  tl.to(".cg", { opacity: 1, duration: 0.5, ease: "power2.out", stagger: { each: 0.02, from: "center" } }, T.merge);
  tl.fromTo("#slab", { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.7, ease: "expo.out" }, T.merge);
  tl.fromTo("#slab-label", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, T.swap + 0.3);
  tl.to("#fos-a", { y: -40, opacity: 0, duration: 0.38, ease: "power2.in" }, T.swap);
  tl.fromTo("#never", { y: 46, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "expo.out" }, T.never);
  tl.fromTo("#starts", { scale: 1.12, opacity: 0, filter: "blur(12px)" }, { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.8, ease: "power3.out" }, T.starts); // beat-locked: 19.66s
  tl.fromTo("#slab-wrap", { scale: 1 }, { scale: 0.96, duration: 2.4, ease: "sine.inOut" }, T.swap);
  tl.to("#s3-in", { scale: 1.16, opacity: 0, filter: "blur(10px)", duration: 0.45, ease: "power2.in" }, T.s3out);

  // ------------------------------------------------------------------ S4 dashboard
  const cur4 = "#cur4";
  gsap.set(["#ca-head", ".ca-card", "#pg-skills", ".sk-row", "#s4-callout"], { opacity: 0 });
  tl.fromTo("#s4-cam", { y: 140, scale: 0.86, rotationX: 18, opacity: 0, transformPerspective: 2400 },
    { y: 0, scale: 1, rotationX: 0, opacity: 1, duration: 0.95, ease: "expo.out" }, T.winIn - 0.1);
  tl.fromTo(cur4, { x: 1160, y: 780, opacity: 0 }, { x: 1160, y: 780, opacity: 1, duration: 0.2 }, T.winIn + 0.25);
  tl.to(cur4, { x: 150, y: 646, duration: 0.6, ease: "power2.inOut" }, T.click1 - 0.62);
  tl.fromTo(cur4, { scale: 1 }, { scale: 0.82, duration: 0.08, yoyo: true, repeat: 1, ease: "power1.inOut", immediateRender: false }, T.click1);
  tl.fromTo("#cur4-ring", { scale: 0.3, opacity: 1 }, { scale: 1.6, opacity: 0, duration: 0.45, ease: "power2.out" }, T.click1);
  tl.to(".nav-item.is-ca .nav-hl", { opacity: 1, duration: 0.15 }, T.click1 + 0.02);
  tl.fromTo("#ca-head", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, T.apHead);
  tl.to(cur4, { x: 1380, y: 300, duration: 0.6, ease: "power2.inOut" }, T.click1 + 0.2);
  // camera: punch in on the header, ride the cascade, pull back to the full grid
  // camera: frame window point (cx, cy) at screen centre with scale s (vertical uses this throughout)
  const shot = (s, cx, cy) => ({ scale: s, x: W / 2 - 120 * (V ? 0 : 1) - s * cx, y: H / 2 - 68 * (V ? 0 : 1) - s * cy });
  const CAM4 = { wide: shot(0.6, 840, 472), header: shot(1.22, 720, 470), right: shot(1.22, 1236, 470), skills: shot(1.08, 800, 430) };
  if (V) {
    gsap.set("#win4", { transformOrigin: "0px 0px", ...CAM4.wide });
    tl.fromTo("#win4", CAM4.wide, { ...CAM4.header, duration: 1.0, ease: "power2.inOut" }, T.apHead - 0.05);
    tl.fromTo("#win4", CAM4.header, { ...CAM4.right, duration: 1.3, ease: "sine.inOut", immediateRender: false }, T.cards0 + 1.15);
  } else {
  gsap.set("#win4", { transformOrigin: "420px 140px" });
  tl.fromTo("#win4", { scale: 1 }, { scale: 1.24, duration: 1.1, ease: "power2.inOut" }, T.apHead - 0.1);
  }
  // beat-grid: card i at 23.46 + i·0.272 (half-beats — accents, not reading text)
  $$(".ca-card").forEach((el, i) => {
    const at = T.cards0 + i * T.cardGap;
    tl.fromTo(el, { y: 34, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }, at);
    tl.fromTo(el.querySelector(".ca-badge"), { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2.6)" }, at + 0.16);
    tl.set("#yours-n", { textContent: String(i + 1) }, at + 0.16);
  });
  if (V) tl.fromTo("#win4", CAM4.right, { ...CAM4.wide, duration: 0.9, ease: "power3.inOut", immediateRender: false }, T.pullBack);
  else tl.fromTo("#win4", { scale: 1.24 }, { scale: 1, duration: 0.9, ease: "power3.inOut", immediateRender: false }, T.pullBack);
  tl.fromTo("#s4-callout", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45, ease: "back.out(1.8)" }, T.pullBack + 0.5);
  tl.set("#s4-callout", { innerHTML: "<b>22</b>&nbsp;active skills" }, T.skills + 0.05);
  tl.fromTo("#s4-callout", { scale: 0.9 }, { scale: 1, duration: 0.35, ease: "back.out(2.5)", immediateRender: false }, T.skills + 0.05);
  tl.to(cur4, { x: 122, y: 602, duration: 0.6, ease: "power2.inOut" }, T.click2 - 0.62);
  tl.fromTo(cur4, { scale: 1 }, { scale: 0.82, duration: 0.08, yoyo: true, repeat: 1, ease: "power1.inOut", immediateRender: false }, T.click2);
  tl.fromTo("#cur4-ring", { scale: 0.3, opacity: 1 }, { scale: 1.6, opacity: 0, duration: 0.45, ease: "power2.out", immediateRender: false }, T.click2);
  tl.to(".nav-item.is-ca .nav-hl", { opacity: 0, duration: 0.12 }, T.click2 + 0.02);
  tl.to(".nav-item.is-sk .nav-hl", { opacity: 1, duration: 0.15 }, T.click2 + 0.02);
  tl.to("#pg-ca", { opacity: 0, duration: 0.18 }, T.click2 + 0.05);
  tl.to("#pg-skills", { opacity: 1, duration: 0.25 }, T.skills);
  tl.fromTo(".sk-row", { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.12 }, T.skills + 0.1);
  tl.to(cur4, { x: 760, y: 520, opacity: 0, duration: 0.7, ease: "power2.inOut" }, T.click2 + 0.35);
  if (V) {
    tl.fromTo("#win4", CAM4.wide, { ...CAM4.skills, duration: 1.0, ease: "power2.inOut", immediateRender: false }, T.skills + 0.15);
  } else {
    tl.set("#win4", { transformOrigin: "50% 50%" }, T.skills);
    tl.fromTo("#win4", { scale: 1 }, { scale: 1.045, duration: T.s4out - T.skills, ease: "none", immediateRender: false }, T.skills);
  }
  tl.to("#s4-in", { x: -420, opacity: 0, rotationY: 10, transformPerspective: 2400, duration: 0.38, ease: "power2.in" }, T.s4out);

  // ------------------------------------------------------------------ S5 Slack
  // Feed heights and the cursor target are measured from the laid-out Slack window
  // (logical Slack pixels inside #slz), so both formats stay exact.
  const SLZ = $("#slz");
  const order = ["m1", "m2a", "m2b", "m3", "m4"];
  const Hm = Object.fromEntries(order.map((id) => [id, $(`#fi-${id}`).offsetHeight]));
  const colY = (k) => order.slice(k).reduce((a, id) => a + Hm[id], 0); // k = items revealed
  gsap.set("#col", { y: colY(0) });
  gsap.set(["#fi-m1", "#fi-m2a", "#fi-m2b", "#fi-m3", "#fi-m4", "#tc0k", "#tc1k", "#tc2k", "#approved"], { opacity: 0 });
  const step = (k, at) => tl.fromTo("#col", { y: colY(k - 1) }, { y: colY(k), duration: 0.45, ease: "power3.out", immediateRender: false }, at);
  const show = (id, at) => tl.fromTo(id, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, at);

  tl.fromTo("#s5-cam", { x: V ? 0 : 420, y: V ? 160 : 0, rotationY: V ? 0 : -16, opacity: 0, scale: 0.94, transformPerspective: 2400 },
    { x: 0, y: 0, rotationY: 0, opacity: 1, scale: 1, duration: 0.9, ease: "expo.out" }, T.slackIn);
  tl.to("#comp", { borderColor: "#868686", duration: 0.2 }, 30.9);
  tl.set("#ph", { opacity: 0 }, T.type1 - 0.02);
  tl.to("#send", { backgroundColor: "#007a5a", color: "#ffffff", duration: 0.15 }, T.type1);
  const typeOut = (text, t0, t1) => {
    const n = text.length, dt = (t1 - t0) / n;
    for (let i = 1; i <= n; i++) tl.set("#typed-t", { textContent: text.slice(0, i) }, t0 + i * dt);
  };
  typeOut("@Argo " + M1, T.type1, T.type1End);
  tl.set("#typed-t", { textContent: "" }, T.send1);
  tl.set("#ph", { opacity: 1 }, T.send1 + 0.02);
  tl.to("#send", { backgroundColor: "rgba(0,0,0,0)", color: "#b9b9b9", duration: 0.15 }, T.send1);
  step(1, T.send1); show("#fi-m1", T.send1 + 0.05);
  // Argo picks it up on the phrase line; each source resolves on the beat grid
  step(2, T.reply); show("#fi-m2a", T.reply + 0.04);
  [[T.reply + 0.15, T.chip0], [T.chip0 + 0.12, T.chip1], [T.chip1 + 0.12, T.chip2]].forEach(([a, done], i) => {
    tl.fromTo(`#tc${i}`, { x: -10, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" }, a);
    tl.to(`#tc${i}s`, { opacity: 0, duration: 0.12 }, done); // beat-grid: 35.47 / 36.55 / 37.65
    tl.fromTo(`#tc${i}k`, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(3)" }, done);
  });
  step(3, T.card); show("#fi-m2b", T.card);
  tl.fromTo(["#br0", "#br1", "#br2"], { x: -14, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "power3.out", stagger: { each: 0.545 } }, T.row0 + 0.05);
  tl.fromTo("#btns", { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }, T.buttons);

  // camera: lean in on the conversation while Argo works
  const winW = $("#win5").offsetWidth, winH = $("#win5").offsetHeight, SS = winW / SLZ.offsetWidth;
  const paneL = posIn($("#pane"), SLZ).x * SS;
  const shot5 = (s, cx, cy) => ({ scale: s, x: W / 2 - s * cx, y: H / 2 - s * cy });
  if (V) {
    const wide = shot5(1.0, winW / 2, winH / 2), convo = shot5(1.55, paneL + (winW - paneL) / 2, winH * 0.62);
    gsap.set("#win5", { transformOrigin: "0px 0px", ...wide });
    tl.fromTo("#win5", wide, { ...convo, duration: 1.4, ease: "power2.inOut" }, T.type1End - 0.4);
    tl.fromTo("#win5", convo, { ...wide, duration: 0.9, ease: "power3.inOut", immediateRender: false }, T.s5out - 1.2);
  } else {
    gsap.set("#win5", { transformOrigin: "760px 640px" });
    tl.fromTo("#win5", { scale: 1 }, { scale: 1.12, duration: 6.2, ease: "sine.inOut" }, T.reply);
    tl.fromTo("#win5", { scale: 1.12 }, { scale: 1, duration: 0.8, ease: "power3.inOut", immediateRender: false }, T.approve + 0.45);
  }

  // the founder approves on the hit: target = Approve button centre at that moment
  const ap = posIn($("#approve"), SLZ), apEl = $("#approve");
  const AP = { x: ap.x + apEl.offsetWidth * 0.42, y: ap.y + apEl.offsetHeight * 0.5 + colY(3) }; // m3, m4 still below the fold
  const cp = posIn($("#comp"), SLZ);
  const CI = { x: cp.x + $("#comp").offsetWidth * 0.62, y: cp.y + 70 };
  tl.fromTo("#cur5", { x: CI.x, y: CI.y, opacity: 0 }, { x: CI.x, y: CI.y, opacity: 1, duration: 0.18 }, T.cursorIn);
  tl.to("#cur5", { x: (CI.x + AP.x) / 2 + 60, y: (CI.y + AP.y) / 2 + 20, duration: 1.3, ease: "power2.inOut" }, T.cursorIn + 0.2);
  tl.to("#cur5", { x: AP.x, y: AP.y, duration: 0.85, ease: "power3.inOut" }, T.approve - 1.15);
  tl.to("#approve", { backgroundColor: "#005e45", borderColor: "#005e45", duration: 0.15 }, T.approve - 0.28);
  tl.fromTo("#cur5", { scale: 1 }, { scale: 0.82, duration: 0.08, yoyo: true, repeat: 1, ease: "power1.inOut", immediateRender: false }, T.approve); // beat-locked: 43.65s
  tl.fromTo("#cur5-ring", { scale: 0.3, opacity: 1 }, { scale: 1.6, opacity: 0, duration: 0.5, ease: "power2.out" }, T.approve);
  tl.fromTo("#approve", { scale: 1 }, { scale: 0.95, duration: 0.08, yoyo: true, repeat: 1, immediateRender: false }, T.approve);
  tl.to("#btns", { opacity: 0, duration: 0.15 }, T.approve + 0.16);
  tl.fromTo("#approved", { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.4, ease: "back.out(2)" }, T.approve + 0.2);
  tl.to("#cur5", { x: CI.x, y: CI.y, opacity: 0, duration: 0.6, ease: "power2.inOut" }, T.approve + 0.4);
  // second ask: hiring
  tl.set("#ph", { opacity: 0 }, T.type2 - 0.02);
  tl.to("#send", { backgroundColor: "#007a5a", color: "#ffffff", duration: 0.15 }, T.type2);
  typeOut("@Argo " + M3, T.type2, T.type2End);
  tl.set("#typed-t", { textContent: "" }, T.send2);
  tl.set("#ph", { opacity: 1 }, T.send2 + 0.02);
  tl.to("#send", { backgroundColor: "rgba(0,0,0,0)", color: "#b9b9b9", duration: 0.15 }, T.send2);
  step(4, T.send2); show("#fi-m3", T.send2 + 0.05);
  step(5, T.reply2); show("#fi-m4", T.reply2 + 0.04);
  tl.fromTo(["#dc0", "#dc1", "#dc2"], { x: -10, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35, ease: "power2.out", stagger: 0.14 }, T.reply2 + 0.12);
  tl.to("#s5-in", { scale: 0.92, y: 30, opacity: 0, duration: 0.35, ease: "power2.in" }, T.s5out);

  // ------------------------------------------------------------------ S6 governance
  tl.fromTo("#gov-eyebrow", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.6, ease: "expo.out" }, T.govEyebrow);
  tl.fromTo("#s6-core", { scale: 0, rotation: -20 }, { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.8)" }, T.govEyebrow + 0.05);
  // beat-grid: every other half-beat, then the set holds for reading
  [T.gov0, T.gov1, T.gov2, T.gov3].forEach((at, i) => {
    tl.fromTo(`#gov${i}`, { x: -70, opacity: 0, clipPath: "inset(0% 100% 0% 0%)" }, { x: 0, opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: "power4.out" }, at);
    tl.to(`#ring-g${i}`, { attr: { "stroke-dashoffset": 0 }, duration: 0.7, ease: "power2.out" }, at);
  });
  tl.fromTo("#game", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, T.game);
  tl.fromTo("#s6-right", { scale: 0.96 }, { scale: 1.03, duration: 4.4, ease: "sine.inOut" }, T.govEyebrow);
  tl.set("#s6-in", { opacity: 0 }, T.verb0); // hard cut on 52.38

  // ------------------------------------------------------------------ S7 verbs + lockup
  const VT = [T.verb0, T.verb1, T.verb2, T.verb3, T.lockup];
  [0, 1, 2, 3].forEach((i) => {
    tl.fromTo(`#verb${i}`, { scale: 1.22, opacity: 0, filter: "blur(16px)" }, { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.34, ease: "power3.out" }, VT[i]);
    tl.to(`#verb${i}`, { scale: 0.92, opacity: 0, filter: "blur(10px)", duration: 0.2, ease: "power2.in" }, VT[i + 1] - 0.2);
    tl.to(`#vr${i}`, { color: "#6ec75a", duration: 0.2 }, VT[i]);
  });
  tl.fromTo("#verb-rail", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, T.verb0 + 0.05);
  tl.to("#verb-rail", { opacity: 0, y: 10, duration: 0.25, ease: "power2.in" }, T.lockup - 0.25);
  // beat-locked: 56.74s — the lockup
  tl.fromTo("#flash", { opacity: 0 }, { opacity: 0.55, duration: 0.06, immediateRender: false }, T.lockup - 0.03);
  tl.to("#flash", { opacity: 0, duration: 0.8, ease: "power2.out" }, T.lockup + 0.04);
  tl.fromTo("#glowB", { opacity: 0, scale: 0.7 }, { opacity: 0.6, scale: 1.1, duration: 1.4, ease: "power2.out", immediateRender: false }, T.lockup);
  tl.fromTo("#lock-logo", { scale: 0, rotation: -24 }, { scale: 1, rotation: 0, duration: 0.75, ease: "back.out(1.7)" }, T.lockup);
  if (V) tl.fromTo("#lock-word", { clipPath: "inset(0% 0% 100% 0%)", y: -40 }, { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 0.75, ease: "power3.out" }, T.lockup + 0.18);
  else tl.fromTo("#lock-word", { clipPath: "inset(0% 100% 0% 0%)", x: -50 }, { clipPath: "inset(0% 0% 0% 0%)", x: 0, duration: 0.75, ease: "power3.out" }, T.lockup + 0.18);
  tl.fromTo("#lock-tag", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, T.lockup + 0.55);
  tl.fromTo("#lock-url", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" }, T.lockup + 0.95);
  tl.fromTo("#lock", { scale: 1 }, { scale: 1.035, duration: T.end - T.lockup - 1, ease: "sine.inOut", immediateRender: false }, T.lockup + 1);

  window.__timelines["main"] = tl;
});
