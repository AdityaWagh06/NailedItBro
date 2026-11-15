const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const proc = exec(`${edge} --headless --remote-debugging-port=9288 --disable-gpu --window-size=1440,900 http://localhost:5173/`);

const artifactDir = 'C:\\Users\\avdp1\\.gemini\\antigravity\\brain\\c7df19d8-966e-4cbc-91d1-26d55021bd65';

setTimeout(() => {
  http.get('http://127.0.0.1:9288/json', (res) => {
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
          console.log(`Saved ${filename}`);
        };
        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        ws.onopen = async () => {
          try {
            await sleep(2000);

            // Navigate / scroll directly to #services
            await evalExpr(`(() => {
              const el = document.querySelector('#services');
              if (el) {
                const y = el.getBoundingClientRect().top + window.pageYOffset - 40;
                window.scrollTo(0, y);
              }
            })()`);
            await sleep(800);
            await captureScreenshot('scroll_sync_step0_uiux.png');

            // Scroll down a bit to activate Website Development
            await evalExpr(`window.scrollBy(0, 180)`);
            await sleep(700);
            await captureScreenshot('scroll_sync_step1_web.png');

            // Scroll down to activate Mobile App
            await evalExpr(`window.scrollBy(0, 180)`);
            await sleep(700);
            await captureScreenshot('scroll_sync_step2_apps.png');

            // Scroll further down to activate AI or Brand
            await evalExpr(`window.scrollBy(0, 360)`);
            await sleep(700);
            await captureScreenshot('scroll_sync_step3_ai.png');

            // Scroll towards bottom of services to verify last cards (Ads)
            await evalExpr(`window.scrollBy(0, 500)`);
            await sleep(700);
            await captureScreenshot('scroll_sync_step4_bottom.png');

            // Now test clicking a specific card (e.g. card 7: Brand Identity)
            await evalExpr(`(() => {
              const cards = document.querySelectorAll('.svc-card');
              if (cards[7]) cards[7].click();
            })()`);
            await sleep(800);
            await captureScreenshot('scroll_sync_click_brand.png');

            console.log('All scroll sync tests completed successfully!');
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

