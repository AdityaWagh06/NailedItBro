const sharp = require('sharp');

(async () => {
  const img = sharp('public/creme_and_whisk_hero.webp');
  const meta = await img.metadata();
  console.log('Image dimensions:', meta.width, meta.height);

  // Extract a 40px wide strip from the right edge
  await img
    .extract({ left: meta.width - 40, top: 0, width: 40, height: 200 })
    .toFile('scratch/right_edge_sample.png');

  // Also check raw pixel values on right edge
  const { data } = await sharp('scratch/right_edge_sample.png').raw().toBuffer({ resolveWithObject: true });
  // check rightmost 5 columns at row 50
  console.log('Sample right edge raw colors:');
  for (let x = 30; x < 40; x++) {
    const idx = (50 * 40 + x) * 3;
    console.log(`x=${x}: R=${data[idx]}, G=${data[idx+1]}, B=${data[idx+2]}`);
  }
})();

