const fs = require('fs');
const path = require('path');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#a78bfa"/>
      <stop offset="100%" style="stop-color:#60a5fa"/>
    </linearGradient>
    <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7c3aed"/>
      <stop offset="100%" style="stop-color:#2563eb"/>
    </linearGradient>
  </defs>

  <!-- Background circle -->
  <circle cx="100" cy="100" r="95" fill="#0d0d1f"/>
  <circle cx="100" cy="100" r="93" fill="none" stroke="url(#g)" stroke-width="2" opacity="0.5"/>

  <!-- Inner hexagon-like shape -->
  <polygon points="100,20 168,60 168,140 100,180 32,140 32,60" fill="none" stroke="url(#g)" stroke-width="1.5" opacity="0.3"/>

  <!-- TBD letters -->
  <text x="100" y="115" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif"
    font-size="52" font-weight="900" fill="url(#g)" letter-spacing="-2">TBD</text>

  <!-- Decorative dots -->
  <circle cx="55" cy="75" r="3" fill="#a78bfa" opacity="0.6"/>
  <circle cx="145" cy="75" r="3" fill="#60a5fa" opacity="0.6"/>
  <circle cx="100" cy="155" r="3" fill="#a78bfa" opacity="0.6"/>
</svg>`;

const outDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(path.join(outDir, 'logo.svg'), svg.trim());
console.log('✓ Logo generated at public/logo.svg');
