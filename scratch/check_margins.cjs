const { exec } = require('child_process');
const http = require('http');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const proc = exec(`${edge} --headless --remote-debugging-port=9253 --disable-gpu --window-size=1440,900 http://localhost:5173/`);

setTimeout(() => {
  http.get('http://127.0.0.1:9253/json', (res) => {
    let data = ''; res.on('data', c => data += c);
    res.on('end', () => {
      const tabs = JSON.parse(data);
      const target = tabs.find(t => t.url.includes('localhost:5173'));
      const ws = new WebSocket(target.webSocketDebuggerUrl);
      ws.onopen = () => {
        ws.send(JSON.stringify({
          id: 1,
          method: 'Runtime.evaluate',
          params: {
            expression: `(() => {
              const main = document.querySelector('main');
              const contact = document.querySelector('.contact');
              const footer = document.querySelector('.footer');
              return JSON.stringify({
                mainMarginBottom: window.getComputedStyle(main).marginBottom,
                contactMarginBottom: window.getComputedStyle(contact).marginBottom,
                contactPaddingBottom: window.getComputedStyle(contact).paddingBottom,
                footerMarginTop: window.getComputedStyle(footer).marginTop,
                contactOffsetTop: contact.offsetTop,
                contactOffsetHeight: contact.offsetHeight,
                mainOffsetHeight: main.offsetHeight,
                footerOffsetTop: footer.offsetTop,
                footerOffsetHeight: footer.offsetHeight
              });
            })()`,
            returnByValue: true
          }
        }));
      };
      ws.onmessage = (msg) => {
        console.log('MARGINS:', JSON.parse(msg.data).result?.result?.value);
        ws.close(); proc.kill(); process.exit(0);
      };
    });
  });
}, 2500);

