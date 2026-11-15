const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const proc = exec(`${edge} --headless --remote-debugging-port=9268 --disable-gpu --window-size=1440,1100 http://localhost:5173/#privacy`);

setTimeout(() => {
  http.get('http://127.0.0.1:9268/json', (res) => {
    let data = ''; res.on('data', c => data += c);
    res.on('end', () => {
      const tabs = JSON.parse(data);
      const targetTab = tabs.find(t => t.url.includes('localhost:5173'));
      const ws = new WebSocket(targetTab.webSocketDebuggerUrl);
      ws.onopen = () => {
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 1,
            method: 'Runtime.evaluate',
            params: {
              expression: `(() => {
                const heading = document.querySelector('.policy-section__heading');
                if (heading) heading.scrollIntoView();
              })()`
            }
          }));

          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 2,
              method: 'Page.captureScreenshot',
              params: { format: 'png' }
            }));
          }, 1000);
        }, 2000);
      };
      ws.onmessage = (msg) => {
        const r = JSON.parse(msg.data);
        if (r.id === 2) {
          const outPath = 'C:\\Users\\avdp1\\.gemini\\antigravity\\brain\\c7df19d8-966e-4cbc-91d1-26d55021bd65\\privacy_page_updated_font.png';
          fs.writeFileSync(outPath, Buffer.from(r.result.data, 'base64'));
          console.log('Saved to ' + outPath);
          ws.close();
          proc.kill();
          process.exit(0);
        }
      };
    });
  });
}, 2500);
