const https = require('https');

function fetch(url) {
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    console.log(url, res.statusCode, res.headers.location);
    if (res.headers.location) {
      fetch(res.headers.location);
      return;
    }
    let data = '';
    res.on('data', d => data += d);
    res.on('end', () => {
      const urls = data.match(/https?:\/\/[^\s"'<>]+/g) || [];
      const relevant = urls.filter(u => u.includes('framer') || u.includes('grabui') || u.includes('marketo'));
      console.log('Found:', [...new Set(relevant)].slice(0, 20));
    });
  });
}

fetch('https://www.framer.com/marketplace/template/marketo/');
