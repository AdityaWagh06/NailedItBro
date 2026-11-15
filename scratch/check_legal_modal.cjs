const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const proc = exec(`${edge} --headless --remote-debugging-port=9257 --disable-gpu --window-size=1440,900 http://localhost:5173/`);

setTimeout(() => {
  http.get('http://127.0.0.1:9257/json', (res) => {
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
                const footer = document.querySelector('.footer');
                if (footer) footer.scrollIntoView({ behavior: 'instant', block: 'start' });
                const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Privacy Policy'));
                if (btn) btn.click();
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
        }, 3500);
      };
      ws.onmessage = (msg) => {
        const r = JSON.parse(msg.data);
        if (r.id === 2) {
          const outPath = 'C:\\Users\\avdp1\\.gemini\\antigravity\\brain\\c7df19d8-966e-4cbc-91d1-26d55021bd65\\legal_modal_verify.png';
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

