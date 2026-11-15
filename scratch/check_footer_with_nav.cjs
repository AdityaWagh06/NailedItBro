const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const proc = exec(`${edge} --headless --remote-debugging-port=9274 --disable-gpu --window-size=1440,900 http://localhost:5173/`);

const artifactPath = 'C:\\Users\\avdp1\\.gemini\\antigravity\\brain\\c7df19d8-966e-4cbc-91d1-26d55021bd65\\footer_with_nav_visible.png';

setTimeout(() => {
  http.get('http://127.0.0.1:9274/json', (res) => {
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
      ws.onopen = () => {
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 1,
            method: 'Runtime.evaluate',
            params: {
              expression: `(() => {
                const footer = document.querySelector('.footer');
                if (footer) footer.scrollIntoView({ behavior: 'instant', block: 'end' });
                const nav = document.querySelector('.nav');
                if (nav) {
                  nav.classList.remove('is-hidden');
                  nav.style.transform = 'none';
                  nav.style.opacity = '1';
                }
              })()`
            }
          }));

          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 2,
              method: 'Page.captureScreenshot',
              params: { format: 'png' }
            }));
          }, 1200);
        }, 1500);
      };

      ws.onmessage = (msg) => {
        const r = JSON.parse(msg.data);
        if (r.id === 2) {
          fs.writeFileSync(artifactPath, Buffer.from(r.result.data, 'base64'));
          console.log('Saved to ' + artifactPath);
          ws.close();
          proc.kill();
          process.exit(0);
        }
      };
    });
  });
}, 2500);

