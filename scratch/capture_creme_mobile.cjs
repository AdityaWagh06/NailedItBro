const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

const edge = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const proc = exec(`${edge} --headless --remote-debugging-port=9290 --disable-gpu --window-size=390,844 https://cremeandwhisk.vercel.app/`);

const artifactDir = 'C:\\Users\\avdp1\\.gemini\\antigravity\\brain\\c7df19d8-966e-4cbc-91d1-26d55021bd65';

setTimeout(() => {
  http.get('http://127.0.0.1:9290/json', (res) => {
    let data = ''; res.on('data', c => data += c);
    res.on('end', async () => {
      try {
        const tabs = JSON.parse(data);
        const targetTab = tabs.find(t => t.url.includes('cremeandwhisk'));
        if (!targetTab) {
          proc.kill();
          process.exit(1);
        }
        const ws = new WebSocket(targetTab.webSocketDebuggerUrl);

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

        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        ws.onopen = async () => {
          try {
            await sleep(3000);
            const res = await sendCommand('Page.captureScreenshot', { format: 'png' });
            fs.writeFileSync('public/creme_and_whisk_mobile.png', Buffer.from(res.data, 'base64'));
            fs.writeFileSync(`${artifactDir}\\creme_and_whisk_mobile.png`, Buffer.from(res.data, 'base64'));
            console.log('Mobile screenshot saved to public/creme_and_whisk_mobile.png');
          } catch (e) {
            console.error(e);
          } finally {
            ws.close();
            proc.kill();
            process.exit(0);
          }
        };
      } catch (err) {
        proc.kill();
        process.exit(1);
      }
    });
  });
}, 3000);

