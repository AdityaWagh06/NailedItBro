const { exec } = require('child_process');
const http = require('http');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const port = 9340;
const proc = exec(`${edge} --headless --remote-debugging-port=${port} --disable-gpu --window-size=1920,1080 http://localhost:5173/`);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  await sleep(1500);
  const data = await new Promise((resolve) => {
    http.get(`http://127.0.0.1:${port}/json`, (res) => {
      let str = '';
      res.on('data', (c) => (str += c));
      res.on('end', () => resolve(str));
    });
  });
  const tab = JSON.parse(data).find((t) => t.url.includes('5173'));
  const ws = new WebSocket(tab.webSocketDebuggerUrl);

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

  await new Promise((r) => (ws.onopen = r));
  await sleep(1500);

  // Click contact
  await sendCommand('Runtime.evaluate', {
    expression: `
      const contactBtn = document.querySelector('.nav__quote-pill');
      if (contactBtn) contactBtn.click();
    `,
  });
  await sleep(1600);

  const res = await sendCommand('Runtime.evaluate', {
    expression: `(() => {
      const c = document.querySelector('#contact');
      const f = document.querySelector('.footer');
      return {
        contactTop: c.offsetTop,
        contactH: c.offsetHeight,
        contactRectTop: c.getBoundingClientRect().top,
        contactRectBottom: c.getBoundingClientRect().bottom,
        footerTop: f?.offsetTop,
        footerH: f?.offsetHeight,
        maxScroll: document.documentElement.scrollHeight - window.innerHeight,
        scrollY: window.scrollY,
        innerH: window.innerHeight
      };
    })()`,
    returnByValue: true,
  });

  console.log('Result:', res.value);
  ws.close();
  proc.kill();
})();
