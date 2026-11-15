const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const port = 9395;
const proc = exec(`${edge} --headless --remote-debugging-port=${port} --disable-gpu --window-size=1440,900 http://localhost:5173/`);

const artifactDir = 'C:\\Users\\avdp1\\.gemini\\antigravity\\brain\\c7df19d8-966e-4cbc-91d1-26d55021bd65';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getTargetTab() {
  for (let i = 0; i < 20; i++) {
    await sleep(400);
    try {
      const data = await new Promise((res, rej) => {
        http.get(`http://127.0.0.1:${port}/json`, (r) => {
          let s = ''; r.on('data', c => s += c); r.on('end', () => res(s));
        }).on('error', rej);
      });
      const tabs = JSON.parse(data);
      const target = tabs.find(t => t.url.includes('localhost:5173'));
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
    const send = (method, params = {}) => new Promise(res => {
      const id = msgId++;
      const h = (e) => {
        const d = JSON.parse(e.data);
        if (d.id === id) { ws.removeEventListener('message', h); res(d.result); }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id, method, params }));
    });

    await new Promise(r => ws.addEventListener('open', r));
    await send('Page.enable');
    await send('Runtime.enable');

    // TEST 1: MOBILE (390 x 844)
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    await sleep(800);

    // Mobile Hero
    const mobileHero = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}/responsive_mobile_hero.png`, Buffer.from(mobileHero.data, 'base64'));
    console.log('Saved responsive_mobile_hero.png');

    // Mobile Services
    await send('Runtime.evaluate', { expression: `document.querySelector('#services')?.scrollIntoView({ behavior: 'instant' });` });
    await sleep(500);
    const mobileServices = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}/responsive_mobile_services.png`, Buffer.from(mobileServices.data, 'base64'));
    console.log('Saved responsive_mobile_services.png');

    // Mobile Work
    await send('Runtime.evaluate', { expression: `document.querySelector('#work')?.scrollIntoView({ behavior: 'instant' });` });
    await sleep(500);
    const mobileWork = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}/responsive_mobile_work.png`, Buffer.from(mobileWork.data, 'base64'));
    console.log('Saved responsive_mobile_work.png');

    // Mobile Menu
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0); document.querySelector('.nav__burger')?.click();` });
    await sleep(500);
    const mobileMenu = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}/responsive_mobile_menu.png`, Buffer.from(mobileMenu.data, 'base64'));
    console.log('Saved responsive_mobile_menu.png');

    // TEST 2: TABLET (768 x 1024)
    await send('Runtime.evaluate', { expression: `document.querySelector('.menu .nav__burger, .nav.is-open .nav__burger')?.click();` });
    await send('Emulation.setDeviceMetricsOverride', { width: 768, height: 1024, deviceScaleFactor: 2, mobile: true });
    await sleep(700);

    const tabletHero = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}/responsive_tablet_hero.png`, Buffer.from(tabletHero.data, 'base64'));
    console.log('Saved responsive_tablet_hero.png');

    // TEST 3: DESKTOP (1440 x 900)
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await sleep(700);

    const desktopHero = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${artifactDir}/responsive_desktop_hero.png`, Buffer.from(desktopHero.data, 'base64'));
    console.log('Saved responsive_desktop_hero.png');

    ws.close();
    proc.kill();
    console.log('All device responsive screenshots captured successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    try { proc.kill(); } catch (e) {}
    process.exit(1);
  }
})();

