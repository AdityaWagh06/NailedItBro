const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const port = 9399;
const proc = exec(`${edge} --headless --remote-debugging-port=${port} --disable-gpu --window-size=390,844 http://localhost:5173/`);

const artifactDir = 'C:\\Users\\avdp1\\.gemini\\antigravity\\brain\\c7df19d8-966e-4cbc-91d1-26d55021bd65';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getTargetTab() {
  for (let i = 0; i < 20; i++) {
    await sleep(400);
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
    const send = (method, params = {}) =>
      new Promise((resolve) => {
        const id = msgId++;
        const handler = (event) => {
          const resp = JSON.parse(event.data);
          if (resp.id === id) {
            ws.removeEventListener('message', handler);
            resolve(resp.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });

    await new Promise((resolve) => ws.addEventListener('open', resolve));

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });

    await sleep(1500);

    // 1. Mobile Hero
    const snapHero = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}/mobile_audit_01_hero.png`, Buffer.from(snapHero.data, 'base64'));
    console.log('Saved mobile_audit_01_hero.png');

    // 2. Mobile Services
    await send('Runtime.evaluate', {
      expression: `document.querySelector('#services')?.scrollIntoView({ behavior: 'instant' });`
    });
    await sleep(600);
    const snapServices = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}/mobile_audit_02_services.png`, Buffer.from(snapServices.data, 'base64'));
    console.log('Saved mobile_audit_02_services.png');

    // 3. Mobile Work
    await send('Runtime.evaluate', {
      expression: `document.querySelector('#work')?.scrollIntoView({ behavior: 'instant' });`
    });
    await sleep(600);
    const snapWork = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}/mobile_audit_03_work.png`, Buffer.from(snapWork.data, 'base64'));
    console.log('Saved mobile_audit_03_work.png');

    // 4. Mobile Contact
    await send('Runtime.evaluate', {
      expression: `document.querySelector('#contact')?.scrollIntoView({ behavior: 'instant' });`
    });
    await sleep(600);
    const snapContact = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}/mobile_audit_04_contact.png`, Buffer.from(snapContact.data, 'base64'));
    console.log('Saved mobile_audit_04_contact.png');

    // Check horizontal overflow
    const overflowCheck = await send('Runtime.evaluate', {
      expression: `
        ({
          bodyScrollWidth: document.body.scrollWidth,
          windowInnerWidth: window.innerWidth,
          hasOverflow: document.body.scrollWidth > window.innerWidth,
          overflowElements: Array.from(document.querySelectorAll('*'))
            .filter(el => el.getBoundingClientRect().right > window.innerWidth + 1)
            .map(el => ({ tag: el.tagName, class: el.className, right: el.getBoundingClientRect().right }))
            .slice(0, 10)
        })
      `,
      returnByValue: true
    });
    console.log('Mobile overflow check:', JSON.stringify(overflowCheck.result?.value, null, 2));

    ws.close();
    proc.kill();
    process.exit(0);
  } catch (err) {
    console.error(err);
    try { proc.kill(); } catch (e) {}
    process.exit(1);
  }
})();

