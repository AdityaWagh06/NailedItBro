const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');
const sharp = require('sharp');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const port = 9333;
const proc = exec(`${edge} --headless --remote-debugging-port=${port} --disable-gpu --hide-scrollbars --window-size=1440,900 https://cremeandwhisk.vercel.app/`);

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
      const target = tabs.find((t) => t.url.includes('cremeandwhisk'));
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

    await sleep(4000); // Wait for fonts, cake images and layout to fully render

    // Strictly hide all scrollbars in the document
    await sendCommand('Runtime.evaluate', {
      expression: `(() => {
        const style = document.createElement('style');
        style.textContent = \`
          html, body {
            overflow: hidden !important;
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          ::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
          }
        \`;
        document.head.appendChild(style);
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
      })()`
    });

    await sleep(500);

    // Capture screenshot
    const res = await sendCommand('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');

    // Save PNG
    fs.writeFileSync('public/creme_and_whisk_hero.png', buffer);
    fs.writeFileSync(`${artifactDir}/clean_creme_no_scrollbar.png`, buffer);

    // Convert to webp with high quality
    await sharp(buffer)
      .webp({ quality: 92, effort: 4 })
      .toFile('public/creme_and_whisk_hero.webp');

    console.log('Saved pristine creme_and_whisk_hero without any scrollbar!');

  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    try { proc.kill(); } catch (e) {}
    process.exit(0);
  }
})();

