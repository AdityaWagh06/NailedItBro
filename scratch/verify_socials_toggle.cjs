const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const proc = exec(`${edge} --headless --remote-debugging-port=9255 --disable-gpu --window-size=1440,900 http://localhost:5173/`);

setTimeout(() => {
  http.get('http://127.0.0.1:9255/json', (res) => {
    let data = ''; res.on('data', c => data += c);
    res.on('end', () => {
      const tabs = JSON.parse(data);
      const targetTab = tabs.find(t => t.url.includes('localhost:5173'));
      const ws = new WebSocket(targetTab.webSocketDebuggerUrl);
      ws.onopen = () => {
        setTimeout(() => {
          // 1. Capture in services section (socials must be visible)
          ws.send(JSON.stringify({
            id: 1,
            method: 'Runtime.evaluate',
            params: {
              expression: `(() => {
                const el = document.querySelector('#services');
                if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
              })()`
            }
          }));

          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 2,
              method: 'Page.captureScreenshot',
              params: { format: 'png' }
            }));
          }, 800);

          // 2. Scroll to footer (socials must disappear!)
          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 3,
              method: 'Runtime.evaluate',
              params: {
                expression: `(() => {
                  const footer = document.querySelector('.footer');
                  if (footer) footer.scrollIntoView({ behavior: 'instant', block: 'start' });
                  // Trigger scroll event check
                  window.dispatchEvent(new Event('scroll'));
                })()`
              }
            }));

            setTimeout(() => {
              ws.send(JSON.stringify({
                id: 4,
                method: 'Page.captureScreenshot',
                params: { format: 'png' }
              }));
            }, 800);
          }, 2000);
        }, 3500);
      };

      ws.onmessage = (msg) => {
        const r = JSON.parse(msg.data);
        if (r.id === 2) {
          fs.writeFileSync('C:\\Users\\avdp1\\.gemini\\antigravity\\brain\\c7df19d8-966e-4cbc-91d1-26d55021bd65\\socials_visible.png', Buffer.from(r.result.data, 'base64'));
          console.log('socials_visible.png saved');
        }
        if (r.id === 4) {
          fs.writeFileSync('C:\\Users\\avdp1\\.gemini\\antigravity\\brain\\c7df19d8-966e-4cbc-91d1-26d55021bd65\\socials_hidden_in_footer.png', Buffer.from(r.result.data, 'base64'));
          console.log('socials_hidden_in_footer.png saved');
          ws.close();
          proc.kill();
          process.exit(0);
        }
      };
    });
  });
}, 2500);

