const fs = require('fs');

const category4Data = {
  'favicon-generator.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Cross-Platform PWA & Web App Manifest Configuration',
        desc: 'Modern web applications require an exhaustive suite of icon assets: 16x16 and 32x32 .ico for desktop browser tabs, 180x180 apple-touch-icon.png for iOS home screens, and 192x192 / 512x512 PNGs declared inside manifest.json for Progressive Web Apps. Packaging these assets together ensures uniform brand presentation across mobile, tablet, and desktop ecosystems.'
      },
      {
        heading: 'Adaptive Dark Mode Vector Favicon Implementation',
        desc: 'Advanced web properties deploy scalable vector SVG favicons utilizing CSS @media (prefers-color-scheme: dark) rules. This technique dynamically alters icon stroke and fill colors to ensure high contrast against both dark-themed browser chrome and light browser tabs, eliminating washed-out tab icons.'
      },
      {
        heading: 'Enterprise Brand Asset Delivery & Release Packaging',
        desc: 'Design systems and agency teams delivering client branding packages must supply complete, production-ready favicon archives with exact HTML link tag snippets, eliminating manual resizing errors in design software.'
      }
    ],
    tableRows: [
      ['Output Packaging', 'Multi-resolution .ICO, Apple Touch Icon, Android PWA manifest icons', 'Single-size ICO or PNG only'],
      ['Rasterization Engine', 'Client-side HTML5 Canvas 2D with bicubic downsampling', 'Server-side ImageMagick processing'],
      ['Brand Confidentiality', 'High-resolution unreleased logos stay 100% in local browser memory', 'Uploaded to third-party conversion servers'],
      ['HTML Snippet Generation', 'Instant copy-ready link and meta tags tailored to generated files', 'Leaves developer to research link syntax'],
      ['Execution Speed', '< 250ms instant zip archive compilation in browser memory', '150ms - 500ms server network latency']
    ],
    pitfalls: [
      {
        title: 'Aggressive Browser Favicon Caching Frustrations',
        text: 'Web browsers cache /favicon.ico more aggressively than almost any other asset, frequently ignoring standard Cache-Control headers. When deploying updated icons, developers should append a version query string (e.g. /favicon.ico?v=2) or update the file path in HTML to force immediate browser cache invalidation.'
      },
      {
        title: 'Non-Square Source Asset Distortion',
        text: 'Favicons strictly require a 1:1 square aspect ratio. Supplying rectangular logo marks without prior padding causes rasterization engines to stretch or squash the artwork. TabKit automatically centers non-square inputs within a transparent square bounding box.'
      },
      {
        title: 'Missing Apple Touch Icon Precomposed Meta Tags',
        text: 'Older iOS Safari versions automatically applied rounded corners and a reflective gloss gradient over touch icons unless explicitly specified. Using standard apple-touch-icon.png declarations ensures iOS displays your precise brand design without artificial glossy overlays.'
      }
    ]
  },
  'color-palette-contrast.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'WCAG 2.2 AA & AAA Enterprise Accessibility Auditing',
        desc: 'Digital product teams and accessibility compliance officers verify contrast ratios between text foregrounds and background surfaces. Adhering to WCAG 2.2 Level AA (minimum 4.5:1 for regular text, 3:1 for large text) and Level AAA (7:1) is legally mandated for enterprise, government, and educational web platforms.'
      },
      {
        heading: 'Design System Semantic Token Ramp Generation',
        desc: 'Design engineers construct accessible color ramps (canvas -> surface -> elevated -> border -> accent) across light and dark modes. Generating harmonious, contrast-verified shades prevents legibility issues in complex dashboards and data tables.'
      },
      {
        heading: 'State-Dependent Interaction Contrast Verification',
        desc: 'Interactive UI components require adequate contrast across all seven states: default, hover, focus-visible, active, disabled, loading, and error. Auditing keyboard focus indicators ensures compliance with WCAG 2.4.13 Focus Appearance requirements.'
      }
    ],
    tableRows: [
      ['Contrast Standard', 'WCAG 2.1 & 2.2 Relative Luminance Formula', 'Simple RGB Euclidean distance approximation'],
      ['Color Space Precision', 'Perceptually uniform OKLCH, CIELAB, and sRGB color models', 'Basic 8-bit RGB without color space calibration'],
      ['Compliance Evaluation', 'Automated Pass/Fail badges for Normal, Large, and UI components', 'Displays raw ratio without compliance guidance'],
      ['Confidentiality', 'Proprietary brand palettes remain strictly local in browser RAM', 'Transmitted to cloud server with potential logging'],
      ['Interactive Harmony', 'Instant palette generation with complementary and split-complementary shades', 'Single-pair contrast check only']
    ],
    pitfalls: [
      {
        title: 'The APCA vs WCAG 2 Polarity Discrepancy',
        text: 'WCAG 2 calculates relative luminance symmetrically, giving identical scores whether dark text sits on light backgrounds or white text on dark surfaces. The Advanced Perceptual Contrast Algorithm (APCA) models human ocular biology, recognizing that dark backgrounds cause halation and require different contrast thresholds for equal readability.'
      },
      {
        title: 'Gradient Background Contrast Ambiguities',
        text: 'Testing text contrast against multi-color CSS gradients requires evaluating the contrast ratio at the lowest contrast coordinate along the text path rather than testing against an average color. Failing to test the worst-case background coordinate leads to hidden readability drop-offs.'
      },
      {
        title: 'Subpixel Antialiasing and Thin Typography Weights',
        text: 'Mathematical contrast formulas assume solid rasterized shapes. When thin typography (font-weight 300 or lighter) is rendered, subpixel antialiasing blends edge pixels with the background, effectively reducing real-world contrast. Always pair lighter font weights with higher contrast ratios.'
      }
    ]
  },
  'hex-color-converter.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Cross-Stack Design Token Synchronization',
        desc: 'Frontend developers translating Figma design tokens into production code convert color definitions across CSS Hex (#10b981), RGB (rgb(16, 185, 129)), HSL (hsl(161, 84%, 39%)), and modern CSS Color 4 OKLCH formats, maintaining 100% numerical parity across platforms.'
      },
      {
        heading: 'Alpha Channel Opacity Calculation & Hex Transparency',
        desc: 'Modern CSS supports 8-digit hexadecimal colors (e.g. #10b98180). Converting 8-digit hex into rgba(16, 185, 129, 0.5) with exact floating-point precision facilitates seamless opacity adjustments in Tailwind CSS custom utility classes.'
      },
      {
        heading: 'Mobile & Native Application Color Format Mapping',
        desc: 'Translating web hex codes into native platform color models—such as Android ARGB integers (0xFF10B981) or iOS SwiftUI Color(.sRGB, red:green:blue:opacity)—streamlines cross-platform mobile application development.'
      }
    ],
    tableRows: [
      ['Supported Models', 'HEX, HEXA, RGB, RGBA, HSL, HSLA, CMYK, and OKLCH', 'Basic HEX to RGB only'],
      ['Mathematical Precision', 'Lossless floating-point calculations preventing degree rounding drift', 'Frequent 1-degree hue rounding errors'],
      ['Alpha Precision', 'Full 8-digit Hex alpha channel decoding and percentage mapping', 'Ignores alpha opacity values'],
      ['Confidentiality', 'Proprietary corporate palettes remain 100% in local memory', 'Uploaded to remote web conversion APIs'],
      ['Wide Gamut Support', 'Calculates sRGB and Display P3 wide-gamut equivalents', 'Restricted to standard sRGB space']
    ],
    pitfalls: [
      {
        title: '3-Digit vs 6-Digit Hex Shorthand Expansion Rules',
        text: 'CSS shorthand hex values (e.g. #123) expand by doubling each individual character (#112233), NOT by appending trailing zeros (#123000). Misunderstanding this expansion rule results in completely wrong color values during CSS refactorings.'
      },
      {
        title: 'HSL Color Space Perceptual Non-Uniformity',
        text: 'Standard HSL is not perceptually uniform. For example, a pure yellow hue (hue 60) and pure blue hue (hue 240) sharing the exact same 50% lightness value exhibit vastly different perceived luminance to the human eye. Modern design systems recommend OKLCH for predictable visual brightness.'
      },
      {
        title: 'RGB Screen Hex to Print CMYK Gamut Clipping',
        text: 'Converting screen hex colors to CMYK for physical print collateral involves physical ink limitations. Vibrant digital RGB greens and cyans fall outside the printable CMYK gamut, resulting in muddy, desaturated print outputs unless color profiles are calibrated.'
      }
    ]
  },
  'image-compressor.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Core Web Vitals Largest Contentful Paint (LCP) Optimization',
        desc: 'E-commerce and SaaS marketing teams compress high-resolution hero banners, feature screenshots, and product catalog imagery to under 100KB without visible perceptual degradation, drastically slashing First Contentful Paint and LCP times.'
      },
      {
        heading: 'Mobile App Asset Trimming & Cellular Download Budgets',
        desc: 'Mobile application engineers compress embedded splash screens and iconography before bundling them into iOS IPA and Android APK archives, keeping initial install downloads well below app store cellular warning thresholds.'
      },
      {
        heading: 'Email Campaign HTML Newsletter Payload Reduction',
        desc: 'Email marketing specialists compress marketing headers to ensure newsletters load rapidly on low-bandwidth mobile connections, preventing recipient abandonment and preserving engagement metrics.'
      }
    ],
    tableRows: [
      ['Compression Engine', 'Client-Side HTML5 Canvas & WebAssembly WebP/JPEG encoders', 'Server-side cloud conversion queue'],
      ['Data Confidentiality', 'Personal photos and proprietary product mockups never leave your device', 'Photos uploaded to remote cloud storage with privacy risks'],
      ['Visual Quality Control', 'Interactive real-time split-screen slider comparison', 'Blind compression without preview'],
      ['Output Standards', 'Next-gen WebP, optimized JPEG, and crushed PNG formats', 'Restricted to legacy JPEG format only'],
      ['Compression Speed', 'Sub-second local processing leveraging client GPU acceleration', 'Network upload + remote queue + download time']
    ],
    pitfalls: [
      {
        title: 'Compounding Lossy Re-Compression Artifacts',
        text: 'Recompressing an image that has already been saved with heavy JPEG compression introduces cumulative Discrete Cosine Transform (DCT) blocking artifacts, pixel halos, and color banding. Always source original uncompressed master files (PNG or TIFF) when generating optimized web assets.'
      },
      {
        title: 'PNG Transparency Inversion on JPEG Export',
        text: 'JPEG format has no alpha transparency channel. When converting a transparent PNG logo to JPEG without explicit background compositing, the transparent alpha channel defaults to solid black, ruining logo presentation. TabKit composites transparent layers over clean white background buffers.'
      },
      {
        title: 'Animated GIF File Size Explosion on Canvas Export',
        text: 'Drawing an animated GIF to a standard HTML5 Canvas context extracts only the first static keyframe. To optimize multi-frame animations, modern engineering best practices mandate converting GIFs to WebM or MP4 video files, which achieve 90% size reductions.'
      }
    ]
  },
  'qr-code-generator.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Enterprise Office & Guest WiFi Instant Onboarding',
        desc: 'IT departments generate standardized WiFi onboarding QR codes (WIFI:S:NetworkName;T:WPA;P:SecretPassword;;) for conference rooms and visitor lobbies. Guests scan the code to instantly authenticate their mobile devices without typing complex passwords.'
      },
      {
        heading: 'Two-Factor Authentication (2FA) TOTP Infrastructure Testing',
        desc: 'Identity and security engineers generate custom otpauth://totp/ URI QR codes to test authenticator app registration (Google Authenticator, Authy, 1Password) during identity provider authentication flow development.'
      },
      {
        heading: 'Print Collateral & Conference Badge Digital Check-In',
        desc: 'Marketing and event coordinators generate crisp vector QR codes for physical signage, business cards (vCard), and tickets, linking attendees to digital brochures and event schedules.'
      }
    ],
    tableRows: [
      ['Error Correction Levels', 'Reed-Solomon: L (7%), M (15%), Q (25%), H (30%)', 'Fixed low-level error correction only'],
      ['Vector Export', 'Infinite-scaling SVG and high-resolution raster PNG export', 'Low-resolution 72 DPI bitmap only'],
      ['Privacy & Security', 'Confidential WiFi credentials and 2FA secrets never leave local RAM', 'Credentials uploaded and logged on remote QR servers'],
      ['Scanning Reliability', 'Strict adherence to ISO/IEC 18004 QR code dimensional standards', 'Missing quiet zones causing camera scan failures'],
      ['Customization', 'Configurable foreground/background colors and module quiet zones', 'Rigid black and white output with third-party branding']
    ],
    pitfalls: [
      {
        title: 'Insufficient Quiet Zone Margins (ISO/IEC 18004 Violation)',
        text: 'The international QR code specification strictly mandates a solid white border (quiet zone) of at least 4 module widths around the entire symbol. Cropping tight to the data modules or placing the QR code directly against busy background textures causes smartphone camera optical engines to fail boundary acquisition.'
      },
      {
        title: 'Embedding Center Logos Without High Error Correction',
        text: 'Placing a brand logo in the center of a QR code physically covers and destroys data modules. If the code was generated with low error correction (Level L, 7%), obscuring the center makes the code instantly unreadable. Always use Level H (30% redundancy) when embedding center graphics.'
      },
      {
        title: 'Light-on-Dark Color Contrast Inversion',
        text: 'While modern iOS and Android camera apps can interpret inverted QR codes (white data modules on dark backgrounds), many legacy handheld optical barcode scanners used in warehouses and retail POS systems strictly require dark modules on light backgrounds.'
      }
    ]
  },
  'social-seo-previewer.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Omnichannel Social Media Card Validation',
        desc: 'Digital marketing teams and growth engineers simulate exactly how web pages, blog posts, and landing pages render when shared across Twitter/X (summary_large_image), Facebook Open Graph, LinkedIn, Discord, and Slack, ensuring branded presentation across all platforms.'
      },
      {
        heading: 'Click-Through Rate (CTR) Headline & Metadata Tuning',
        desc: 'Content creators test title character limits (under 60 characters) and description lengths (under 155 characters) against real-time platform simulation cards to ensure marketing copy is not truncated with awkward ellipses (...).'
      },
      {
        heading: 'Social Crawling & Meta Tag Diagnostic Audits',
        desc: 'SEO specialists audit pages to verify required meta tags—such as og:image, og:image:width, og:image:height, twitter:card, and canonical URLs—are populated with absolute HTTPS links before launching public marketing campaigns.'
      }
    ],
    tableRows: [
      ['Simulated Platforms', 'Twitter / X, Facebook Open Graph, LinkedIn, Discord, Slack', 'Single platform generic card preview'],
      ['Aspect Ratio Check', 'Validates 1.91:1 (1200x630px) recommended social dimensions', 'No aspect ratio validation'],
      ['Real-Time Emulation', 'Instant live preview updating on every keystroke', 'Requires manual page refresh or server fetch'],
      ['Confidentiality', 'Unreleased product announcements stay 100% in local memory', 'Requires public URL crawled by third-party debuggers'],
      ['Tag Generator', 'Outputs copy-pasteable HTML &lt;meta&gt; tags ready for deployment', 'Preview only without tag generation']
    ],
    pitfalls: [
      {
        title: 'Persistent Social Platform Crawler Caching',
        text: 'Platforms like Facebook, LinkedIn, and Twitter aggressively cache scraped Open Graph metadata for days. Deploying updated meta tags to your server will not update existing social cards until forced via platform-specific tools like the Facebook Sharing Debugger or Twitter Card Validator.'
      },
      {
        title: 'Social Image File Size Exceeding Platform Limits',
        text: 'Facebook and Twitter automatically ignore og:image declarations if the linked image file exceeds 5MB or 8MB, falling back to a plain text link card without imagery. Keep social preview cards under 1MB for reliable worldwide delivery.'
      },
      {
        title: 'Relative URL Paths Breaking Social Crawlers',
        text: 'Social scrapers do not execute client-side JavaScript and cannot resolve relative image paths (e.g. content="/og-image.png"). All Open Graph image, URL, and audio tags strictly require absolute HTTPS URLs (e.g. content="https://example.com/og-image.png").'
      }
    ]
  },
  'svg-optimizer.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Production Web Vector & Icon Payload Optimization',
        desc: 'Front-end developers strip bloated vector editor metadata (Adobe Illustrator generator tags, Figma exported comments, Inkscape namespaces) from SVG icons, reducing vector payload sizes by 40% to 75% for faster page rendering.'
      },
      {
        heading: 'Inline SVG DOM Component Performance',
        desc: 'Cleaning SVGs before inlining them directly into React, Vue, or Svelte components eliminates useless attributes (xmlns:xlink, unused ids) and prevents SVG markup from inflating the virtual DOM memory footprint.'
      },
      {
        heading: 'Design System Vector Normalization',
        desc: 'Design technologists normalize complex path coordinate data and nested groups across icon libraries, ensuring consistent stroke widths, fill behaviors, and scaling properties across enterprise UI design systems.'
      }
    ],
    tableRows: [
      ['Optimization Engine', 'Client-Side SVGO-compliant Abstract Syntax Tree (AST) optimizer', 'Regex text replacement only'],
      ['File Size Reduction', 'Typically achieves 40% - 75% size reduction on raw editor exports', 'Minimal 5-10% whitespace removal'],
      ['Coordinate Precision', 'Configurable floating-point decimal precision (1 to 3 decimal places)', 'Fixed precision causing shape distortion'],
      ['Confidentiality', 'Proprietary vector illustrations remain 100% in local browser RAM', 'Artwork uploaded to remote optimization servers'],
      ['Safety Rules', 'Preserves viewBox attributes and responsive scaling by default', 'Prone to stripping viewBox and breaking layout']
    ],
    pitfalls: [
      {
        title: 'Over-Aggressive Decimal Precision Truncation',
        text: 'Reducing path coordinate precision from 3 decimal places down to 1 rounds curve control points aggressively, causing subtle geometric vectors and smooth curves to develop visible polygon jaggedness. Always visually inspect optimized vectors at high zoom levels.'
      },
      {
        title: 'Stripping Critical viewBox Attributes',
        text: 'Naive vector minifiers often strip the viewBox attribute in favor of fixed width and height dimensions. Removing viewBox destroys the SVG\'s ability to scale responsively with CSS (e.g. width: 100%), causing vector assets to clip or overflow on responsive viewports.'
      },
      {
        title: 'ID Attribute Collisions in Inline Web Documents',
        text: 'When multiple inline SVGs contain elements with identical ID attributes (such as id="a" or id="linear-gradient-1"), the first gradient definition in the DOM overrides all subsequent icons, causing icons to display incorrect colors. TabKit namespaces or flattens IDs.'
      }
    ]
  },
  'image-to-base64.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Above-the-Fold Critical CSS Asset Inlining',
        desc: 'Performance engineers inline small vector icons, logo marks, and WebP thumbnails directly into critical CSS files as Base64 data URIs (data:image/webp;base64,...), eliminating extra HTTP round-trips and accelerating First Contentful Paint.'
      },
      {
        heading: 'Self-Contained HTML Email & Offline Documentation',
        desc: 'Developers authoring automated email reports, PDF exports, and offline documentation bundle images directly into HTML documents as Base64 strings, ensuring all visual assets render even when external image hosting is firewalled.'
      },
      {
        heading: 'LocalStorage & IndexedDB Client-Side Image Caching',
        desc: 'Web applications storing user avatars or cached UI icons offline serialize image blobs into Base64 strings for persistence in browser LocalStorage or IndexedDB without maintaining file system handles.'
      }
    ],
    tableRows: [
      ['Format Support', 'PNG, JPEG, WebP, SVG, GIF, and ICO image formats', 'Limited to PNG or JPEG'],
      ['Output Formats', 'Raw Base64 string, CSS background-image url(), and HTML &lt;img&gt; tag', 'Raw string only'],
      ['Confidentiality', 'Proprietary design assets and confidential photos stay in RAM', 'Uploaded to remote web conversion APIs'],
      ['Execution Speed', 'Sub-millisecond local FileReader API conversion', '150ms - 400ms server network latency'],
      ['Size Diagnostics', 'Displays exact byte count and 33% encoding expansion factor', 'No size analysis provided']
    ],
    pitfalls: [
      {
        title: 'The 33% Base64 Data Expansion Overhead',
        text: 'Base64 encoding expands raw binary data by approximately 33% because 3 binary bytes are represented by 4 ASCII characters. Inlining large imagery (>50KB) inside HTML documents artificially inflates page payload size, delays DOM parsing, and degrades Core Web Vitals.'
      },
      {
        title: 'Loss of Independent Browser Asset Caching',
        text: 'When an image is embedded inside an HTML or CSS file, any minor update to the code invalidates the entire cached document, forcing the client to re-download the embedded image bytes. Standalone image files leverage separate HTTP caching.'
      },
      {
        title: 'Malformed MIME Type Prefix Corruption',
        text: 'Failing to include the precise MIME type prefix (e.g. data:image/png;base64,) before the Base64 payload prevents web browsers and CSS parsers from determining how to decode the binary stream, resulting in broken image icons.'
      }
    ]
  },
  'svg-to-png.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'High-Resolution Vector to Raster Asset Rasterization',
        desc: 'Designers and software developers convert scalable vector graphics into crisp, lossless PNGs at custom scale multipliers (1x, 2x, 4x, 8x) for marketing slide decks, print collateral, and social media banners where vector formats are unsupported.'
      },
      {
        heading: 'Legacy Software & Email Client Compatibility',
        desc: 'Enterprise email campaigns and legacy desktop software platforms frequently fail to render SVG vector graphics. Converting vector artwork to transparent PNGs ensures universal rendering across all desktop and mobile email clients.'
      },
      {
        heading: 'Retina Display & Mobile High-DPI App Icon Export',
        desc: 'Mobile application developers generate @2x and @3x raster icon assets from a single master SVG file, ensuring razor-sharp visual fidelity on high-density smartphone screens without manual recreation.'
      }
    ],
    tableRows: [
      ['Rasterization Pipeline', 'Hardware-accelerated HTML5 Canvas 2D with custom scaling', 'Server-side headless browser or ImageMagick'],
      ['Alpha Channel Support', 'Full preservation of 32-bit transparent backgrounds', 'Fills transparent backgrounds with solid black/white'],
      ['Scale Factors', 'Configurable multipliers (1x, 2x, 4x, 8x) up to 8192px resolution', 'Fixed 1x resolution export only'],
      ['Data Confidentiality', 'Proprietary vector marks remain 100% in local browser memory', 'Transmitted to cloud conversion server'],
      ['Execution Latency', 'Instant client-side canvas rasterization (< 50ms)', '150ms - 600ms network round-trip']
    ],
    pitfalls: [
      {
        title: 'Missing Root Dimensions Causing 300x150px Default Cropping',
        text: 'In HTML5 Canvas specification, drawing an SVG that lacks explicit width, height, or viewBox attributes causes browser rasterization engines to default to an arbitrary 300x150 pixel viewport, clipping artwork or rendering tiny blurry images. TabKit ensures dimensions are parsed before drawing.'
      },
      {
        title: 'Unloaded External Web Fonts Rendering as Fallback Glyphs',
        text: 'When an SVG contains text elements utilizing external web fonts (such as Google Fonts loaded via @import), drawing the SVG to a canvas before the font has fully loaded causes the canvas to render system fallback fonts (Arial or Times). Ensure fonts are preloaded.'
      },
      {
        title: 'Browser Canvas Maximum Dimension Memory Limits',
        text: 'Web browsers enforce strict limits on HTML5 canvas memory allocations (e.g. iOS Safari limits canvas dimensions to 16,384 x 16,384 pixels or total pixel memory limits). Attempting to export at 16x scale on a large vector will throw an out-of-memory exception.'
      }
    ]
  }
};

function generateHtml(data) {
  let html = `\n      <!-- Enterprise Technical Architecture & Deep Dive -->
      <div data-enriched="true" class="border-t border-workspace-border pt-10 space-y-8">
        <div>
          <h2 class="text-xl font-bold text-white mb-3">${data.title}</h2>
          <p class="text-sm text-workspace-muted leading-relaxed">
            Engineered for high-throughput production environments, enterprise developer workflows, and compliance-sensitive operations. Below is an exhaustive technical reference covering architecture, execution parameters, and edge-case behaviors.
          </p>
        </div>

        <!-- Production Use Cases -->
        <div>
          <h3 class="text-base font-bold text-white mb-4">Enterprise & Production Use Cases</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
`;

  data.useCases.forEach(uc => {
    html += `            <div class="p-4 rounded-xl border border-workspace-border bg-workspace-surface/50 flex flex-col justify-between">
              <h4 class="text-sm font-bold text-workspace-text mb-2">${uc.heading}</h4>
              <p class="text-xs text-workspace-muted leading-relaxed">${uc.desc}</p>
            </div>\n`;
  });

  html += `          </div>
        </div>

        <!-- Technical Architecture Comparison -->
        <div>
          <h3 class="text-base font-bold text-white mb-3">Architectural Comparison: Client-Side Engine vs Cloud Processing</h3>
          <div class="overflow-x-auto my-4">
            <table class="w-full text-left text-xs font-mono border border-workspace-border rounded-xl overflow-hidden">
              <thead class="bg-workspace-surface border-b border-workspace-border text-workspace-text">
                <tr>
                  <th class="p-3">Evaluation Parameter</th>
                  <th class="p-3 text-workspace-accent">TabKit In-Browser Engine</th>
                  <th class="p-3 text-workspace-muted">Traditional Cloud Service</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-workspace-border text-workspace-muted">
`;

  data.tableRows.forEach(row => {
    html += `                <tr>
                  <td class="p-3 font-semibold text-workspace-text">${row[0]}</td>
                  <td class="p-3 text-workspace-accent font-medium">${row[1]}</td>
                  <td class="p-3">${row[2]}</td>
                </tr>\n`;
  });

  html += `              </tbody>
            </table>
          </div>
        </div>

        <!-- Pitfalls & Troubleshooting -->
        <div>
          <h3 class="text-base font-bold text-white mb-3">Common Pitfalls & Engineering Troubleshooting</h3>
          <div class="space-y-3">
`;

  data.pitfalls.forEach(pf => {
    html += `            <div class="p-4 rounded-xl border border-workspace-border bg-workspace-surface/40">
              <h4 class="text-sm font-semibold text-workspace-text mb-1">${pf.title}</h4>
              <p class="text-xs text-workspace-muted leading-relaxed">${pf.text}</p>
            </div>\n`;
  });

  html += `          </div>
        </div>
      </div>\n`;

  return html;
}

function processFiles() {
  console.log('Enriching Category 4: Media & Design (9 tools)...');
  for (const [file, data] of Object.entries(category4Data)) {
    if (!fs.existsSync(file)) {
      console.warn('File not found:', file);
      continue;
    }

    let content = fs.readFileSync(file, 'utf8');

    // If already enriched, remove previous enrichment block first
    if (content.includes('data-enriched="true"')) {
      content = content.replace(/<!-- Enterprise Technical Architecture & Deep Dive -->[\s\S]*?<\/table>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '');
      content = content.replace(/<div data-enriched="true"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '');
    }

    const generated = generateHtml(data);

    // Insertion target: Before Related Tools, or before </article>
    if (content.includes('<!-- Related Tools -->')) {
      content = content.replace('<!-- Related Tools -->', `${generated}\n      <!-- Related Tools -->`);
    } else if (content.includes('<div class="border-t border-workspace-border pt-8">')) {
      content = content.replace('<div class="border-t border-workspace-border pt-8">', `${generated}\n      <div class="border-t border-workspace-border pt-8">`);
    } else {
      content = content.replace('</article>', `${generated}\n    </article>`);
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Enriched ${file}`);
  }
}

processFiles();
