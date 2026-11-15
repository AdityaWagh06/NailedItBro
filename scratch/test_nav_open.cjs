const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const port = 9391;
const proc = exec(`${edge} --headless --remote-debugging-port=${port} --disable-gpu --window-size=390,844 http://localhost:5173/`);

const artifactDir = 'C:\\Users\\avdp1\\.gemini\\antigravity\\brain\\c7df19d8-966e-4cbc-91d1-26d55021bd65';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  try {
    let tab;
    for (let i = 0; i < 20; i++) {
      await sleep(400);
      try {
        const data = await new Promise((res, rej) => {
          http.get(`http://127.0.0.1:${port}/json`, (r) => {
            let s = ''; r.on('data', c => s += c); r.on('end', () => res(s));
          }).on('error', rej);
        });
        const tabs = JSON.parse(data);
        tab = tabs.find(t => t.url.includes('localhost:5173'));
        if (tab) break;
      } catch (e) {}
    }

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

    await sleep(1200);

    // Click nav burger button
    await send('Runtime.evaluate', {
      expression: `document.querySelector('.nav__burger')?.click();`
    });

    await sleep(500);

    const snapNav = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}/mobile_audit_05_nav_open.png`, Buffer.from(snapNav.data, 'base64'));
    console.log('Saved mobile_audit_05_nav_open.png');

    ws.close();
    proc.kill();
  } catch (e) {
    console.error(e);
    try { proc.kill(); } catch (err) {}
  }
})();

