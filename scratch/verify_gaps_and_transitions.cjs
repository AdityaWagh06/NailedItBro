const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const port = 9315;
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

    // 1. Scroll to Services on mobile
    await sendCommand('Runtime.evaluate', {
      expression: 'document.querySelector("#services")?.scrollIntoView({ behavior: "instant" })',
    });
    await sleep(600);

    const snapServices = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}\\mobile_services_tight_gap.png`, Buffer.from(snapServices.data, 'base64'));
    console.log('Saved mobile_services_tight_gap.png');

    // 2. Scroll to Work: between Card 1 (Crème & Whisk) and Card 2
    await sendCommand('Runtime.evaluate', {
      expression: `
        const card1 = document.querySelectorAll('.work__card-wrapper')[0];
        if (card1) {
          const rect = card1.getBoundingClientRect();
          window.scrollBy({ top: rect.bottom - 400, behavior: 'instant' });
        }
      `,
    });
    await sleep(600);

    const snapWorkGap = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}\\mobile_work_tight_gap.png`, Buffer.from(snapWorkGap.data, 'base64'));
    console.log('Saved mobile_work_tight_gap.png');

    // 3. Test page transition: navigate to #about
    await sendCommand('Runtime.evaluate', {
      expression: `window.location.hash = '#about'`,
    });
    await sleep(700);

    const snapAbout = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}\\page_transition_about.png`, Buffer.from(snapAbout.data, 'base64'));
    console.log('Saved page_transition_about.png');

    ws.close();
    proc.kill();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    proc.kill();
    process.exit(1);
  }
})();

