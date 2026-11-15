const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const proc = exec(`${edge} --headless --remote-debugging-port=9236 --disable-gpu --window-size=1440,900 http://localhost:5173/`);

setTimeout(() => {
  http.get('http://127.0.0.1:9236/json', (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', async () => {
      try {
        const tabs = JSON.parse(data);
        const targetTab = tabs.find(t => t.url.includes('localhost:5173'));
        const ws = new WebSocket(targetTab.webSocketDebuggerUrl);

        ws.onopen = async () => {
          ws.send(JSON.stringify({
            id: 1,
            method: 'Runtime.evaluate',
            params: {
              expression: `
                (() => {
                  const el = document.querySelector('.footer__mark');
                  if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
                })()
              `
            }
          }));

          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 2,
              method: 'Page.captureScreenshot',
              params: { format: 'png' }
            }));
          }, 800);
        };

        ws.onmessage = (msg) => {
          const r = JSON.parse(msg.data);
          if (r.id === 2) {
            const buf = Buffer.from(r.result.data, 'base64');
            const outPath = 'C:\\Users\\avdp1\\.gemini\\antigravity\\brain\\c7df19d8-966e-4cbc-91d1-26d55021bd65\\original_footer_reverted.png';
            fs.writeFileSync(outPath, buf);
            console.log('Saved to ' + outPath);
            ws.close();
            proc.kill();
            process.exit(0);
          }
        };
      } catch (e) {
        console.error(e);
        proc.kill();
        process.exit(1);
      }
    });
  });
}, 2500);

