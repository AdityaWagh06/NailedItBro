const fs = require('fs');
const sharp = require('sharp');

const buf = fs.readFileSync('public/mascot.glb');
const jsonLen = buf.readUInt32LE(12);
const gltf = JSON.parse(buf.subarray(20, 20 + jsonLen).toString('utf8'));
const binBuf = buf.subarray(20 + jsonLen + 8);

const idxOffset = gltf.bufferViews[gltf.accessors[0].bufferView].byteOffset || 0;
const posOffset = gltf.bufferViews[gltf.accessors[1].bufferView].byteOffset || 0;
const uvOffset = gltf.bufferViews[gltf.accessors[2].bufferView].byteOffset || 0;

const numIndices = gltf.accessors[0].count;
let svgPaths = [];
let faceTrianglesCount = 0;

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

  // If all 3 vertices are on the front face (y: 0.16..0.28, x: -0.06..0.06, z > 0.07)
  if (
    y0 > 0.16 && y0 < 0.28 && Math.abs(x0) < 0.06 && z0 > 0.07 &&
    y1 > 0.16 && y1 < 0.28 && Math.abs(x1) < 0.06 && z1 > 0.07 &&
    y2 > 0.16 && y2 < 0.28 && Math.abs(x2) < 0.06 && z2 > 0.07
  ) {
    faceTrianglesCount++;
    const u0 = Math.round(binBuf.readFloatLE(uvOffset + i0 * 8) * 2048);
    const v0 = Math.round((1 - binBuf.readFloatLE(uvOffset + i0 * 8 + 4)) * 2048);
    const u1 = Math.round(binBuf.readFloatLE(uvOffset + i1 * 8) * 2048);
    const v1 = Math.round((1 - binBuf.readFloatLE(uvOffset + i1 * 8 + 4)) * 2048);
    const u2 = Math.round(binBuf.readFloatLE(uvOffset + i2 * 8) * 2048);
    const v2 = Math.round((1 - binBuf.readFloatLE(uvOffset + i2 * 8 + 4)) * 2048);

    svgPaths.push(`<polygon points="${u0},${v0} ${u1},${v1} ${u2},${v2}" fill="rgba(255,0,0,0.6)" stroke="yellow" stroke-width="1" />`);
  }
}
console.log('Face triangles found:', faceTrianglesCount);

const svg = `<svg width="2048" height="2048" xmlns="http://www.w3.org/2000/svg">${svgPaths.join('')}</svg>`;
fs.writeFileSync('scratch_face_wireframe.svg', svg);

sharp('scratch_mascot_tex_0.webp')
  .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
  .toFile('scratch_tex_with_face_uv.png')
  .then(() => console.log('Composite saved to scratch_tex_with_face_uv.png'))
  .catch(err => console.error(err));
