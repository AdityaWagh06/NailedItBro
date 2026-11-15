const { exec } = require('child_process');
const http = require('http');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const proc = exec(`${edge} --headless --remote-debugging-port=9263 --disable-gpu --window-size=1440,900 http://localhost:5173/`);

setTimeout(() => {
  http.get('http://127.0.0.1:9263/json', (res) => {
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
                const privacyLink = [...document.querySelectorAll('.footer__col-link')].find(el => el.textContent.includes('Privacy Policy'));
                if (privacyLink) privacyLink.click();
                return { clicked: !!privacyLink, hash: window.location.hash };
              })()`,
              returnByValue: true
            }
          }));
        }, 2000);
      };
      ws.onmessage = (msg) => {
        const r = JSON.parse(msg.data);
        if (r.id === 1) {
          console.log('Result of clicking Privacy Policy in footer:', r.result?.result?.value);
          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 2,
              method: 'Runtime.evaluate',
              params: {
                expression: `({
                  hash: window.location.hash,
                  title: document.querySelector('.policy-page__title')?.textContent,
                  isModalOpen: !!document.querySelector('.legal-modal-backdrop')
                })`,
                returnByValue: true
              }
            }));
          }, 300);
        } else if (r.id === 2) {
          console.log('Page state after click:', r.result?.result?.value);
          ws.close();
          proc.kill();
          process.exit(0);
        }
      };
    });
  });
}, 2500);
