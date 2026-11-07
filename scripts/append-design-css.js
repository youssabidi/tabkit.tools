const fs = require('fs');

const extraCss = `

/* ==================== TABKIT AGENCY-GRADE DESIGN ENGINE ==================== */
:root {
  --spring-snappy: cubic-bezier(0.16, 1, 0.3, 1);
  --spring-bouncy: cubic-bezier(0.34, 1.56, 0.64, 1);
  --spotlight-color: rgba(6, 182, 212, 0.15);
  --card-highlight: inset 0 1px 0 0 rgba(255, 255, 255, 0.12);
}

/* Tactile Click Micro-Compression (Emil Kowalski standard) */
.btn-tactile {
  transition: transform 0.12s var(--spring-snappy), background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}
.btn-tactile:active {
  transform: scale(0.97) !important;
}

/* Specular Card Highlight (1px top inner specular highlight for deep elevation) */
.card-specular {
  box-shadow: var(--card-highlight), 0 4px 20px -2px rgba(0, 0, 0, 0.4);
}

/* Dynamic Spotlight Border (Aceternity / Linear pattern) */
.spotlight-card {
  position: relative;
  overflow: hidden;
  --mouse-x: -999px;
  --mouse-y: -999px;
}
.spotlight-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: radial-gradient(380px circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 1;
}
.spotlight-card:hover::before {
  opacity: 1;
}
.spotlight-card > * {
  position: relative;
  z-index: 2;
}

/* Tabular figures for telemetry & numbers */
.tabular-nums {
  font-variant-numeric: tabular-nums;
}

/* macOS / Linear Segmented sliding pill tabs */
.tab-pill-active {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.15);
}

/* Air-Gap Live Pulsating Dot */
@keyframes radarPing {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.6); opacity: 0; }
  100% { transform: scale(0.95); opacity: 0; }
}
.radar-ping {
  animation: radarPing 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Reduced motion accessibility guard */
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .spotlight-card::before {
    display: none !important;
  }
}
`;

fs.appendFileSync('styles.css', extraCss, 'utf8');
console.log('Appended agency-grade design engine CSS successfully!');
