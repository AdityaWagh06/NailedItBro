const { exec } = require('child_process');
const http = require('http');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const proc = exec(`${edge} --headless --remote-debugging-port=9247 --disable-gpu --window-size=1440,900 http://localhost:5173/`);

setTimeout(() => {
  http.get('http://127.0.0.1:9247/json', (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', async () => {
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
                const els = Array.from(document.querySelectorAll('*')).filter(el => 
                  el.children.length === 0 && el.textContent.includes('contact@naileditbro.com')
                );
                return JSON.stringify(els.map(el => {
                  const r = el.getBoundingClientRect();
                  return {
                    tag: el.tagName,
                    class: el.className,
                    parentClass: el.parentElement ? el.parentElement.className : '',
                    rect: { top: r.top, left: r.left, width: r.width, height: r.height }
                  };
                }));
              })()`,
              returnByValue: true
            }
          }));
        }, 3000);
      };

      ws.onmessage = (msg) => {
        const r = JSON.parse(msg.data);
        console.log('EMAILS FOUND:', r.result?.result?.value);
        ws.close();
        proc.kill();
        process.exit(0);
      };
    });
  });
}, 2500);

