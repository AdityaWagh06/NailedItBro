const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const port = 9310;
const proc = exec(`${edge} --headless --remote-debugging-port=${port} --disable-gpu --window-size=390,844 http://localhost:5173/`);

const artifactDir = 'C:\\Users\\avdp1\\.gemini\\antigravity\\brain\\c7df19d8-966e-4cbc-91d1-26d55021bd65';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getTargetTab() {
  for (let i = 0; i < 15; i++) {
    await sleep(500);
    try {
      const data = await new Promise((resolve, reject) => {
        const req = http.get(`http://127.0.0.1:${port}/json`, (res) => {
          let str = '';
          res.on('data', (c) => (str += c));
          res.on('end', () => resolve(str));
        });
        req.on('error', reject);
      });
      const tabs = JSON.parse(data);
      const target = tabs.find((t) => t.url.includes('localhost:5173'));
      if (target) return target;
    } catch (e) {}
  }
  throw new Error('Target tab not found after 15 attempts');
}

(async () => {
  try {
    const tab = await getTargetTab();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    let msgId = 1;
    const sendCommand = (method, params = {}) => {
      return new Promise((resolve) => {
        const id = msgId++;
        const onMsg = (msg) => {
          const r = JSON.parse(msg.data);
          if (r.id === id) {
            ws.removeEventListener('message', onMsg);
            resolve(r.result);
          }
        };
        ws.addEventListener('message', onMsg);
        ws.send(JSON.stringify({ id, method, params }));
      });
    };

    await new Promise((r) => (ws.onopen = r));
    await sendCommand('Page.enable');
    await sendCommand('DOM.enable');

    // 1. Mobile (390 x 844)
    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });

    await sleep(2500);

    // Capture mobile top
    const snap1 = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}\\mobile_hero_redesign_top.png`, Buffer.from(snap1.data, 'base64'));
    console.log('Saved mobile_hero_redesign_top.png');

    // Scroll down 250px to view full mobile hero content flow
    await sendCommand('Runtime.evaluate', {
      expression: 'window.scrollTo({ top: 220, behavior: "instant" })',
    });
    await sleep(600);

    const snap2 = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}\\mobile_hero_redesign_scrolled.png`, Buffer.from(snap2.data, 'base64'));
    console.log('Saved mobile_hero_redesign_scrolled.png');

    // Full page capture of mobile hero
    await sendCommand('Runtime.evaluate', {
      expression: 'window.scrollTo({ top: 0, behavior: "instant" })',
    });
    await sleep(400);

    // 2. Desktop (1440 x 900)
    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sleep(1000);

    const snap3 = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}\\desktop_hero_verify.png`, Buffer.from(snap3.data, 'base64'));
    console.log('Saved desktop_hero_verify.png');

    ws.close();
    proc.kill();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    proc.kill();
    process.exit(1);
  }
})();
