const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const port = 9331;
const proc = exec(`${edge} --headless --remote-debugging-port=${port} --disable-gpu --window-size=1440,900 http://localhost:5173/#case-study/creme-and-whisk`);

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

    await sleep(2000);

    // 1. Capture top of page (single minimal navbar, spacious hero, metadata table strip)
    let res = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}/luxury_case_study_top.png`, Buffer.from(res.data, 'base64'));
    console.log('Saved luxury_case_study_top.png');

    // 2. Scroll to showcase and editorial
    await sendCommand('Runtime.evaluate', {
      expression: `window.scrollBy({ top: 800, behavior: 'instant' });`,
    });
    await sleep(800);

    res = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}/luxury_case_study_showcase.png`, Buffer.from(res.data, 'base64'));
    console.log('Saved luxury_case_study_showcase.png');

    // 3. Scroll to editorial narrative and Q&A
    await sendCommand('Runtime.evaluate', {
      expression: `
        const faq = document.querySelector('.cs-faq-list');
        if (faq) faq.scrollIntoView({ behavior: 'instant', block: 'center' });
      `,
    });
    await sleep(800);

    res = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}/luxury_case_study_faq.png`, Buffer.from(res.data, 'base64'));
    console.log('Saved luxury_case_study_faq.png');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    try { proc.kill(); } catch (e) {}
    process.exit(0);
  }
})();
