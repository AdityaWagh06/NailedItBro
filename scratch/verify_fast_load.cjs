const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const port = 9388;
const proc = exec(`${edge} --headless --remote-debugging-port=${port} --disable-gpu --window-size=1440,900 http://localhost:5173/`);

const artifactDir = 'C:\\Users\\avdp1\\.gemini\\antigravity\\brain\\c7df19d8-966e-4cbc-91d1-26d55021bd65';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getTargetTab() {
  for (let i = 0; i < 20; i++) {
    await sleep(400);
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
    } catch (e) {
      // retry
    }
  }
  throw new Error('Target tab not found');
}

(async () => {
  try {
    const tab = await getTargetTab();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    let msgId = 1;
    const send = (method, params = {}) =>
      new Promise((resolve) => {
        const id = msgId++;
        const handler = (event) => {
          const resp = JSON.parse(event.data);
          if (resp.id === id) {
            ws.removeEventListener('message', handler);
            resolve(resp.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });

    await new Promise((resolve) => ws.addEventListener('open', resolve));

    await send('Page.enable');
    await send('Runtime.enable');

    // Wait for the faster 0.7s loader to reveal
    await sleep(1400);

    // Capture Hero section
    const snap1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}/verify_fast_hero.png`, Buffer.from(snap1.data, 'base64'));
    console.log('Saved verify_fast_hero.png');

    // Scroll to Services section
    await send('Runtime.evaluate', {
      expression: `
        const svc = document.querySelector('#services');
        if (svc) svc.scrollIntoView({ behavior: 'instant' });
      `
    });

    await sleep(600);

    const snap2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}/verify_fast_services.png`, Buffer.from(snap2.data, 'base64'));
    console.log('Saved verify_fast_services.png');

    // Check loaded image sources in services showcase
    const imgCheck = await send('Runtime.evaluate', {
      expression: `
        Array.from(document.querySelectorAll('.services__showcase-img')).map(img => ({
          src: img.src,
          complete: img.complete,
          naturalWidth: img.naturalWidth
        }))
      `,
      returnByValue: true
    });
    console.log('Showcase images check:', imgCheck.result?.value);

    ws.close();
    proc.kill();
    process.exit(0);
  } catch (err) {
    console.error(err);
    try { proc.kill(); } catch (e) {}
    process.exit(1);
  }
})();

