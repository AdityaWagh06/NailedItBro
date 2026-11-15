const fs = require('fs');

let css = fs.readFileSync('src/styles.css', 'utf8');

// Replace .nav__quote-pill and .nav__quote-arrow-badge styling
css = css.replace(
  /\.nav__quote-pill\s*\{[\s\S]*?\.nav__links\s*\{/m,
  `.nav__quote-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 44px;
  padding: 3px 3px 3px 18px;
  border-radius: 9999px;
  background: var(--orange, #FF5E14);
  color: #FFFFFF !important;
  text-decoration: none;
  box-shadow:
    0 10px 24px -4px rgba(255, 94, 20, 0.42),
    0 3px 8px -2px rgba(255, 94, 20, 0.25);
  border: none;
  box-sizing: border-box;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease;
  user-select: none;
}

.nav__quote-pill:hover {
  background: var(--orange-hover, #FF7533);
  transform: translateY(-2px) scale(1.02);
  box-shadow:
    0 14px 30px -4px rgba(255, 94, 20, 0.54),
    0 6px 14px -2px rgba(255, 94, 20, 0.32);
}

.nav__quote-pill:active {
  transform: translateY(0) scale(0.98);
}

.nav__quote-text {
  font-family: 'Inter Tight', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #FFFFFF !important;
  white-space: nowrap;
}

.nav__quote-arrow-badge {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #FFFFFF;
  color: var(--orange, #FF5E14);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease, box-shadow 0.3s ease;
}

.nav__quote-pill:hover .nav__quote-arrow-badge {
  transform: scale(1.08);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
}

.nav__arrow-slider {
  position: relative;
  width: 13px;
  height: 13px;
  display: block;
}

.nav__arrow-svg {
  position: absolute;
  inset: 0;
  transition: transform 0.32s cubic-bezier(0.2, 0.8, 0.2, 1);
  display: block;
}

.nav__arrow-svg--primary {
  transform: translate(0, 0);
}

.nav__arrow-svg--clone {
  transform: translate(-140%, 140%);
}

.nav__quote-pill:hover .nav__arrow-svg--primary {
  transform: translate(140%, -140%);
}

.nav__quote-pill:hover .nav__arrow-svg--clone {
  transform: translate(0, 0);
}

.nav__links {`
);

fs.writeFileSync('src/styles.css', css, 'utf8');
console.log('SUCCESS: quote button resized and hover animation added');

