const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const port = 9365;
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

        // Scroll to services
        await evalExpr(`(() => {
          const el = document.querySelector('#services');
          if (el) {
            const y = el.getBoundingClientRect().top + window.pageYOffset - 15;
            window.scrollTo(0, y);
          }
        })()`);
        await sleep(500);

        // Check preloaded layers
        const layers = await evalExpr(`(() => {
          const els = Array.from(document.querySelectorAll('.services__showcase-layer'));
          return els.map((el, i) => {
            const img = el.querySelector('img');
            const style = window.getComputedStyle(el);
            return {
              index: i,
              isActive: el.classList.contains('is-active'),
              opacity: style.opacity,
              visibility: style.visibility,
              src: img ? img.getAttribute('src') : null,
              naturalWidth: img ? img.naturalWidth : null
            };
          });
        })()`);
        console.log('Showcase Layers Diagnostics:', JSON.stringify(layers.result.value, null, 2));

        // Click card 1 (Mobile app) and immediately capture
        await evalExpr(`(() => {
          const cards = document.querySelectorAll('.svc-v-card');
          if (cards[1]) cards[1].click();
        })()`);
        await sleep(50); // immediate snapshot
        await captureScreenshot('verify_instant_click_mobile_immediate.png');

        // Click card 3 (AI) and immediately capture
        await evalExpr(`(() => {
          const cards = document.querySelectorAll('.svc-v-card');
          if (cards[3]) cards[3].click();
        })()`);
        await sleep(50); // immediate snapshot
        await captureScreenshot('verify_instant_click_ai_immediate.png');

        // Click card 7 (Google & Meta Ads) and capture
        await evalExpr(`(() => {
          const cards = document.querySelectorAll('.svc-v-card');
          if (cards[7]) cards[7].click();
        })()`);
        await sleep(200);
        await captureScreenshot('verify_instant_click_ads.png');

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

