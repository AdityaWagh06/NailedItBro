const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const proc = exec(`${edge} --headless --remote-debugging-port=9241 --disable-gpu --window-size=1440,900 http://localhost:5173/`);

setTimeout(() => {
  http.get('http://127.0.0.1:9241/json', (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', async () => {
      try {
        const tabs = JSON.parse(data);
        const targetTab = tabs.find(t => t.url.includes('localhost:5173'));
        const ws = new WebSocket(targetTab.webSocketDebuggerUrl);

        ws.onopen = async () => {
          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 1,
              method: 'Runtime.evaluate',
              params: {
                expression: `(() => {
                  window.scrollTo(0, 999999);
                  const el = document.querySelector('.footer__mark');
                  if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
                })()`
              }
            }));

            // Frame 1 after scroll
            setTimeout(() => {
              ws.send(JSON.stringify({
                id: 2,
                method: 'Page.captureScreenshot',
                params: { format: 'png' }
              }));
            }, 1000);

            // Frame 2 1.5 seconds later to check motion
            setTimeout(() => {
              ws.send(JSON.stringify({
                id: 3,
                method: 'Page.captureScreenshot',
                params: { format: 'png' }
              }));
            }, 2500);
          }, 2000);
        };

        ws.onmessage = (msg) => {
          const r = JSON.parse(msg.data);
          if (r.id === 2) {
            fs.writeFileSync('C:\\Users\\avdp1\\.gemini\\antigravity\\brain\\c7df19d8-966e-4cbc-91d1-26d55021bd65\\frame1.png', Buffer.from(r.result.data, 'base64'));
            console.log('Frame 1 captured');
          }
          if (r.id === 3) {
            fs.writeFileSync('C:\\Users\\avdp1\\.gemini\\antigravity\\brain\\c7df19d8-966e-4cbc-91d1-26d55021bd65\\frame2.png', Buffer.from(r.result.data, 'base64'));
            console.log('Frame 2 captured');
            ws.close();
            proc.kill();
            process.exit(0);
          }
        };
      } catch (e) {
        console.error(e);
      }
    });
  });
}, 2500);
