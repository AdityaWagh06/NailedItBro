const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const port = 9320;
const proc = exec(`${edge} --headless --remote-debugging-port=${port} --disable-gpu --window-size=390,844 http://localhost:5173/`);

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
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });

    await sleep(2000);

    // Open mobile nav and click About Us
    await sendCommand('Runtime.evaluate', {
      expression: `
        const burger = document.querySelector('.nav__burger');
        if (burger) burger.click();
      `,
    });
    await sleep(400);

    // Click "About Us" link
    await sendCommand('Runtime.evaluate', {
      expression: `
        const links = Array.from(document.querySelectorAll('a, button'));
        const aboutLink = links.find(el => el.textContent.includes('About'));
        if (aboutLink) aboutLink.click();
      `,
    });

    // Wait during transition (150ms) to see the transition bar and page glide
    await sleep(150);
    const snapTransition = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}\\page_transition_in_flight.png`, Buffer.from(snapTransition.data, 'base64'));
    console.log('Saved page_transition_in_flight.png');

    // Wait for About page to fully settle (700ms)
    await sleep(800);
    const snapAboutSettle = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}\\page_about_settled.png`, Buffer.from(snapAboutSettle.data, 'base64'));
    console.log('Saved page_about_settled.png');

    ws.close();
    proc.kill();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    proc.kill();
    process.exit(1);
  }
})();

