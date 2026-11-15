const fs = require('fs');

let css = fs.readFileSync('src/styles.css', 'utf8');

// Replace the light-theme scrolled nav__inner rule that adds the beige box with border
css = css.replace(
  /html\[data-page='light'\] \.nav\.is-scrolled:not\(\.is-open\) \.nav__inner,[\s\S]*?body:has\(\.about-page-layout\) \.nav\.is-scrolled:not\(\.is-open\) \.nav__inner\s*\{[\s\S]*?\}/,
  `html[data-page='light'] .nav.is-scrolled:not(.is-open) .nav__inner,
body:has(.about-page-layout) .nav.is-scrolled:not(.is-open) .nav__inner {
  background: transparent;
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}`
);

fs.writeFileSync('src/styles.css', css, 'utf8');
console.log('SUCCESS: removed light theme scrolled beige box');

