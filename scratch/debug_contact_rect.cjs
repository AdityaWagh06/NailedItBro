const { exec } = require('child_process');
const http = require('http');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const port = 9350;
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
  await sleep(1000);

  const rects = await sendCommand('Runtime.evaluate', {
    expression: `(() => {
      const contact = document.querySelector('#contact');
      const process = document.querySelector('#process');
      const footer = document.querySelector('.footer');
      return {
        contactOffsetTop: contact.offsetTop,
        contactClientTop: contact.clientTop,
        contactRectTop: contact.getBoundingClientRect().top,
        processOffsetTop: process.offsetTop,
        processHeight: process.offsetHeight,
        docScrollH: document.documentElement.scrollHeight,
        innerH: window.innerHeight,
        maxScroll: document.documentElement.scrollHeight - window.innerHeight
      };
    })()`,
    returnByValue: true,
  });

  console.log('MEASUREMENTS:', JSON.stringify(rects.value, null, 2));

  // Now scroll to contact.offsetTop using window.__lenis
  await sendCommand('Runtime.evaluate', {
    expression: `
      window.__lenis ? window.__lenis.scrollTo('#contact', { immediate: true }) : window.scrollTo(0, document.querySelector('#contact').offsetTop);
    `,
  });
  await sleep(500);

  const afterScroll = await sendCommand('Runtime.evaluate', {
    expression: `(() => {
      const contact = document.querySelector('#contact');
      return {
        scrollY: window.scrollY,
        contactRectTop: contact.getBoundingClientRect().top
      };
    })()`,
    returnByValue: true,
  });

  console.log('AFTER SCROLL:', JSON.stringify(afterScroll.value, null, 2));

  ws.close();
  proc.kill();
})();

