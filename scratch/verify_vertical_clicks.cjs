const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/avdp1/.gemini/antigravity/brain/c7df19d8-966e-4cbc-91d1-26d55021bd65';
const PORT = 9234;
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
  const proc = exec(`${EDGE_PATH} --headless --remote-debugging-port=${PORT} --disable-gpu --window-size=1440,900 http://localhost:5173/`);

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

    // Scroll directly to Services section
    await send('Runtime.evaluate', {
      expression: `document.getElementById('services')?.scrollIntoView({ behavior: 'instant', block: 'start' });`
    });
    await sleep(600);

    // Click Card index 3 (AI Automation)
    await send('Runtime.evaluate', {
      expression: `
        const cards = document.querySelectorAll('.svc-v-card');
        if (cards[3]) {
          cards[3].click();
          cards[3].dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        }
      `
    });
    await sleep(700);

    const shotAI = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'verify_vertical_services_click_ai_success.png'), Buffer.from(shotAI.data, 'base64'));

    // Click Card index 6 (CRM Dashboards)
    await send('Runtime.evaluate', {
      expression: `
        const cards = document.querySelectorAll('.svc-v-card');
        if (cards[6]) {
          cards[6].click();
          cards[6].dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        }
      `
    });
    await sleep(700);

    const shotCRM = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'verify_vertical_services_click_crm_success.png'), Buffer.from(shotCRM.data, 'base64'));

    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    try { proc.kill(); } catch (e) {}
    process.exit(0);
  }
})();

