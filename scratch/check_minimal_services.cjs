const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const proc = exec(`${edge} --headless --remote-debugging-port=9298 --disable-gpu --window-size=1440,1050 http://localhost:5173/#services`);

const artifactDir = 'C:\\Users\\avdp1\\.gemini\\antigravity\\brain\\c7df19d8-966e-4cbc-91d1-26d55021bd65';

setTimeout(() => {
  http.get('http://127.0.0.1:9298/json', (res) => {
    let data = ''; res.on('data', c => data += c);
    res.on('end', async () => {
      const tabs = JSON.parse(data);
      const targetTab = tabs.find(t => t.url.includes('localhost:5173'));
      const ws = new WebSocket(targetTab.webSocketDebuggerUrl);

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

      const evalExpr = async (expression) => sendCommand('Runtime.evaluate', { expression });
      const captureScreenshot = async (filename) => {
        const res = await sendCommand('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(`${artifactDir}\\${filename}`, Buffer.from(res.data, 'base64'));
      };
      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      ws.onopen = async () => {
        try {
          await sleep(1500);

          await evalExpr(`(() => {
            const split = document.querySelector('.services__split');
            if (split) {
              const y = split.getBoundingClientRect().top + window.pageYOffset - 120;
              window.scrollTo(0, y);
            }
          })()`);
          await sleep(800);

          // 1. Initial State: UI/UX (Card 1 active)
          await captureScreenshot('services_minimal_01.png');

          // 2. Click on Card 2 (Website Development)
          await evalExpr(`document.querySelectorAll('.svc-card')[1].click()`);
          await sleep(800);
          await captureScreenshot('services_minimal_02_web.png');

          // 3. Click on Card 8 (Brand Identity & Digital Presence)
          await evalExpr(`document.querySelectorAll('.svc-card')[7].click()`);
          await sleep(800);
          await captureScreenshot('services_minimal_08_brand.png');

          console.log('All minimal screenshots captured successfully!');
        } catch (err) {
          console.error(err);
        } finally {
          ws.close();
          proc.kill();
          process.exit(0);
        }
      };
    });
  });
}, 2500);

