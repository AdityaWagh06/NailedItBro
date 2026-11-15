const { exec } = require('child_process');
const http = require('http');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const proc = exec(`${edge} --headless --remote-debugging-port=9294 --disable-gpu http://localhost:5173/#services`);

setTimeout(() => {
  http.get('http://127.0.0.1:9294/json', (res) => {
    let data = ''; res.on('data', c => data += c);
    res.on('end', async () => {
      const tabs = JSON.parse(data);
      const targetTab = tabs.find(t => t.url.includes('localhost:5173'));
      const ws = new WebSocket(targetTab.webSocketDebuggerUrl);

      let msgId = 1;
      const sendCommand = (method, params = {}) => {
        return new Promise((resolve) => {
          const id = msgId++;
          const onMsg = (msg) => {
            const r = JSON.parse(msg.data);
            if (r.id === id) {
              ws.removeEventListener('message', onMsg);
              resolve(r.result);
            }
          };
          ws.addEventListener('message', onMsg);
          ws.send(JSON.stringify({ id, method, params }));
        });
      };

      ws.onopen = async () => {
        const result = await sendCommand('Runtime.evaluate', {
          expression: `(() => {
            const card = document.querySelector('.svc-pill-card');
            const style = window.getComputedStyle(card);
            const title = document.querySelector('.svc-pill-card__title');
            const titleStyle = window.getComputedStyle(title);
            return {
              cardOpacity: style.opacity,
              cardVisibility: style.visibility,
              cardDisplay: style.display,
              titleColor: titleStyle.color,
              titleFontSize: titleStyle.fontSize,
              cardBg: style.backgroundColor
            };
          })()`,
          returnByValue: true
        });
        console.log('Computed styles:', result.result.value);
        ws.close();
        proc.kill();
        process.exit(0);
      };
    });
  });
}, 2500);

