import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import fs from "node:fs";
const files = fs.readdirSync("logos").filter(f => f.endsWith(".svg") || f.endsWith(".png"));
const cells = files.map(f => `<div class="c"><div class="t"><img src="logos/${f}"></div><p>${f}</p></div>`).join("");
fs.writeFileSync("sheet.html", `<html><body style="margin:0;background:#e9edf2;font:14px sans-serif"><style>.c{display:inline-block;width:200px;margin:8px;text-align:center}.t{width:180px;height:180px;margin:auto;background:#fff;border-radius:24px;display:flex;align-items:center;justify-content:center}.t img{width:120px;height:120px;object-fit:contain}</style>${cells}</body></html>`);
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" + "" });
const p = await b.newPage({ viewport: { width: 1100, height: 800 } });
await p.goto("file://" + process.cwd() + "/sheet.html"); await p.waitForTimeout(400);
await p.screenshot({ path: process.argv[2], fullPage: true }); await b.close();
