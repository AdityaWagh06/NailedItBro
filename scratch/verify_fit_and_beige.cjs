const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const proc = exec(`${edge} --headless --remote-debugging-port=9295 --disable-gpu --window-size=1440,900 http://localhost:5173/`);

const artifactDir = 'C:\\Users\\avdp1\\.gemini\\antigravity\\brain\\c7df19d8-966e-4cbc-91d1-26d55021bd65';

setTimeout(() => {
  http.get('http://127.0.0.1:9295/json', (res) => {
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
          if (res && res.data) {
            fs.writeFileSync(`${artifactDir}\\${filename}`, Buffer.from(res.data, 'base64'));
            console.log(`Saved ${filename}`);
          } else {
            console.error(`Failed to capture ${filename}`, res);
          }
        };
        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        ws.onopen = async () => {
          try {
            await sleep(2000);
            await sendCommand('Page.enable');

            // 1. Scroll to Services section so the entire split is in view
            await evalExpr(`(() => {
              const el = document.querySelector('#services');
              if (el) {
                const y = el.getBoundingClientRect().top + window.pageYOffset - 10;
                window.scrollTo(0, y);
              }
            })()`);
            await sleep(1000);
            await captureScreenshot('verify_services_fit_all_8.png');

            // 2. Click AI Automation & Smart QR card (index 3)
            await evalExpr(`(() => {
              const cards = document.querySelectorAll('.svc-card');
              if (cards[3]) cards[3].click();
            })()`);
            await sleep(800);
            await captureScreenshot('verify_services_fit_ai_active.png');

            // 3. Click the last card (Google & Meta Ads - index 7)
            await evalExpr(`(() => {
              const cards = document.querySelectorAll('.svc-card');
              if (cards[7]) cards[7].click();
            })()`);
            await sleep(800);
            await captureScreenshot('verify_services_fit_ads_active.png');

            // 4. Scroll down into Work section (Beige canvas with cards)
            await evalExpr(`(() => {
              const el = document.querySelector('#work');
              if (el) {
                const y = el.getBoundingClientRect().top + window.pageYOffset + 60;
                window.scrollTo(0, y);
              }
            })()`);
            await sleep(1000);
            await captureScreenshot('verify_work_on_beige_canvas.png');

            console.log('All verification captures completed!');
          } catch (e) {
            console.error(e);
          } finally {
            ws.close();
            proc.kill();
            process.exit(0);
          }
        };
      } catch (err) {
        console.error(err);
        proc.kill();
        process.exit(1);
      }
    });
  });
}, 2500);
