const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/avdp1/.gemini/antigravity/brain/c7df19d8-966e-4cbc-91d1-26d55021bd65';
const PORT = 9228;
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
    await snap('verify_split_image_9cards_default.png');

    // Inspect layout
    const info = await send('Runtime.evaluate', {
      expression: `
        JSON.stringify({
          cardsCount: document.querySelectorAll('.svc-h-card').length,
          activeTitle: document.querySelector('.svc-h-card.is-active .svc-h-card__title')?.textContent,
          hasLeftImage: !!document.querySelector('.services__showcase-media'),
          gridColumns: window.getComputedStyle(document.querySelector('.services__cards-grid')).gridTemplateColumns
        })
      `,
      returnByValue: true
    });
    console.log('Layout Info:', info.result.value);

    // 2. Click Card 04 (AI Automation & Smart QR)
    await send('Runtime.evaluate', {
      expression: `
        const cards = document.querySelectorAll('.svc-h-card');
        if (cards[3]) cards[3].click();
      `
    });
    await sleep(600);
    await snap('verify_split_image_click_ai_qr.png');

    // 3. Click Card 02 (Mobile Application Development)
    await send('Runtime.evaluate', {
      expression: `
        const cards = document.querySelectorAll('.svc-h-card');
        if (cards[1]) cards[1].click();
      `
    });
    await sleep(600);
    await snap('verify_split_image_click_mobile_app.png');

    // 4. Click Card 09 (SEO & Organic Growth)
    await send('Runtime.evaluate', {
      expression: `
        const cards = document.querySelectorAll('.svc-h-card');
        if (cards[8]) cards[8].click();
      `
    });
    await sleep(600);
    await snap('verify_split_image_click_seo.png');

    ws.close();
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    try { proc.kill(); } catch (e) {}
    process.exit(0);
  }
})();

