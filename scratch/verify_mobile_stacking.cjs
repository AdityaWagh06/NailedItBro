const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const port = 9326;
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
  throw new Error('Target tab not found');
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

    // Scroll to #work
    await sendCommand('Runtime.evaluate', {
      expression: `
        const el = document.querySelector('#work');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      `,
    });
    await sleep(800);

    let res = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}/mobile_work_card1_stuck.png`, Buffer.from(res.data, 'base64'));
    console.log('Saved mobile_work_card1_stuck.png');

    // Scroll down 380px so card 2 stacks over card 1
    await sendCommand('Runtime.evaluate', {
      expression: `window.scrollBy({ top: 380, behavior: 'instant' });`,
    });
    await sleep(800);

    res = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}/mobile_work_card2_stacking.png`, Buffer.from(res.data, 'base64'));
    console.log('Saved mobile_work_card2_stacking.png');

    // Scroll down another 380px so card 3 stacks
    await sendCommand('Runtime.evaluate', {
      expression: `window.scrollBy({ top: 380, behavior: 'instant' });`,
    });
    await sleep(800);

    res = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}/mobile_work_card3_stacking.png`, Buffer.from(res.data, 'base64'));
    console.log('Saved mobile_work_card3_stacking.png');

    // Inspect coordinates of all cards
    const inspectRes = await sendCommand('Runtime.evaluate', {
      expression: `
        JSON.stringify(Array.from(document.querySelectorAll('.work__card')).map((c, i) => {
          const r = c.getBoundingClientRect();
          return {
            index: i,
            title: c.querySelector('.work__card-title')?.textContent?.trim(),
            top: Math.round(r.top),
            bottom: Math.round(r.bottom),
            height: Math.round(r.height)
          };
        }))
      `,
      returnByValue: true
    });

    console.log('Card stacking data:', inspectRes.result.value);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    try { proc.kill(); } catch (e) {}
    process.exit(0);
  }
})();
