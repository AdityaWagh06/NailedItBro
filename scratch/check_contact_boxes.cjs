const { exec } = require('child_process');
const http = require('http');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const proc = exec(`${edge} --headless --remote-debugging-port=9249 --disable-gpu --window-size=1440,900 http://localhost:5173/`);

setTimeout(() => {
  http.get('http://127.0.0.1:9249/json', (res) => {
    let data = ''; res.on('data', c => data += c);
    res.on('end', () => {
      const tabs = JSON.parse(data);
      const target = tabs.find(t => t.url.includes('localhost:5173'));
      const ws = new WebSocket(target.webSocketDebuggerUrl);
      ws.onopen = () => {
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 1,
            method: 'Runtime.evaluate',
            params: {
              expression: `(() => {
                const footer = document.querySelector('.footer');
                if (footer) footer.scrollIntoView({ behavior: 'instant', block: 'start' });
                return JSON.stringify({
                  contact: document.querySelector('.contact').getBoundingClientRect(),
                  footer: document.querySelector('.footer').getBoundingClientRect(),
                  email: document.querySelector('.contact__email').getBoundingClientRect()
                });
              })()`,
              returnByValue: true
            }
          }));
        }, 3000);
      };
      ws.onmessage = (msg) => {
        console.log('BOXES:', JSON.parse(msg.data).result?.result?.value);
        ws.close(); proc.kill(); process.exit(0);
      };
    });
  });
}, 2500);

