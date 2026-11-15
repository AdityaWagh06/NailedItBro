const fs = require('fs');

const buf = fs.readFileSync('public/mascot.glb');
const jsonLen = buf.readUInt32LE(12);
const gltf = JSON.parse(buf.subarray(20, 20 + jsonLen).toString('utf8'));
const binBuf = buf.subarray(20 + jsonLen + 8);

const idxOffset = gltf.bufferViews[gltf.accessors[0].bufferView].byteOffset || 0;
const posOffset = gltf.bufferViews[gltf.accessors[1].bufferView].byteOffset || 0;
const uvOffset = gltf.bufferViews[gltf.accessors[2].bufferView].byteOffset || 0;
const numIndices = gltf.accessors[0].count;

// Sample points at key facial features in 3D:
// Center of nose: (0, 0.22, 0.09)
// Left eye (viewer's left, mascot's right): (-0.025, 0.24, 0.08)
// Right eye (viewer's right, mascot's left): (0.025, 0.24, 0.08)
// Mouth: (0, 0.19, 0.085)
const features = [
  { name: 'nose', x: 0, y: 0.22, z: 0.09 },
  { name: 'left_eye', x: -0.025, y: 0.24, z: 0.08 },
  { name: 'right_eye', x: 0.025, y: 0.24, z: 0.08 },
  { name: 'mouth', x: 0, y: 0.19, z: 0.085 }
];

for (const feat of features) {
  let closest = { dist: 999 };
  for (let i = 0; i < gltf.accessors[1].count; i++) {
    const x = binBuf.readFloatLE(posOffset + i * 12);
    const y = binBuf.readFloatLE(posOffset + i * 12 + 4);
    const z = binBuf.readFloatLE(posOffset + i * 12 + 8);
    const d = Math.hypot(x - feat.x, y - feat.y, z - feat.z);
    if (d < closest.dist) {
      const u = binBuf.readFloatLE(uvOffset + i * 8);
      const v = binBuf.readFloatLE(uvOffset + i * 8 + 4);
      closest = { dist: d, idx: i, x, y, z, u, v, u_px: Math.round(u * 2048), v_top_px: Math.round((1 - v) * 2048) };
    }
  }
  console.log(feat.name, closest);
}

