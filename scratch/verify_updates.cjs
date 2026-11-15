const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const proc = exec(`${edge} --headless --remote-debugging-port=9291 --disable-gpu --window-size=1440,900 http://localhost:5173/`);

const artifactDir = 'C:\\Users\\avdp1\\.gemini\\antigravity\\brain\\c7df19d8-966e-4cbc-91d1-26d55021bd65';

setTimeout(() => {
  http.get('http://127.0.0.1:9291/json', (res) => {
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

            // 1. Scroll to Services and inspect first card (Website Development)
            await evalExpr(`(() => {
              const el = document.querySelector('#services');
              if (el) {
                const y = el.getBoundingClientRect().top + window.pageYOffset - 30;
                window.scrollTo(0, y);
              }
            })()`);
            await sleep(800);
            await captureScreenshot('verify_services_web_first.png');

            // 2. Click AI Automation & Smart QR card
            await evalExpr(`(() => {
              const cards = Array.from(document.querySelectorAll('.svc-card'));
              const aiQrCard = cards.find(c => c.textContent.includes('AI Automation & Smart QR'));
              if (aiQrCard) aiQrCard.click();
            })()`);
            await sleep(800);
            await captureScreenshot('verify_services_ai_qr_card.png');

            // 3. Scroll to Work section to inspect Crème & Whisk card, font, and beige button
            await evalExpr(`(() => {
              const el = document.querySelector('#work');
              if (el) {
                const y = el.getBoundingClientRect().top + window.pageYOffset + 120;
                window.scrollTo(0, y);
              }
            })()`);
            await sleep(1000);
            await captureScreenshot('verify_work_creme_beige_btn.png');

            // 4. Hover over the beige button to capture the hover state and sheen sweep
            await evalExpr(`(() => {
              const btn = document.querySelector('.work__btn-live');
              if (btn) {
                btn.classList.add('is-hovered');
                btn.style.background = 'linear-gradient(135deg, #FFFFFF 0%, #F5EFE4 100%)';
                btn.style.boxShadow = '0 14px 32px -4px rgba(245, 240, 230, 0.42), 0 0 0 1px rgba(245, 240, 230, 0.65)';
                btn.style.transform = 'translateY(-3px) scale(1.02)';
              }
            })()`);
            await sleep(500);
            await captureScreenshot('verify_work_beige_btn_hover.png');

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

