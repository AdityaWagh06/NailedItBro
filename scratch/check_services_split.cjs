const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const proc = exec(`${edge} --headless --remote-debugging-port=9293 --disable-gpu --window-size=1440,1050 http://localhost:5173/#services`);

const artifactDir = 'C:\\Users\\avdp1\\.gemini\\antigravity\\brain\\c7df19d8-966e-4cbc-91d1-26d55021bd65';

setTimeout(() => {
  http.get('http://127.0.0.1:9293/json', (res) => {
    let data = ''; res.on('data', c => data += c);
    res.on('end', () => {
      const tabs = JSON.parse(data);
      const targetTab = tabs.find(t => t.url.includes('localhost:5173'));
      if (!targetTab) {
        console.error('Target tab not found');
        proc.kill();
        process.exit(1);
      }
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

      const evalExpr = async (expression) => {
        return await sendCommand('Runtime.evaluate', { expression });
      };

      const captureScreenshot = async (filename) => {
        const res = await sendCommand('Page.captureScreenshot', { format: 'png' });
        const outPath = `${artifactDir}\\${filename}`;
        fs.writeFileSync(outPath, Buffer.from(res.data, 'base64'));
        console.log('Saved to ' + outPath);
      };

      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      ws.onopen = async () => {
        try {
          await sleep(1500);

          // Scroll down to center the split section
          await evalExpr(`(() => {
            const split = document.querySelector('.services__split');
            if (split) {
              const y = split.getBoundingClientRect().top + window.pageYOffset - 120;
              window.scrollTo(0, y);
            }
          })()`);
          await sleep(1000);

          await captureScreenshot('services_split_centered.png');

          // Click on 2nd card (Website Development)
          await evalExpr(`(() => {
            const cards = document.querySelectorAll('.svc-pill-card');
            if (cards[1]) cards[1].click();
          })()`);
          await sleep(1000);

          await captureScreenshot('services_split_card2_centered.png');

          // Click on 4th card (Game Development)
          await evalExpr(`(() => {
            const cards = document.querySelectorAll('.svc-pill-card');
            if (cards[3]) cards[3].click();
          })()`);
          await sleep(1000);

          await captureScreenshot('services_split_card4_game.png');

          console.log('Finished capturing screenshots successfully.');
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
