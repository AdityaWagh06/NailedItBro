const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';

const runTest = (width, height, filename, cb) => {
  const proc = exec(`${edge} --headless --remote-debugging-port=9276 --disable-gpu --window-size=${width},${height} http://localhost:5173/`);
  setTimeout(() => {
    http.get('http://127.0.0.1:9276/json', (res) => {
      let data = ''; res.on('data', c => data += c);
      res.on('end', () => {
        const tabs = JSON.parse(data);
        const targetTab = tabs.find(t => t.url.includes('localhost:5173'));
        if (!targetTab) { proc.kill(); return cb(); }
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
              ws.send(JSON.stringify({ id: 2, method: 'Page.captureScreenshot', params: { format: 'png' } }));
            }, 1000);
          }, 1200);
        };
        ws.onmessage = (msg) => {
          const r = JSON.parse(msg.data);
          if (r.id === 2) {
            const outPath = `C:\\Users\\avdp1\\.gemini\\antigravity\\brain\\c7df19d8-966e-4cbc-91d1-26d55021bd65\\${filename}`;
            fs.writeFileSync(outPath, Buffer.from(r.result.data, 'base64'));
            console.log('Saved ' + outPath);
            ws.close();
            proc.kill();
            setTimeout(cb, 1000);
          }
        };
      });
    });
  }, 2200);
};

runTest(1920, 1080, 'footer_1920.png', () => {
  console.log('Done 1920 test');
});

