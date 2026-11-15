const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/avdp1/.gemini/antigravity/brain/c7df19d8-966e-4cbc-91d1-26d55021bd65';
const PORT = 9231;
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

    // 1. Scroll directly to Services section
    await send('Runtime.evaluate', {
      expression: `document.getElementById('services')?.scrollIntoView({ behavior: 'instant', block: 'start' });`
    });
    await sleep(700);

    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'verify_broader_image_smaller_cards_web.png'), Buffer.from(shot1.data, 'base64'));

    // Check dimensions
    const dims = await send('Runtime.evaluate', {
      expression: `
        JSON.stringify({
          imageColWidth: document.querySelector('.services__showcase-col')?.offsetWidth,
          imageHeight: document.querySelector('.services__showcase')?.offsetHeight,
          cardWidth: document.querySelector('.svc-h-card')?.offsetWidth,
          cardHeight: document.querySelector('.svc-h-card')?.offsetHeight,
          hasRemovedBtn: !!document.querySelector('.svc-showcase__cta-btn')
        })
      `,
      returnByValue: true
    });
    console.log('Dimensions:', dims.result.value);

    // 2. Click AI card
    await send('Runtime.evaluate', {
      expression: `
        const card = Array.from(document.querySelectorAll('.svc-h-card')).find(c => c.textContent.includes('AI Automation & Smart QR'));
        if (card) {
          card.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        }
      `
    });
    await sleep(700);

    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'verify_broader_image_smaller_cards_ai.png'), Buffer.from(shot2.data, 'base64'));

    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    try { proc.kill(); } catch (e) {}
    process.exit(0);
  }
})();

