const fs = require('fs');

const buf = fs.readFileSync('public/mascot.glb');
const jsonLen = buf.readUInt32LE(12);
const gltf = JSON.parse(buf.subarray(20, 20 + jsonLen).toString('utf8'));
const binBuf = buf.subarray(20 + jsonLen + 8);

const posOffset = gltf.bufferViews[gltf.accessors[1].bufferView].byteOffset || 0;
const uvOffset = gltf.bufferViews[gltf.accessors[2].bufferView].byteOffset || 0;
const normOffset = gltf.bufferViews[gltf.accessors[3].bufferView].byteOffset || 0;

let headVerts = [];
for (let i = 0; i < gltf.accessors[1].count; i++) {
  const x = binBuf.readFloatLE(posOffset + i * 12);
  const y = binBuf.readFloatLE(posOffset + i * 12 + 4);
  const z = binBuf.readFloatLE(posOffset + i * 12 + 8);
  const nz = binBuf.readFloatLE(normOffset + i * 12 + 8);

  // Real head Y: 0.32 to 0.48
  if (y > 0.32 && y < 0.48 && Math.abs(x) < 0.08 && z > 0.04) {
    const u = binBuf.readFloatLE(uvOffset + i * 8);
    const v = binBuf.readFloatLE(uvOffset + i * 8 + 4);
    headVerts.push({ i, x, y, z, nz, u_px: Math.round(u * 2048), v_top_px: Math.round((1 - v) * 2048) });
  }
}

console.log('Real head vertices (0.32..0.48):', headVerts.length);
// Find UV clusters
const clusters = {};
for (const p of headVerts) {
  const key = Math.floor(p.u_px/100)*100 + ',' + Math.floor(p.v_top_px/100)*100;
  clusters[key] = (clusters[key] || 0) + 1;
}
console.log('UV clusters for real head:');
console.log(Object.entries(clusters).sort((a,b) => b[1] - a[1]));

