const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const port = 9330;
const proc = exec(`${edge} --headless --remote-debugging-port=${port} --disable-gpu --window-size=1920,1080 http://localhost:5173/`);

const artifactDir = 'C:\\Users\\avdp1\\.gemini\\antigravity\\brain\\c7df19d8-966e-4cbc-91d1-26d55021bd65';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getTargetTab() {
  for (let i = 0; i < 15; i++) {
    await sleep(500);
    try {
      const data = await new Promise((resolve, reject) => {
        const req = http.get(`http://127.0.0.1:${port}/json`, (res) => {
          let str = '';
          res.on('data', (c) => (str += c));
          res.on('end', () => resolve(str));
        });
        req.on('error', reject);
      });
      const tabs = JSON.parse(data);
      const target = tabs.find((t) => t.url.includes('localhost:5173'));
      if (target) return target;
    } catch (e) {}
  }
  throw new Error('Target tab not found after 15 attempts');
}

(async () => {
  try {
    const tab = await getTargetTab();
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
    await sendCommand('Page.enable');
    await sendCommand('DOM.enable');

    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await sleep(2000);

    const pos = await sendCommand('Runtime.evaluate', {
      expression: `
        const contact = document.querySelector('#contact');
        const rect = contact.getBoundingClientRect();
        const docTop = rect.top + window.scrollY;
        ({ top: rect.top, docTop, height: rect.height, windowH: window.innerHeight })
      `,
      returnByValue: true,
    });
    console.log('Contact pos:', pos.value);

    // Scroll exactly to contact top
    await sendCommand('Runtime.evaluate', {
      expression: `
        const contact = document.querySelector('#contact');
        window.scrollTo({ top: contact.offsetTop, behavior: 'instant' });
      `,
    });
    await sleep(500);

    const snapExact = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}\\desktop_contact_exact_top.png`, Buffer.from(snapExact.data, 'base64'));
    console.log('Saved desktop_contact_exact_top.png');

    ws.close();
    proc.kill();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    proc.kill();
    process.exit(1);
  }
})();

