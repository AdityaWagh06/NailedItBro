const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/avdp1/.gemini/antigravity/brain/c7df19d8-966e-4cbc-91d1-26d55021bd65';
const PORT = 9230;
const EDGE_PATH = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function getTargetTab() {
  for (let i = 0; i < 20; i++) {
    await sleep(400);
    try {
      const data = await new Promise((resolve, reject) => {
        const req = http.get(`http://127.0.0.1:${PORT}/json`, (res) => {
          let str = '';
          res.on('data', c => str += c);
          res.on('end', () => resolve(str));
        });
        req.on('error', reject);
      });
      const tabs = JSON.parse(data);
      const target = tabs.find(t => t.webSocketDebuggerUrl && t.url.includes('localhost:5173'));
      if (target) return target;
    } catch (e) {}
  }
  throw new Error('Target tab not found');
}

(async () => {
  const proc = exec(`${EDGE_PATH} --headless --remote-debugging-port=${PORT} --disable-gpu --window-size=1480,980 http://localhost:5173/`);

  try {
    const tab = await getTargetTab();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise(res => ws.addEventListener('open', res));

    let msgId = 1;
    const send = (method, params = {}) => {
      return new Promise(resolve => {
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

    await send('Page.enable');
    await send('DOM.enable');
    await send('Runtime.enable');

    await sleep(2500);

    // Scroll to Services
    await send('Runtime.evaluate', {
      expression: `document.getElementById('services')?.scrollIntoView({ behavior: 'instant', block: 'start' });`
    });
    await sleep(600);

    // Click Card 07 (CRM Dashboards)
    const res = await send('Runtime.evaluate', {
      expression: `
        const card = Array.from(document.querySelectorAll('.svc-h-card')).find(c => c.textContent.includes('CRM Dashboards'));
        if (card) {
          card.click();
          card.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
          'FOUND AND CLICKED';
        } else {
          'NOT FOUND';
        }
      `,
      returnByValue: true
    });
    console.log('Click result:', res.result.value);
    await sleep(800);

    const shot7 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'verify_split_click_crm_success.png'), Buffer.from(shot7.data, 'base64'));

    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    try { proc.kill(); } catch (e) {}
    process.exit(0);
  }
})();

