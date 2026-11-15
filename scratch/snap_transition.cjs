const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const proc = exec(`${edge} --headless --remote-debugging-port=9234 --disable-gpu --window-size=1440,900 http://localhost:5173/`);

setTimeout(() => {
  http.get('http://127.0.0.1:9234/json', (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', async () => {
      try {
        const tabs = JSON.parse(data);
        const targetTab = tabs.find(t => t.url.includes('localhost:5173'));
        const ws = new WebSocket(targetTab.webSocketDebuggerUrl);

        ws.onopen = async () => {
          const evalCmd = (expr) => new Promise(resolve => {
            const id = Math.floor(Math.random() * 100000);
            const handler = (msg) => {
              const res = JSON.parse(msg.data);
              if (res.id === id) {
                ws.removeEventListener('message', handler);
                resolve(res.result?.result?.value);
              }
            };
            ws.addEventListener('message', handler);
            ws.send(JSON.stringify({
              id,
              method: 'Runtime.evaluate',
              params: { expression: expr, returnByValue: true }
            }));
          });

          const snap = (name) => new Promise(resolve => {
            const id = Math.floor(Math.random() * 100000);
            const handler = (msg) => {
              const res = JSON.parse(msg.data);
              if (res.id === id) {
                ws.removeEventListener('message', handler);
                const buf = Buffer.from(res.result.data, 'base64');
                fs.writeFileSync(`C:\\Users\\avdp1\\.gemini\\antigravity\\brain\\c7df19d8-966e-4cbc-91d1-26d55021bd65\\${name}.png`, buf);
                resolve();
              }
            };
            ws.addEventListener('message', handler);
            ws.send(JSON.stringify({
              id,
              method: 'Page.captureScreenshot',
              params: { format: 'png' }
            }));
          });

          // Scroll positions around 7400, 7600, 7800
          for (let p of [7400, 7600, 7800]) {
            await evalCmd(`window.scrollTo({ top: ${p}, behavior: "instant" });`);
            await new Promise(r => setTimeout(r, 60));
            await snap(`scroll_${p}`);
          }

          ws.close();
          proc.kill();
          process.exit(0);
        };
      } catch (e) {
        console.error(e);
        proc.kill();
        process.exit(1);
      }
    });
  });
}, 2500);

