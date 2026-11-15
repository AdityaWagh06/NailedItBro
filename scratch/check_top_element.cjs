const http = require('http');

http.get('http://127.0.0.1:9246/json', (res) => {
  let data = ''; res.on('data', c => data += c);
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
          expression: `(() => {
            const el = document.elementFromPoint(100, 15);
            return el ? el.outerHTML.slice(0, 300) : "none";
          })()`,
          returnByValue: true
        }
      }));
    };
    ws.onmessage = (msg) => {
      console.log('TOP ELEMENT:', JSON.parse(msg.data).result?.result?.value);
      ws.close();
      process.exit(0);
    };
  });
});

