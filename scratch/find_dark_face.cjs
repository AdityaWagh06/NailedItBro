const fs = require('fs');
const sharp = require('sharp');

async function findDarkFacialLines() {
  const buf = fs.readFileSync('public/mascot.glb');
  const jsonLen = buf.readUInt32LE(12);
  const gltf = JSON.parse(buf.subarray(20, 20 + jsonLen).toString('utf8'));
  const binBuf = buf.subarray(20 + jsonLen + 8);

  const posOffset = gltf.bufferViews[gltf.accessors[1].bufferView].byteOffset || 0;
  const uvOffset = gltf.bufferViews[gltf.accessors[2].bufferView].byteOffset || 0;
  const normOffset = gltf.bufferViews[gltf.accessors[3].bufferView].byteOffset || 0;

  const { data, info } = await sharp('scratch_mascot_tex_0.webp').raw().toBuffer({ resolveWithObject: true });

  let darkFaceVerts = [];
  for (let i = 0; i < gltf.accessors[1].count; i++) {
    const x = binBuf.readFloatLE(posOffset + i * 12);
    const y = binBuf.readFloatLE(posOffset + i * 12 + 4);
    const z = binBuf.readFloatLE(posOffset + i * 12 + 8);
    const nz = binBuf.readFloatLE(normOffset + i * 12 + 8);

    // Front-facing head surface
    if (y > 0.32 && y < 0.44 && Math.abs(x) < 0.06 && z > 0.05 && nz > 0.5) {
      const u = binBuf.readFloatLE(uvOffset + i * 8);
      const v = binBuf.readFloatLE(uvOffset + i * 8 + 4);
      const px = Math.min(Math.max(Math.round(u * (info.width - 1)), 0), info.width - 1);
      const py = Math.min(Math.max(Math.round((1 - v) * (info.height - 1)), 0), info.height - 1);
      const idx = (py * info.width + px) * info.channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Dark pixels (eyes/eyebrows/mouth)
      if (r < 90 && g < 70 && b < 70) {
        darkFaceVerts.push({ i, x: +x.toFixed(3), y: +y.toFixed(3), z: +z.toFixed(3), px, py, r, g, b });
      }
    }
  }

  console.log('Dark face vertices count:', darkFaceVerts.length);
  // Group by y-height
  darkFaceVerts.sort((a,b) => b.y - a.y);
  console.log('Top 10 highest (eyebrows):', darkFaceVerts.slice(0, 10));
  console.log('Middle 10 (eyes):', darkFaceVerts.slice(Math.floor(darkFaceVerts.length * 0.4), Math.floor(darkFaceVerts.length * 0.4) + 10));
  console.log('Lowest 10 (mouth):', darkFaceVerts.slice(-10));
}

findDarkFacialLines();

