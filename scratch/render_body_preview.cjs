const fs = require('fs');
const sharp = require('sharp');

async function renderBodyPreview(glbPath, outPngPath) {
  const buf = fs.readFileSync(glbPath);
  const jsonLen = buf.readUInt32LE(12);
  const gltf = JSON.parse(buf.subarray(20, 20 + jsonLen).toString('utf8'));
  const binBuf = buf.subarray(20 + jsonLen + 8);

  const idxOffset = gltf.bufferViews[gltf.accessors[0].bufferView].byteOffset || 0;
  const posOffset = gltf.bufferViews[gltf.accessors[1].bufferView].byteOffset || 0;
  const uvOffset = gltf.bufferViews[gltf.accessors[2].bufferView].byteOffset || 0;
  const numIndices = gltf.accessors[0].count;

  const img0Bv = gltf.bufferViews[gltf.images[0].bufferView];
  const imgBuf = binBuf.subarray(img0Bv.byteOffset, img0Bv.byteOffset + img0Bv.byteLength);
  const { data: texData, info: texInfo } = await sharp(imgBuf).raw().toBuffer({ resolveWithObject: true });
  const TW = texInfo.width;
  const TH = texInfo.height;
  const TC = texInfo.channels;

  const RW = 800;
  const RH = 800;
  const outBuf = Buffer.alloc(RW * RH * 4, 0); // Transparent background
  const zBuf = new Float32Array(RW * RH).fill(-9999);

  // Bust / Torso viewing area
  const minX = -0.22;
  const maxX = 0.22;
  const minY = 0.04;
  const maxY = 0.48;

  for (let i = 0; i < numIndices; i += 3) {
    const i0 = binBuf.readUInt32LE(idxOffset + i * 4);
    const i1 = binBuf.readUInt32LE(idxOffset + (i + 1) * 4);
    const i2 = binBuf.readUInt32LE(idxOffset + (i + 2) * 4);

    const x0 = binBuf.readFloatLE(posOffset + i0 * 12);
    const y0 = binBuf.readFloatLE(posOffset + i0 * 12 + 4);
    const z0 = binBuf.readFloatLE(posOffset + i0 * 12 + 8);

    const x1 = binBuf.readFloatLE(posOffset + i1 * 12);
    const y1 = binBuf.readFloatLE(posOffset + i1 * 12 + 4);
    const z1 = binBuf.readFloatLE(posOffset + i1 * 12 + 8);

    const x2 = binBuf.readFloatLE(posOffset + i2 * 12);
    const y2 = binBuf.readFloatLE(posOffset + i2 * 12 + 4);
    const z2 = binBuf.readFloatLE(posOffset + i2 * 12 + 8);

    if (z0 < -0.05 && z1 < -0.05 && z2 < -0.05) continue;
    if (y0 < minY && y1 < minY && y2 < minY) continue;
    if (y0 > maxY && y1 > maxY && y2 > maxY) continue;

    const e1x = x1 - x0, e1y = y1 - y0, e1z = z1 - z0;
    const e2x = x2 - x0, e2y = y2 - y0, e2z = z2 - z0;
    const nz = e1x * e2y - e1y * e2x;
    if (nz <= 0) continue;

    const sx0 = (x0 - minX) / (maxX - minX) * (RW - 1);
    const sy0 = (1 - (y0 - minY) / (maxY - minY)) * (RH - 1);

    const sx1 = (x1 - minX) / (maxX - minX) * (RW - 1);
    const sy1 = (1 - (y1 - minY) / (maxY - minY)) * (RH - 1);

    const sx2 = (x2 - minX) / (maxX - minX) * (RW - 1);
    const sy2 = (1 - (y2 - minY) / (maxY - minY)) * (RH - 1);

    const u0 = binBuf.readFloatLE(uvOffset + i0 * 8) * (TW - 1);
    const v0 = (1 - binBuf.readFloatLE(uvOffset + i0 * 8 + 4)) * (TH - 1);

    const u1 = binBuf.readFloatLE(uvOffset + i1 * 8) * (TW - 1);
    const v1 = (1 - binBuf.readFloatLE(uvOffset + i1 * 8 + 4)) * (TH - 1);

    const u2 = binBuf.readFloatLE(uvOffset + i2 * 8) * (TW - 1);
    const v2 = (1 - binBuf.readFloatLE(uvOffset + i2 * 8 + 4)) * (TH - 1);

    const minScreenX = Math.max(Math.floor(Math.min(sx0, sx1, sx2)), 0);
    const maxScreenX = Math.min(Math.ceil(Math.max(sx0, sx1, sx2)), RW - 1);
    const minScreenY = Math.max(Math.floor(Math.min(sy0, sy1, sy2)), 0);
    const maxScreenY = Math.min(Math.ceil(Math.max(sy0, sy1, sy2)), RH - 1);

    const denom = (sy1 - sy2) * (sx0 - sx2) + (sx2 - sx1) * (sy0 - sy2);
    if (Math.abs(denom) < 1e-5) continue;

    for (let py = minScreenY; py <= maxScreenY; py++) {
      for (let px = minScreenX; px <= maxScreenX; px++) {
        const w0 = ((sy1 - sy2) * (px - sx2) + (sx2 - sx1) * (py - sy2)) / denom;
        const w1 = ((sy2 - sy0) * (px - sx2) + (sx0 - sx2) * (py - sy2)) / denom;
        const w2 = 1 - w0 - w1;

        if (w0 >= 0 && w1 >= 0 && w2 >= 0) {
          const z = w0 * z0 + w1 * z1 + w2 * z2;
          const pIdx = py * RW + px;
          if (z > zBuf[pIdx]) {
            zBuf[pIdx] = z;

            const tu = Math.min(Math.max(Math.round(w0 * u0 + w1 * u1 + w2 * u2), 0), TW - 1);
            const tv = Math.min(Math.max(Math.round(w0 * v0 + w1 * v1 + w2 * v2), 0), TH - 1);
            const tIdx = (tv * TW + tu) * TC;

            outBuf[pIdx * 4] = texData[tIdx];
            outBuf[pIdx * 4 + 1] = texData[tIdx + 1];
            outBuf[pIdx * 4 + 2] = texData[tIdx + 2];
            outBuf[pIdx * 4 + 3] = 255;
          }
        }
      }
    }
  }

  await sharp(outBuf, { raw: { width: RW, height: RH, channels: 4 } })
    .png()
    .toFile(outPngPath);
  console.log('Saved torso preview:', outPngPath);
}

renderBodyPreview('public/mascot.glb', 'scratch_render_torso_preview.png').catch(console.error);

