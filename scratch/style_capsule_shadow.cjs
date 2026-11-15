const fs = require('fs');

let css = fs.readFileSync('src/styles.css', 'utf8');

// Update .nav__center-capsule with proper shadow, border, and background
css = css.replace(
  /\.nav__center-capsule\s*\{[\s\S]*?pointer-events:\s*auto;\r?\n\}/,
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
  border: 1px solid rgba(40, 30, 25, 0.12);
  box-shadow:
    0 20px 48px -10px rgba(35, 25, 20, 0.18),
    0 8px 20px -4px rgba(35, 25, 20, 0.10),
    0 2px 6px -1px rgba(35, 25, 20, 0.08),
    inset 0 1px 1px rgba(255, 255, 255, 0.85);
  box-sizing: border-box;
  z-index: 10;
  pointer-events: auto;
  backdrop-filter: blur(12px);
}`
);

// Update .nav__capsule-link for crisp text contrast
css = css.replace(
  /\.nav__capsule-link\s*\{[\s\S]*?box-sizing:\s*border-box;\r?\n\}/,
  `.nav__capsule-link {
  font-family: 'Inter Tight', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14.5px;
  font-weight: 500;
  color: #38342E;
  letter-spacing: -0.015em;
  text-decoration: none;
  padding: 0 24px;
  height: 44px;
  border-radius: 9999px;
  transition: color 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
  user-select: none;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}`
);

// Update .nav__capsule-link.is-active with elevation
css = css.replace(
  /\.nav__capsule-link\.is-active\s*\{[\s\S]*?padding:\s*0 28px;\r?\n\}/,
  `.nav__capsule-link.is-active {
  background: var(--orange, #FF5E14) !important;
  color: #FFFFFF !important;
  font-weight: 500;
  letter-spacing: -0.01em;
  padding: 0 28px;
  box-shadow: 0 4px 14px rgba(255, 94, 20, 0.38), 0 1px 3px rgba(255, 94, 20, 0.2);
}`
);

fs.writeFileSync('src/styles.css', css, 'utf8');
console.log('SUCCESS: proper shadow and contrast applied to center capsule');

