const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const proc = exec(`${edge} --headless --remote-debugging-port=9286 --disable-gpu --window-size=1440,900 http://localhost:5173/#services`);

const artifactDir = 'C:\\Users\\avdp1\\.gemini\\antigravity\\brain\\c7df19d8-966e-4cbc-91d1-26d55021bd65';

setTimeout(() => {
  http.get('http://127.0.0.1:9286/json', (res) => {
    let data = ''; res.on('data', c => data += c);
    res.on('end', async () => {
      try {
        const tabs = JSON.parse(data);
        const targetTab = tabs.find(t => t.url.includes('localhost:5173'));
        if (!targetTab) { proc.kill(); process.exit(1); }
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

            // Scroll down in increments of 300px and take screenshots
            await evalExpr(`window.scrollTo(0, document.querySelector('#services').offsetTop)`);
            await sleep(600);
            await captureScreenshot('scroll_services_step0.png');

            await evalExpr(`window.scrollBy(0, 350)`);
            await sleep(600);
            await captureScreenshot('scroll_services_step1.png');

            await evalExpr(`window.scrollBy(0, 350)`);
            await sleep(600);
            await captureScreenshot('scroll_services_step2.png');

            console.log('Scroll steps captured!');
          } catch (e) {
            console.error(e);
          } finally {
            ws.close();
            proc.kill();
            process.exit(0);
          }
        };
      } catch (err) {
        proc.kill();
        process.exit(1);
      }
    });
  });
}, 2500);

