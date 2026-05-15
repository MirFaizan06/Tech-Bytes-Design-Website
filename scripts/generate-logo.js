const fs = require('fs');
const path = require('path');

// A modern, geometric logomark: angular bracket with a circuit-dot accent
// "< />" motif — universal web dev symbol — rendered with sharp lines and violet gradient
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" fill="none">
  <defs>
    <linearGradient id="g1" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#a78bfa"/>
      <stop offset="100%" stop-color="#60a5fa"/>
    </linearGradient>
    <linearGradient id="g2" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
  </defs>

  <!-- Rounded square background -->
  <rect width="48" height="48" rx="12" fill="#0d0d1f"/>

  <!-- Left angle bracket < -->
  <polyline
    points="18,13 10,24 18,35"
    stroke="url(#g1)"
    stroke-width="3.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />

  <!-- Right angle bracket > -->
  <polyline
    points="30,13 38,24 30,35"
    stroke="url(#g1)"
    stroke-width="3.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />

  <!-- Forward slash / -->
  <line
    x1="27" y1="13"
    x2="21" y2="35"
    stroke="url(#g2)"
    stroke-width="3"
    stroke-linecap="round"
  />

  <!-- Corner accent dots -->
  <circle cx="6"  cy="6"  r="1.5" fill="#a78bfa" opacity="0.5"/>
  <circle cx="42" cy="42" r="1.5" fill="#60a5fa" opacity="0.5"/>
</svg>`;

const outDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'logo.svg'), svg.trim());
console.log('✓ Logo generated at public/logo.svg');
