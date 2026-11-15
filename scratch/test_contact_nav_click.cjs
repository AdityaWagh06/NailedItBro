const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const port = 9335;
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

    // Click "Contact Us ↗" in the desktop nav
    await sendCommand('Runtime.evaluate', {
      expression: `
        const contactBtn = document.querySelector('.nav__quote-pill');
        if (contactBtn) contactBtn.click();
      `,
    });
    await sleep(1500);

    const snapContactFit = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}\\desktop_contact_perfect_fit.png`, Buffer.from(snapContactFit.data, 'base64'));
    console.log('Saved desktop_contact_perfect_fit.png');

    // Also take a screenshot of Orbit Money card in Work stack
    await sendCommand('Runtime.evaluate', {
      expression: `
        window.__lenis?.scrollTo('#work', { immediate: true });
        window.scrollBy({ top: 800, behavior: 'instant' });
      `,
    });
    await sleep(800);

    const snapWorkCards = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}\\desktop_work_cards_stacked_consistent.png`, Buffer.from(snapWorkCards.data, 'base64'));
    console.log('Saved desktop_work_cards_stacked_consistent.png');

    ws.close();
    proc.kill();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    proc.kill();
    process.exit(1);
  }
})();

