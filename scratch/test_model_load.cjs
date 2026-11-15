const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const port = 9398;
const proc = exec(`${edge} --headless --remote-debugging-port=${port} --disable-gpu --window-size=390,844 http://localhost:5173/`);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  await sleep(1500);
  const data = await new Promise((res, rej) => {
    http.get(`http://127.0.0.1:${port}/json`, r => {
      let s = ''; r.on('data', c => s += c); r.on('end', () => res(s));
    }).on('error', rej);
  });
  const tab = JSON.parse(data).find(t => t.url.includes('localhost:5173'));
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 1;
  const send = (method, params = {}) => new Promise(res => {
    const cur = id++;
    const h = (e) => {
      const d = JSON.parse(e.data);
      if (d.id === cur) { ws.removeEventListener('message', h); res(d.result); }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: cur, method, params }));
  });
  await new Promise(r => ws.addEventListener('open', r));
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await sleep(2500);
  const modelLoaded = await send('Runtime.evaluate', {
    expression: `
      const mv = document.querySelector('model-viewer');
      ({
        loaded: mv?.loaded,
        src: mv?.src,
        orbit: mv?.getAttribute('camera-orbit'),
        target: mv?.getAttribute('camera-target'),
        dismissed: mv?.dismissed
      })
    `,
    returnByValue: true
  });
  console.log('Model status:', modelLoaded.result?.value);
  const snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/avdp1/.gemini/antigravity/brain/c7df19d8-966e-4cbc-91d1-26d55021bd65/responsive_mobile_hero_2500.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved 2500ms');
  ws.close();
  proc.kill();
})();

