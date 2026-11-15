const { exec } = require('child_process');
const http = require('http');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const proc = exec(`${edge} --headless --remote-debugging-port=9232 --disable-gpu --window-size=1440,900 http://localhost:5173/`);

setTimeout(() => {
  http.get('http://127.0.0.1:9232/json', (res) => {
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

          // Test scroll positions:
          // 4500: Card 1 stuck, Card 2 coming
          // 5300: Cards 1,2 stuck, Card 3 coming
          // 6100: Cards 1,2,3 stuck, Card 4 coming
          // 6800: Cards 1,2,3,4 stuck, Outro coming
          // 7100: ALL 5 CARDS STUCK CUT-TO-CUT!
          // 7300: ALL 5 CARDS STILL STUCK!
          // 7500: ALL 5 CARDS MOVING TOGETHER OFF SCREEN!
          for (let p of [4500, 5300, 6100, 6800, 7100, 7300, 7500]) {
            await evalCmd(`window.scrollTo({ top: ${p}, behavior: "instant" });`);
            await new Promise(r => setTimeout(r, 60));
            const data = await evalCmd(`
              (() => {
                const cards = document.querySelectorAll('.work__card-wrapper');
                return Array.from(cards).map((c, i) => {
                  const r = c.getBoundingClientRect();
                  return {
                    card: i === 4 ? 'OUTRO' : 'CARD_' + (i + 1),
                    top: Math.round(r.top),
                    bottom: Math.round(r.bottom),
                  };
                });
              })()
            `);
            console.log(`\n=== SCROLL ${p} ===`);
            console.table(data);
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
