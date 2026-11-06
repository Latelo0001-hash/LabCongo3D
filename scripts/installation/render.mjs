/* global process, fetch, WebSocket, setTimeout, console */
// Rendu de l'installation image par image, dans un Chrome piloté (--remote-debugging-port) : la page de l'outil
// (vite --config scripts/installation/vite.config.ts) affiche la photo et la scène 3D ; on règle l'avancement, on capture.
// Usage : node scripts/installation/render.mjs <port CDP> <url> <dossier> [nombre d'images | liste d'avancements « 0,.5,1 »]
import { mkdirSync, writeFileSync } from 'node:fs';

const [port, url, out, frames = '120'] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const marks = frames.includes(',') ? frames.split(',').map(Number) : Array.from({ length: Number(frames) }, (_, i) => i / (Number(frames) - 1));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0; const pending = new Map(); const errors = [];
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text);
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push(m.params.args.map((a) => a.value ?? a.description).join(' '));
});
const send = (method, params = {}) => new Promise((resolve) => { const n = ++id; pending.set(n, resolve); ws.send(JSON.stringify({ id: n, method, params })); });
const evaluate = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result?.result?.value;
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1072, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url });
const ready = await evaluate(`new Promise((resolve) => { const t0 = Date.now(); const tick = () => window.installation?.ready || Date.now() - t0 > 60000 ? resolve(Boolean(window.installation?.ready)) : setTimeout(tick, 250); tick(); })`);
if (!ready) console.log('scène non prête après 60 s');
await sleep(500);
for (const [i, t] of marks.entries()) {
  await evaluate(`window.installation.set(${t})`);
  const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 1920, height: 1072, scale: 1 } });
  writeFileSync(`${out}/${String(i).padStart(4, '0')}.png`, Buffer.from(shot.result.data, 'base64'));
}
console.log(`${marks.length} images`, errors.length ? `\n${errors.slice(0, 5).join('\n')}` : 'aucune erreur');
ws.close();
await fetch(`http://127.0.0.1:${port}/json/close/${target.id}`, { method: 'PUT' });
