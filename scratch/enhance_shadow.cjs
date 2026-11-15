const fs = require('fs');

let css = fs.readFileSync('src/styles.css', 'utf8');

css = css.replace(
  /\.nav__center-capsule\s*\{[\s\S]*?backdrop-filter:\s*blur\(12px\);\r?\n\}/,
  `.nav__center-capsule {
  display: none;
  align-items: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #EAE3D6;
  border-radius: 9999px;
  height: 52px;
  padding: 4px;
  border: 1px solid rgba(40, 30, 25, 0.14);
  box-shadow:
    0 24px 50px -8px rgba(30, 20, 15, 0.22),
    0 10px 24px -4px rgba(30, 20, 15, 0.12),
    0 3px 8px -1px rgba(30, 20, 15, 0.08),
    inset 0 1px 1.5px rgba(255, 255, 255, 0.95);
  box-sizing: border-box;
  z-index: 10;
  pointer-events: auto;
  backdrop-filter: blur(12px);
}`
);

fs.writeFileSync('src/styles.css', css, 'utf8');
console.log('SUCCESS: refined shadow applied');

