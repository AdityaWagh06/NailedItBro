const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/avdp1/.gemini/antigravity/brain/c7df19d8-966e-4cbc-91d1-26d55021bd65';
const PORT = 9227;
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
  const proc = exec(`${EDGE_PATH} --headless --remote-debugging-port=${PORT} --disable-gpu --window-size=1440,1050 http://localhost:5173/`);

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

    // Wait for initial loader and reveal
    await sleep(2500);

    const snap = async (name) => {
      const res = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(ARTIFACT_DIR, name), Buffer.from(res.data, 'base64'));
      console.log(`Saved screenshot: ${name}`);
    };

    // 1. Scroll directly to Services section
    await send('Runtime.evaluate', {
      expression: `document.getElementById('services')?.scrollIntoView({ behavior: 'instant', block: 'start' });`
    });
    await sleep(800);
    await snap('verify_9_services_grid_all.png');

    // 2. Count the cards and inspect grid computed styles
    const gridInfo = await send('Runtime.evaluate', {
      expression: `
        JSON.stringify({
          cardCount: document.querySelectorAll('.svc-card-h').length,
          gridColumns: window.getComputedStyle(document.querySelector('.services__grid')).gridTemplateColumns,
          card1Title: document.querySelectorAll('.svc-card-h__title')[0]?.textContent,
          card4Title: document.querySelectorAll('.svc-card-h__title')[3]?.textContent,
          card9Title: document.querySelectorAll('.svc-card-h__title')[8]?.textContent
        })
      `,
      returnByValue: true
    });
    console.log('Grid Info:', gridInfo.result.value);

    // 3. Click the 4th card (AI Automation & Smart QR)
    await send('Runtime.evaluate', {
      expression: `
        const cards = document.querySelectorAll('.svc-card-h');
        if (cards[3]) cards[3].click();
      `
    });
    await sleep(600);
    await snap('verify_service_modal_ai_qr.png');

    // 4. Click the "Next" button in the modal to verify navigation
    await send('Runtime.evaluate', {
      expression: `
        const nextBtn = document.querySelector('.svc-modal__nav-btn[aria-label="Next service"]');
        if (nextBtn) nextBtn.click();
      `
    });
    await sleep(600);
    await snap('verify_service_modal_next_social.png');

    // 5. Click the close button
    await send('Runtime.evaluate', {
      expression: `
        const closeBtn = document.querySelector('.svc-modal__close-btn');
        if (closeBtn) closeBtn.click();
      `
    });
    await sleep(600);
    await snap('verify_service_after_modal_closed.png');

    ws.close();
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    try { proc.kill(); } catch (e) {}
    process.exit(0);
  }
})();

