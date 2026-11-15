const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const port = 9322;
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

        // 1. Inspect floating socials
        const socials = await evalExpr(`(() => {
          const links = Array.from(document.querySelectorAll('.floating-socials a'));
          return links.map(a => ({
            label: a.getAttribute('aria-label'),
            href: a.getAttribute('href')
          }));
        })()`);
        console.log('Floating Socials:', JSON.stringify(socials.result.value, null, 2));

        // 2. Scroll to #services
        await evalExpr(`(() => {
          const el = document.querySelector('#services');
          if (el) {
            el.scrollIntoView({ behavior: 'instant', block: 'center' });
          }
        })()`);
        await sleep(800);

        // Metrics for cards
        const info = await evalExpr(`(() => {
          const cards = Array.from(document.querySelectorAll('.svc-v-card'));
          const titles = cards.map(c => c.querySelector('.svc-v-card__title')?.textContent.trim());
          const heights = cards.map(c => Math.round(c.getBoundingClientRect().height));
          const listHeight = Math.round(document.querySelector('.services__vertical-list')?.getBoundingClientRect().height || 0);
          const showcaseHeight = Math.round(document.querySelector('.services__showcase')?.getBoundingClientRect().height || 0);
          return { count: cards.length, titles, heights, listHeight, showcaseHeight };
        })()`);
        console.log('Services Diagnostic Info:', JSON.stringify(info.result.value, null, 2));

        // Screenshot 1: Extended 8 cards with card 01 active
        await captureScreenshot('verify_extended_whatsapp_initial.png');

        // Screenshot 2: Click card 01 to toggle closed
        await evalExpr(`(() => {
          const cards = document.querySelectorAll('.svc-v-card');
          if (cards[0]) cards[0].click();
        })()`);
        await sleep(500);
        await captureScreenshot('verify_extended_whatsapp_all_collapsed.png');

        // Screenshot 3: Click card 03 (AI Automation)
        await evalExpr(`(() => {
          const cards = document.querySelectorAll('.svc-v-card');
          if (cards[3]) cards[3].click();
        })()`);
        await sleep(500);
        await captureScreenshot('verify_extended_whatsapp_ai.png');

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

