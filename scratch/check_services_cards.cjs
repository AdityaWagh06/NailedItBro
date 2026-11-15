const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const proc = exec(`${edge} --headless --remote-debugging-port=9292 --disable-gpu --window-size=1440,900 http://localhost:5173/#services`);

const artifactDir = 'C:\\Users\\avdp1\\.gemini\\antigravity\\brain\\c7df19d8-966e-4cbc-91d1-26d55021bd65';

setTimeout(() => {
  http.get('http://127.0.0.1:9292/json', (res) => {
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
        }, 1000);
      };

      ws.onopen = () => {
        setTimeout(() => {
          // 1. Top of services
          capture('services_cards_top.png', `(() => {
            const s = document.querySelector('#services');
            if (s) s.scrollIntoView({ behavior: 'instant', block: 'start' });
          })()`, () => {
            // 2. Middle of services
            capture('services_cards_mid.png', `(() => {
              const cards = document.querySelectorAll('.svc-card');
              if (cards[2]) cards[2].scrollIntoView({ behavior: 'instant', block: 'start' });
            })()`, () => {
              // 3. Lower services
              capture('services_cards_lower.png', `(() => {
                const cards = document.querySelectorAll('.svc-card');
                if (cards[6]) cards[6].scrollIntoView({ behavior: 'instant', block: 'start' });
              })()`, () => {
                ws.close();
                proc.kill();
                process.exit(0);
              });
            });
          });
        }, 2200);
      };
    });
  });
}, 2500);

