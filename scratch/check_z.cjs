const fs = require('fs');

const buf = fs.readFileSync('public/mascot_backup_original.glb');
const jsonLen = buf.readUInt32LE(12);
const gltf = JSON.parse(buf.subarray(20, 20 + jsonLen).toString('utf8'));
const binBuf = buf.subarray(20 + jsonLen + 8);

const posOffset = gltf.bufferViews[gltf.accessors[1].bufferView].byteOffset || 0;

// At eye level: y = 0.38, x = -0.035
let eyeVerts = [];
for (let i = 0; i < gltf.accessors[1].count; i++) {
  const x = binBuf.readFloatLE(posOffset + i * 12);
  const y = binBuf.readFloatLE(posOffset + i * 12 + 4);
  const z = binBuf.readFloatLE(posOffset + i * 12 + 8);
  if (Math.abs(x - (-0.035)) < 0.015 && Math.abs(y - 0.38) < 0.015) {
    eyeVerts.push({ i, x, y, z });
  }
}
eyeVerts.sort((a,b) => a.z - b.z);
console.log('Eye verts Z range:', eyeVerts[0]?.z, 'to', eyeVerts[eyeVerts.length-1]?.z);
console.log('Sample verts:');
console.log(eyeVerts);

