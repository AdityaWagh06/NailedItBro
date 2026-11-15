const fs = require('fs');

const buf = fs.readFileSync('public/mascot.glb');
const jsonLen = buf.readUInt32LE(12);
const gltf = JSON.parse(buf.subarray(20, 20 + jsonLen).toString('utf8'));
const binBuf = buf.subarray(20 + jsonLen + 8);

const posOffset = gltf.bufferViews[gltf.accessors[1].bufferView].byteOffset || 0;
const uvOffset = gltf.bufferViews[gltf.accessors[2].bufferView].byteOffset || 0;
const normOffset = gltf.bufferViews[gltf.accessors[3].bufferView].byteOffset || 0;

let verts = [];
for (let i = 0; i < gltf.accessors[1].count; i++) {
  const x = binBuf.readFloatLE(posOffset + i * 12);
  const y = binBuf.readFloatLE(posOffset + i * 12 + 4);
  const z = binBuf.readFloatLE(posOffset + i * 12 + 8);
  const nz = binBuf.readFloatLE(normOffset + i * 12 + 8);

  // Mascot head is y: 0.15 to 0.35
  if (y > 0.15 && y < 0.35) {
    verts.push({ i, x, y, z, nz });
  }
}

console.log('Total vertices in head y-range (0.15..0.35):', verts.length);
// Find Z distribution
let zBuckets = {};
for (const v of verts) {
  const zb = (Math.floor(v.z * 50) / 50).toFixed(2);
  zBuckets[zb] = (zBuckets[zb] || 0) + 1;
}
console.log('Z distribution:', zBuckets);

