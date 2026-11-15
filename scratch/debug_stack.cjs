const { exec } = require('child_process');
const http = require('http');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const proc = exec(`${edge} --headless --remote-debugging-port=9229 --disable-gpu --window-size=1440,900 http://localhost:5173/`);

setTimeout(() => {
  http.get('http://127.0.0.1:9229/json', (res) => {
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

          for (let p of [7150, 7200, 7250, 7300, 7400, 7500]) {
            await evalCmd(`window.scrollTo({ top: ${p}, behavior: 'instant' });`);
            await new Promise(r => setTimeout(r, 50));
            const data = await evalCmd(`
              (() => {
                const card4 = document.querySelectorAll('.work__card-wrapper')[3];
                const outro = document.querySelectorAll('.work__card-wrapper')[4];
                return {
                  scroll: window.scrollY,
                  card4: { top: Math.round(card4.getBoundingClientRect().top), bottom: Math.round(card4.getBoundingClientRect().bottom) },
                  outro: { top: Math.round(outro.getBoundingClientRect().top), bottom: Math.round(outro.getBoundingClientRect().bottom) },
                };
              })()
            `);
            console.log(`\n=== SCROLL ${p} ===`, JSON.stringify(data, null, 2));
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
