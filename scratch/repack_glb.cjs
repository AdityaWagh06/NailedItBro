const fs = require('fs');

function repackGlb(glbPath, newWebpPath, outGlbPath) {
  const buf = fs.readFileSync(glbPath);
  const jsonLen = buf.readUInt32LE(12);
  const gltf = JSON.parse(buf.subarray(20, 20 + jsonLen).toString('utf8'));
  const binBuf = buf.subarray(20 + jsonLen + 8);

  const img0BvIdx = gltf.images[0].bufferView; // index 2
  const oldBv = gltf.bufferViews[img0BvIdx];
  const newImgBuf = fs.readFileSync(newWebpPath);

  // Parts before image 0
  const beforeImg = binBuf.subarray(0, oldBv.byteOffset);
  // Parts after image 0
  const afterImg = binBuf.subarray(oldBv.byteOffset + oldBv.byteLength);

  // Pad newImgBuf to 4-byte alignment
  const padLen = (4 - (newImgBuf.length % 4)) % 4;
  const paddedNewImg = Buffer.concat([newImgBuf, Buffer.alloc(padLen, 0)]);

  const newBinBuf = Buffer.concat([beforeImg, paddedNewImg, afterImg]);

  // Adjust byteLengths and byteOffsets of bufferViews
  const delta = paddedNewImg.length - oldBv.byteLength;
  oldBv.byteLength = newImgBuf.length;

  for (let i = 0; i < gltf.bufferViews.length; i++) {
    if (i !== img0BvIdx && gltf.bufferViews[i].byteOffset > oldBv.byteOffset) {
      gltf.bufferViews[i].byteOffset += delta;
    }
  }
  gltf.buffers[0].byteLength = newBinBuf.length;

  let newJsonStr = JSON.stringify(gltf);
  const jsonPad = (4 - (Buffer.byteLength(newJsonStr) % 4)) % 4;
  newJsonStr += ' '.repeat(jsonPad);
  const newJsonBuf = Buffer.from(newJsonStr, 'utf8');

  const totalLen = 12 + 8 + newJsonBuf.length + 8 + newBinBuf.length;
  const headerBuf = Buffer.alloc(12);
  headerBuf.write('glTF', 0);
  headerBuf.writeUInt32LE(2, 4); // version
  headerBuf.writeUInt32LE(totalLen, 8);

  const jsonHeader = Buffer.alloc(8);
  jsonHeader.writeUInt32LE(newJsonBuf.length, 0);
  jsonHeader.writeUInt32LE(0x4E4F534A, 4); // JSON

  const binHeader = Buffer.alloc(8);
  binHeader.writeUInt32LE(newBinBuf.length, 0);
  binHeader.writeUInt32LE(0x004E4942, 4); // BIN\0

  const outGlb = Buffer.concat([headerBuf, jsonHeader, newJsonBuf, binHeader, newBinBuf]);
  fs.writeFileSync(outGlbPath, outGlb);
  console.log('Successfully repacked GLB:', outGlbPath, 'size:', outGlb.length);
}

const args = process.argv.slice(2);
if (args.length >= 3) {
  repackGlb(args[0], args[1], args[2]);
} else {
  repackGlb('public/mascot.glb', 'scratch_mascot_tex_0.webp', 'scratch_mascot_test.glb');
}

module.exports = { repackGlb };
