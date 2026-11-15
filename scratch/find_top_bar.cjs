const { exec } = require('child_process');
const http = require('http');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const proc = exec(`${edge} --headless --remote-debugging-port=9252 --disable-gpu --window-size=1440,900 http://localhost:5173/`);

setTimeout(() => {
  http.get('http://127.0.0.1:9252/json', (res) => {
    let data = ''; res.on('data', c => data += c);
    res.on('end', () => {
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
                const el = document.elementFromPoint(120, 20);
                return JSON.stringify({
                  tag: el ? el.tagName : null,
                  className: el ? el.className : null,
                  id: el ? el.id : null,
                  text: el ? el.innerText : null,
                  outerHTML: el ? el.outerHTML.slice(0, 400) : null,
                  parent: el && el.parentElement ? {
                    tag: el.parentElement.tagName,
                    className: el.parentElement.className,
                    id: el.parentElement.id,
                    rect: el.parentElement.getBoundingClientRect()
                  } : null
                });
              })()`,
              returnByValue: true
            }
          }));
        }, 3500);
      };
      ws.onmessage = (msg) => {
        const r = JSON.parse(msg.data);
        console.log('TOP ELEMENT FOUND:', r.result?.result?.value);
        ws.close(); proc.kill(); process.exit(0);
      };
    });
  });
}, 2500);

