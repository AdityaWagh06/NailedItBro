const { exec } = require('child_process');
const http = require('http');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const proc = exec(`${edge} --headless --remote-debugging-port=9244 --disable-gpu --window-size=1440,900 http://localhost:5173/`);

setTimeout(() => {
  http.get('http://127.0.0.1:9244/json', (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', async () => {
      const tabs = JSON.parse(data);
      const targetTab = tabs.find(t => t.url.includes('localhost:5173'));
      const ws = new WebSocket(targetTab.webSocketDebuggerUrl);

      ws.onopen = () => {
        ws.send(JSON.stringify({
          id: 1,
          method: 'Runtime.evaluate',
          params: {
            expression: `(() => {
              window.scrollTo(0, 999999);
              const footer = document.querySelector('.footer');
              const rect = footer ? footer.getBoundingClientRect() : null;
              return JSON.stringify({
                scrollY: window.scrollY,
                innerHeight: window.innerHeight,
                scrollHeight: document.documentElement.scrollHeight,
                footerRect: rect,
                footerOffsetTop: footer ? footer.offsetTop : null
              });
            })()`,
            returnByValue: true
          }
        }));
      };

      ws.onmessage = (msg) => {
        const r = JSON.parse(msg.data);
        console.log('FULL RESULT:', r);
        ws.close();
        proc.kill();
        process.exit(0);
      };
    });
  });
}, 2500);
