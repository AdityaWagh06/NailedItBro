const https = require('https');

https.get('https://marketo.framer.website/', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    // Search for video or image urls in footer
    const matches = data.match(/(https:\/\/[^"'\s]+\.(mp4|webm|gif|png|jpg|webp|svg))/gi) || [];
    console.log('Media matches:', [...new Set(matches)]);
  });
}).on('error', e => console.error(e));

