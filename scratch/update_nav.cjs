const fs = require('fs');

let css = fs.readFileSync('src/styles.css', 'utf8');

// 1. Remove outer beige strip from .nav__inner and .nav.is-scrolled .nav__inner
css = css.replace(
  /\.nav__inner\s*\{[\s\S]*?transition:[^;]+;\r?\n\}/,
  `.nav__inner {
  position: relative; z-index: 2;
  display: flex; align-items: center; gap: 24px;
  max-width: 1480px; margin-inline: auto; height: 60px; padding: 0 10px 0 22px;
  background: transparent;
  color: var(--fg);
}`
);

css = css.replace(
  /\.nav\.is-scrolled \.nav__inner\s*\{[\s\S]*?\}/,
  `.nav.is-scrolled .nav__inner {
  background: transparent;
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}`
);

// 2. Change center capsule from white strip to beige strip
css = css.replace(
  /\.nav__center-capsule\s*\{[\s\S]*?pointer-events:\s*auto;\r?\n\}/,
  `.nav__center-capsule {
  display: none;
  align-items: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #EDE8DE;
  border-radius: 9999px;
  height: 52px;
  padding: 4px;
  box-shadow:
    0 12px 32px -6px rgba(20, 18, 15, 0.08),
    0 4px 12px -2px rgba(20, 18, 15, 0.04),
    inset 0 1px 1px rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(20, 18, 15, 0.07);
  box-sizing: border-box;
  z-index: 10;
  pointer-events: auto;
}`
);

fs.writeFileSync('src/styles.css', css, 'utf8');
console.log('SUCCESS');

