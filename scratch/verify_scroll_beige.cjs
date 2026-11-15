const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/avdp1/.gemini/antigravity/brain/c7df19d8-966e-4cbc-91d1-26d55021bd65';
const PORT = 9226;
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
  const proc = exec(`${EDGE_PATH} --headless --remote-debugging-port=${PORT} --disable-gpu --window-size=1400,900 http://localhost:5173/`);

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

    // 1. Scroll directly to Manifesto top
    await send('Runtime.evaluate', {
      expression: `document.getElementById('manifesto')?.scrollIntoView({ behavior: 'instant', block: 'start' });`
    });
    await sleep(700);
    await snap('verify_scroll_manifesto_top.png');

    // 2. Scroll to Manifesto stats where user saw dark transition
    await send('Runtime.evaluate', {
      expression: `document.querySelector('.manifesto__stats')?.scrollIntoView({ behavior: 'instant', block: 'center' });`
    });
    await sleep(700);
    await snap('verify_scroll_manifesto_stats_beige.png');

    // Inspect colors in DOM
    const colors = await send('Runtime.evaluate', {
      expression: `
        JSON.stringify({
          bodyBg: window.getComputedStyle(document.body).backgroundColor,
          manifestoBg: window.getComputedStyle(document.getElementById('manifesto')).backgroundColor,
          htmlPageAttr: document.documentElement.dataset.page
        })
      `,
      returnByValue: true
    });
    console.log('DOM Colors at Manifesto stats:', colors.result.value);

    // 3. Scroll boundary: bottom of Manifesto and top of Services
    await send('Runtime.evaluate', {
      expression: `window.scrollBy(0, 350);`
    });
    await sleep(700);
    await snap('verify_scroll_manifesto_into_services.png');

    // 4. Scroll into Services section
    await send('Runtime.evaluate', {
      expression: `document.getElementById('services')?.scrollIntoView({ behavior: 'instant', block: 'start' });`
    });
    await sleep(700);
    await snap('verify_scroll_services_section.png');

    // 5. Scroll into Work section
    await send('Runtime.evaluate', {
      expression: `document.getElementById('work')?.scrollIntoView({ behavior: 'instant', block: 'start' });`
    });
    await sleep(700);
    await snap('verify_scroll_work_section.png');

    const workColors = await send('Runtime.evaluate', {
      expression: `
        JSON.stringify({
          bodyBg: window.getComputedStyle(document.body).backgroundColor,
          workBg: window.getComputedStyle(document.getElementById('work')).backgroundColor,
          htmlPageAttr: document.documentElement.dataset.page
        })
      `,
      returnByValue: true
    });
    console.log('DOM Colors at Work section:', workColors.result.value);

    ws.close();
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    try { proc.kill(); } catch (e) {}
    process.exit(0);
  }
})();
