const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const port = 9355;
const proc = exec(`${edge} --headless --remote-debugging-port=${port} --disable-gpu --window-size=1440,900 http://localhost:5173/`);

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
    } catch (e) {
      // retry
    }
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

    const evalExpr = async (expression) => sendCommand('Runtime.evaluate', { expression, returnByValue: true });
    const captureScreenshot = async (filename) => {
      const res = await sendCommand('Page.captureScreenshot', { format: 'png' });
      if (res && res.data) {
        fs.writeFileSync(`${artifactDir}\\${filename}`, Buffer.from(res.data, 'base64'));
        console.log(`Saved ${filename}`);
      }
    };

    ws.onopen = async () => {
      try {
        await sleep(1500);

        // Scroll directly to #work section and center the first card (Creme & Whisk)
        await evalExpr(`(() => {
          const el = document.querySelector('#work');
          if (el) {
            const card = document.querySelector('.work__card');
            if (card) {
              const y = card.getBoundingClientRect().top + window.pageYOffset - 80;
              window.scrollTo(0, y);
            }
          }
        })()`);
        await sleep(700);

        // Diagnostic info on mockup, phone, and button
        const check = await evalExpr(`(() => {
          const card = document.querySelector('.work__card');
          const hasPhone = !!card.querySelector('.proj__phone');
          const hasBrowser = !!card.querySelector('.proj__browser');
          const hasPulseDot = !!card.querySelector('.work__btn-live-pulse');
          const img = card.querySelector('.proj__clean-img');
          const btn = card.querySelector('.work__btn-live');
          return {
            hasPhone,
            hasBrowser,
            hasPulseDot,
            imgSrc: img ? img.getAttribute('src') : null,
            imgBounds: img ? { w: Math.round(img.getBoundingClientRect().width), h: Math.round(img.getBoundingClientRect().height) } : null,
            btnText: btn ? btn.innerText.trim() : null
          };
        })()`);
        console.log('Work Card Diagnostics:', JSON.stringify(check.result.value, null, 2));

        // Screenshot 1: Normal clean state
        await captureScreenshot('verify_work_clean_initial.png');

        // Screenshot 2: Hover over the Live Website button to capture reveal animation
        const btnBox = await evalExpr(`(() => {
          const btn = document.querySelector('.work__btn-live');
          if (!btn) return null;
          const rect = btn.getBoundingClientRect();
          return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        })()`);

        if (btnBox.result.value) {
          const { x, y } = btnBox.result.value;
          await sendCommand('Input.dispatchMouseEvent', {
            type: 'mouseMoved',
            x,
            y
          });
          await sleep(400);
          await captureScreenshot('verify_work_clean_btn_hover.png');
        }

        console.log('ALL VERIFICATIONS COMPLETED');
      } catch (err) {
        console.error('Error in ws loop:', err);
      } finally {
        ws.close();
        proc.kill();
        process.exit(0);
      }
    };
  } catch (e) {
    console.error('Failure:', e);
    proc.kill();
    process.exit(1);
  }
})();

