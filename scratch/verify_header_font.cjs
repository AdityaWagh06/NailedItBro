const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const port = 9345;
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

        // Scroll so the header is prominently in view
        await evalExpr(`(() => {
          const el = document.querySelector('#services');
          if (el) {
            const top = el.getBoundingClientRect().top + window.pageYOffset - 10;
            window.scrollTo(0, top);
          }
        })()`);
        await sleep(700);

        const headingInfo = await evalExpr(`(() => {
          const title = document.querySelector('.services__title');
          const style = window.getComputedStyle(title);
          return {
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
            fontWeight: style.fontWeight,
            lineHeight: style.lineHeight,
            letterSpacing: style.letterSpacing
          };
        })()`);
        console.log('Heading Computed Style:', JSON.stringify(headingInfo.result.value, null, 2));

        await captureScreenshot('verify_services_header_new_font.png');
        console.log('SCREENSHOT SAVED');
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

