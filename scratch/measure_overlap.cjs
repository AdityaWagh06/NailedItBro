const { exec } = require('child_process');
const http = require('http');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const proc = exec(`${edge} --headless --remote-debugging-port=9235 --disable-gpu --window-size=1440,900 http://localhost:5173/`);

setTimeout(() => {
  http.get('http://127.0.0.1:9235/json', (res) => {
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

          await evalCmd(`window.scrollTo({ top: 7600, behavior: "instant" });`);
          const data = await evalCmd(`
            (() => {
              const getR = el => {
                const r = el.getBoundingClientRect();
                return { top: Math.round(r.top), bottom: Math.round(r.bottom), height: Math.round(r.height) };
              };
              return {
                outro: getR(document.querySelector('.work__card-wrapper--outro')),
                spacer: getR(document.querySelector('.work__stack-spacer')),
                work: getR(document.querySelector('.work')),
                process: getR(document.querySelector('.process')),
              };
            })()
          `);
          console.log(JSON.stringify(data, null, 2));

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
