const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const proc = exec(`${edge} --headless --remote-debugging-port=9288 --disable-gpu --window-size=1440,900 http://localhost:5173/#cookies`);

const artifactDir = 'C:\\Users\\avdp1\\.gemini\\antigravity\\brain\\c7df19d8-966e-4cbc-91d1-26d55021bd65';

setTimeout(() => {
  http.get('http://127.0.0.1:9288/json', (res) => {
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

      const capture = (filename, scrollExpr, callback) => {
        ws.send(JSON.stringify({
          id: 1,
          method: 'Runtime.evaluate',
          params: { expression: scrollExpr }
        }));
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 2,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
          const onMsg = (msg) => {
            const r = JSON.parse(msg.data);
            if (r.id === 2) {
              const outPath = `${artifactDir}\\${filename}`;
              fs.writeFileSync(outPath, Buffer.from(r.result.data, 'base64'));
              console.log('Saved to ' + outPath);
              ws.removeEventListener('message', onMsg);
              callback();
            }
          };
          ws.addEventListener('message', onMsg);
        }, 800);
      };

      ws.onopen = () => {
        setTimeout(() => {
          // 1. Top Hero
          capture('cookie_page_hero.png', `window.scrollTo({ top: 0, behavior: 'instant' })`, () => {
            // 2. Sections
            capture('cookie_page_body.png', `(() => {
              const el = document.querySelectorAll('.policy-heading')[0];
              if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
            })()`, () => {
              // 3. Contact
              capture('cookie_page_contact.png', `(() => {
                const el = document.querySelector('.policy-item--contact');
                if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
              })()`, () => {
                ws.close();
                proc.kill();
                process.exit(0);
              });
            });
          });
        }, 1800);
      };
    });
  });
}, 2500);

