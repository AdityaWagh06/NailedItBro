const http = require('http');

http.get('http://127.0.0.1:9238/json', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const tabs = JSON.parse(data);
    const target = tabs.find(t => t.url.includes('localhost:5173'));
    if (!target) { console.log('tab not found'); return; }
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          expression: `JSON.stringify({
            footer: document.querySelector('.footer')?.getBoundingClientRect(),
            mark: document.querySelector('.footer__mark')?.getBoundingClientRect(),
            wave: document.querySelector('.footer__wave')?.getBoundingClientRect()
          })`,
          returnByValue: true
        }
      }));
    };
    ws.onmessage = (msg) => {
      const r = JSON.parse(msg.data);
      console.log('Result:', JSON.parse(r.result?.value || '{}'));
      ws.close();
      process.exit(0);
    };
  });
});

