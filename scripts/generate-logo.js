const fs = require('fs');
const path = require('path');

// Clean geometric "T" monogram on a rich violet-to-indigo gradient tile.
// The letterform is built from two simple rectangles — no font needed,
// scales perfectly from favicon (16px) to hero (256px).
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" fill="none">
  <defs>
    <!-- Diagonal violet → indigo gradient background -->
    <linearGradient id="bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#4338ca"/>
    </linearGradient>
    <!-- Soft inner glow for the letter -->
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur"/>
      <feFlood flood-color="#c4b5fd" flood-opacity="0.4" result="color"/>
      <feComposite in="color" in2="blur" operator="in" result="shadow"/>
      <feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Background: rounded square -->
  <rect width="48" height="48" rx="13" fill="url(#bg)"/>

  <!-- Subtle top-left highlight for depth -->
  <rect width="48" height="48" rx="13"
    fill="url(#highlight)" opacity="0.12"/>
  <defs>
    <linearGradient id="highlight" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="white"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- "T" letterform — horizontal bar + vertical stem, geometric, bold -->
  <g filter="url(#glow)">
    <!-- Horizontal bar of T -->
    <rect x="10" y="13" width="28" height="5" rx="2.5" fill="white"/>
    <!-- Vertical stem of T -->
    <rect x="21.5" y="18" width="5" height="17" rx="2.5" fill="white"/>
  </g>

  <!-- Tiny accent dot — represents the "byte" pixel motif -->
  <circle cx="38" cy="37" r="2.5" fill="white" opacity="0.35"/>
</svg>`;

const outDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'logo.svg'), svg.trim());
console.log('✓ Logo generated at public/logo.svg');
