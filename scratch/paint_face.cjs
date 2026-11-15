const fs = require('fs');
const sharp = require('sharp');

async function paintFace() {
  const buf = fs.readFileSync('public/mascot_backup_original.glb');
  const jsonLen = buf.readUInt32LE(12);
  const gltf = JSON.parse(buf.subarray(20, 20 + jsonLen).toString('utf8'));
  const binBuf = buf.subarray(20 + jsonLen + 8);

  const idxOffset = gltf.bufferViews[gltf.accessors[0].bufferView].byteOffset || 0;
  const posOffset = gltf.bufferViews[gltf.accessors[1].bufferView].byteOffset || 0;
  const uvOffset = gltf.bufferViews[gltf.accessors[2].bufferView].byteOffset || 0;
  const numIndices = gltf.accessors[0].count;

  const origWebp = fs.readFileSync('scratch_mascot_tex_0.webp');
  const { data, info } = await sharp(origWebp).raw().toBuffer({ resolveWithObject: true });
  const W = info.width;
  const H = info.height;
  const C = info.channels;

  function getFaceColor(x, y, z, origR, origG, origB) {
    // -------------------------------------------------------------
    // 1. EYES: Bigger, expressive, friendly anime/Pixar eyes
    // -------------------------------------------------------------
    const eyeY = 0.268;
    const isLeftEye = x < 0;
    const eyeCenterX = isLeftEye ? -0.024 : 0.024;

    // Bigger eye radius: width 0.016, height 0.017
    const dx = (x - eyeCenterX) / 0.0160;
    const dy = (y - eyeY) / 0.0175;
    const rot = isLeftEye ? 0.06 : -0.06;
    const rx = dx * Math.cos(rot) - dy * Math.sin(rot);
    const ry = dx * Math.sin(rot) + dy * Math.cos(rot);
    const eyeDist = Math.hypot(rx, ry);

    if (eyeDist < 1.35) {
      // Upper eyeliner & eyelashes: sleek dark espresso arc
      const upperLashDist = Math.hypot(rx * 0.95, ry - 0.72);
      if (ry > 0.25 && upperLashDist > 0.55 && upperLashDist < 1.32) {
        const edge = Math.min(Math.max((1.32 - upperLashDist) / 0.15, 0), 1);
        return [20, 10, 8, edge];
      }

      // Eyeball
      if (eyeDist < 1.0) {
        // Main Specular Catchlight (bright pure white sparkle in upper-right)
        const hl1 = Math.hypot((rx - 0.26) / 0.22, (ry - 0.30) / 0.22);
        if (hl1 < 1.0) {
          return [255, 255, 255, 1.0];
        }

        // Secondary Soft Highlight (lower-left warm bounce)
        const hl2 = Math.hypot((rx + 0.32) / 0.13, (ry + 0.22) / 0.13);
        if (hl2 < 1.0) {
          return [245, 248, 255, 0.9];
        }

        // Iris
        const irisDx = rx / 0.75;
        const irisDy = (ry + 0.05) / 0.75;
        const irisDist = Math.hypot(irisDx, irisDy);

        if (irisDist < 1.0) {
          // Pupil
          const pupilDist = irisDist / 0.44;
          if (pupilDist < 1.0) {
            return [10, 6, 6, 1.0];
          }

          // Luminous Amber / Caramel Brown Iris
          const t = (irisDist - 0.44) / 0.56;
          let r = Math.round(150 * (1 - t * 0.55) + 32 * (t * 0.55));
          let g = Math.round(84 * (1 - t * 0.65) + 18 * (t * 0.65));
          let b = Math.round(38 * (1 - t * 0.75) + 10 * (t * 0.75));

          // Golden bounce at bottom of iris
          if (ry < -0.05 && irisDist < 0.92) {
            const glow = Math.min(Math.max((-ry - 0.05) / 0.45, 0), 1) * (1 - pupilDist);
            r = Math.min(Math.round(r + glow * 85), 255);
            g = Math.min(Math.round(g + glow * 55), 255);
            b = Math.min(Math.round(b + glow * 25), 255);
          }

          return [r, g, b, 1.0];
        }

        // Sclera
        const shadowT = Math.min(Math.max((ry - 0.1) / 0.8, 0), 1);
        const scleraR = Math.round(250 - shadowT * 16);
        const scleraG = Math.round(252 - shadowT * 14);
        const scleraB = Math.round(255 - shadowT * 10);
        return [scleraR, scleraG, scleraB, 1.0];
      }

      // Smooth blend around eyelid into skin
      const edgeFade = (1.35 - eyeDist) / 0.35;
      return [origR, origG, origB, edgeFade * 0.4];
    }

    // -------------------------------------------------------------
    // 2. MOUTH: Wide, proper, clean open smile covering old teeth marks
    // -------------------------------------------------------------
    const mouthY = 0.210;
    // Wider mouth (width 0.034) to completely cover the old smile geometry
    const mdx = (x - (-0.002)) / 0.034;
    const mdy = (y - mouthY) / 0.016;

    const upperLipCurve = 0.20 + 0.50 * (mdx * mdx);
    const lowerLipCurve = -0.90 + 0.22 * (mdx * mdx);

    if (Math.abs(mdx) < 1.15 && mdy <= upperLipCurve + 0.22 && mdy >= lowerLipCurve - 0.22) {
      // Upper lip contour
      if (Math.abs(mdy - upperLipCurve) < 0.15) {
        return [55, 18, 16, 0.95];
      }

      // Inside open mouth
      if (mdy < upperLipCurve && mdy > lowerLipCurve) {
        // Upper white teeth
        const teethBottom = upperLipCurve - 0.44;
        if (mdy >= teethBottom && Math.abs(mdx) < 0.86) {
          return [252, 254, 255, 1.0];
        }

        // Rosy pink tongue at bottom
        const tongueDist = Math.hypot(mdx / 0.70, (mdy - (lowerLipCurve + 0.22)) / 0.36);
        if (tongueDist < 1.0) {
          return [234, 108, 116, 1.0];
        }

        // Deep cavity
        return [75, 18, 24, 1.0];
      }

      // Lower lip outline
      if (Math.abs(mdy - lowerLipCurve) < 0.22) {
        return [195, 88, 80, 0.8];
      }
    }

    // Cover any stray white pixels from old mouth outside our new smile
    if (y >= 0.198 && y <= 0.235 && Math.abs(x) < 0.045) {
      if (origR > 210 && origG > 180 && origB > 170) {
        // Blend to warm peach skin tone
        return [220, 140, 115, 0.9];
      }
    }

    // -------------------------------------------------------------
    // 3. WARM CHEEK BLUSH
    // -------------------------------------------------------------
    const blushY = 0.245;
    const blushDistL = Math.hypot((x - (-0.036)) / 0.012, (y - blushY) / 0.007);
    const blushDistR = Math.hypot((x - (+0.036)) / 0.012, (y - blushY) / 0.007);
    if (blushDistL < 1.0 || blushDistR < 1.0) {
      const d = Math.min(blushDistL, blushDistR);
      const intensity = (1 - d) * 0.4;
      return [255, 125, 105, intensity];
    }

    return null;
  }

  let paintedTriangles = 0;
  let paintedPixels = 0;

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

    const minY = Math.min(y0, y1, y2);
    const maxY = Math.max(y0, y1, y2);
    const maxX = Math.max(Math.abs(x0), Math.abs(x1), Math.abs(x2));
    const maxZ = Math.max(z0, z1, z2);

    if (maxY > 0.19 && minY < 0.29 && maxX < 0.065 && maxZ > 0.06) {
      paintedTriangles++;

      const u0 = binBuf.readFloatLE(uvOffset + i0 * 8) * (W - 1);
      const v0 = (1 - binBuf.readFloatLE(uvOffset + i0 * 8 + 4)) * (H - 1);

      const u1 = binBuf.readFloatLE(uvOffset + i1 * 8) * (W - 1);
      const v1 = (1 - binBuf.readFloatLE(uvOffset + i1 * 8 + 4)) * (H - 1);

      const u2 = binBuf.readFloatLE(uvOffset + i2 * 8) * (W - 1);
      const v2 = (1 - binBuf.readFloatLE(uvOffset + i2 * 8 + 4)) * (H - 1);

      const minU = Math.max(Math.floor(Math.min(u0, u1, u2)), 0);
      const maxU = Math.min(Math.ceil(Math.max(u0, u1, u2)), W - 1);
      const minV = Math.max(Math.floor(Math.min(v0, v1, v2)), 0);
      const maxV = Math.min(Math.ceil(Math.max(v0, v1, v2)), H - 1);

      const denom = (v1 - v2) * (u0 - u2) + (u2 - u1) * (v0 - v2);
      if (Math.abs(denom) < 1e-6) continue;

      for (let py = minV; py <= maxV; py++) {
        for (let px = minU; px <= maxU; px++) {
          const w0 = ((v1 - v2) * (px - u2) + (u2 - u1) * (py - v2)) / denom;
          const w1 = ((v2 - v0) * (px - u2) + (u0 - u2) * (py - v2)) / denom;
          const w2 = 1 - w0 - w1;

          if (w0 >= -0.02 && w1 >= -0.02 && w2 >= -0.02) {
            const x = w0 * x0 + w1 * x1 + w2 * x2;
            const y = w0 * y0 + w1 * y1 + w2 * y2;
            const z = w0 * z0 + w1 * z1 + w2 * z2;

            const pixelIdx = (py * W + px) * C;
            const origR = data[pixelIdx];
            const origG = data[pixelIdx + 1];
            const origB = data[pixelIdx + 2];

            const col = getFaceColor(x, y, z, origR, origG, origB);
            if (col) {
              const [newR, newG, newB, alpha] = col;
              data[pixelIdx] = Math.round(origR * (1 - alpha) + newR * alpha);
              data[pixelIdx + 1] = Math.round(origG * (1 - alpha) + newG * alpha);
              data[pixelIdx + 2] = Math.round(origB * (1 - alpha) + newB * alpha);
              paintedPixels++;
            }
          }
        }
      }
    }
  }

  console.log(`Rasterization finished: ${paintedTriangles} triangles, ${paintedPixels} pixels painted.`);

  await sharp(data, { raw: { width: W, height: H, channels: C } })
    .webp({ quality: 92, effort: 4 })
    .toFile('scratch_mascot_tex_open_eyes.webp');
  console.log('Saved scratch_mascot_tex_open_eyes.webp');
}

paintFace().catch(console.error);
