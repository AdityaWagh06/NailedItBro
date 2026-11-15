const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const proc = exec(`${edge} --headless --remote-debugging-port=9295 --disable-gpu --window-size=1440,1050 http://localhost:5173/#services`);

const artifactDir = 'C:\\Users\\avdp1\\.gemini\\antigravity\\brain\\c7df19d8-966e-4cbc-91d1-26d55021bd65';

setTimeout(() => {
  http.get('http://127.0.0.1:9295/json', (res) => {
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
          await sleep(600);

          // Test card 3 (Mobile App)
          await evalExpr(`document.querySelectorAll('.svc-pill-card')[2].click()`);
          await sleep(600);
          await captureScreenshot('services_test_card3_apps.png');

          // Test card 7 (Social Media Growth)
          await evalExpr(`document.querySelectorAll('.svc-pill-card')[6].click()`);
          await sleep(600);
          await captureScreenshot('services_test_card7_social.png');

          // Test card 9 (CRM Dashboards)
          await evalExpr(`document.querySelectorAll('.svc-pill-card')[8].click()`);
          await sleep(600);
          await captureScreenshot('services_test_card9_crm.png');

          console.log('Batch screenshots saved!');
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

