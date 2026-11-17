const fs = require('fs');

const category5Data = {
  'invoice-generator.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Freelance & Agency Billing Compliance',
        desc: 'Consultants, software contractors, and digital agencies generate professional, itemized commercial invoices complete with tax registration IDs (VAT, GST, EIN), sequential numbering, custom payment terms (Net 15, Net 30), and international bank wire routing instructions (IBAN, SWIFT).'
      },
      {
        heading: 'Privacy-Preserving Confidential Financial Billing',
        desc: 'Generating invoices inside client browser memory eliminates the risk of transmitting customer names, physical addresses, confidential project hourly rates, and banking details to external cloud accounting platforms, maintaining full GDPR and CCPA compliance.'
      },
      {
        heading: 'Vector-Crisp Direct Print & PDF Export',
        desc: 'Utilizing print-optimized CSS rules (@media print), invoices render as pixel-perfect, vector-sharp PDF documents directly from the browser print dialog without subscription paywalls, third-party watermarks, or branding logos.'
      }
    ],
    tableRows: [
      ['Calculation Precision', 'High-precision decimal arithmetic eliminating IEEE 754 roundoff errors', 'Naive floating-point arithmetic causing cent discrepancies'],
      ['Tax & Discount Logic', 'Supports percentage discounts, compound taxes, and multiple tax rates', 'Single flat tax rate or no discount calculations'],
      ['Data Confidentiality', 'Client billing details and bank info stay 100% in local memory', 'Uploaded to third-party servers with retention risks'],
      ['PDF Generation', 'Native browser vector print engine with print CSS formatting', 'Low-resolution rasterized PDF with watermarks'],
      ['Currency Flexibility', 'Customizable currency symbols ($ USD, € EUR, £ GBP, ¥ JPY, etc.)', 'Hardcoded to single currency']
    ],
    pitfalls: [
      {
        title: 'Binary Floating-Point Currency Rounding Errors',
        text: 'In standard JavaScript, binary floating-point representation causes calculations like 0.1 + 0.2 to evaluate to 0.30000000000000004. In financial invoices, multiplying unit prices by quantities can introduce fractional cents that propagate into incorrect subtotals and tax amounts. TabKit rounds each calculation step to 2 decimal places.'
      },
      {
        title: 'Statutory Invoice Compliance Mandates (VAT/GST)',
        text: 'In jurisdictions such as the European Union, the United Kingdom (HMRC), and Australia (ATO), invoices must include specific mandatory fields: unique sequential invoice numbers, supplier tax identification number, tax date, and clear currency disclosures. Omitting these invalidates invoices for corporate tax deductions.'
      },
      {
        title: 'Print CSS Page-Break Table Severing',
        text: 'When printing multi-item invoices, naive print stylesheets can slice an item row in half across the bottom of a page. TabKit applies CSS break-inside: avoid to table rows and invoice totals to ensure clean page breaks.'
      }
    ]
  },
  'excel-shortcuts.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Financial Modeling & Investment Banking Speed',
        desc: 'Financial analysts and investment bankers rely on keyboard shortcuts (such as F2 to edit cells, Ctrl + [ to trace precedent formulas, and Alt + = for instant AutoSum) to build and audit multi-statement models without touching the mouse, doubling modeling velocity.'
      },
      {
        heading: 'Cross-Platform Operating System Mapping (Windows vs macOS)',
        desc: 'Engineers and financial professionals switching between Windows and macOS must navigate substantial keyboard mapping discrepancies (Ctrl vs Cmd, Alt vs Option). Interactive shortcut matrices translate muscle memory smoothly across operating systems.'
      },
      {
        heading: 'Large Dataset Navigation & Range Selection',
        desc: 'Navigating multi-thousand row spreadsheets efficiently requires mastering directional jumps (Ctrl + Arrow Keys) and bulk range expansions (Ctrl + Shift + Arrow Keys), eliminating slow, error-prone mouse dragging.'
      }
    ],
    tableRows: [
      ['Platform Mapping', 'Interactive simultaneous Windows and macOS keyboard mapping', 'Windows-only shortcuts without Mac equivalents'],
      ['Categorization', 'Navigation, Formula Auditing, Cell Formatting, and Table Operations', 'Unorganized plain text list'],
      ['Visual Keycaps', 'Styled high-contrast keyboard key representations', 'Plain text descriptions'],
      ['Search & Filtering', 'Instant client-side shortcut search by action or key combination', 'Requires manual scrolling'],
      ['Offline Availability', 'Complete shortcut cheat sheet accessible 100% offline via PWA', 'Requires active web connection']
    ],
    pitfalls: [
      {
        title: 'macOS Global System Shortcut Interception',
        text: 'macOS reserves key combinations like F3 (Mission Control) and Cmd + Space (Spotlight). In macOS Excel, these global shortcuts take precedence unless users configure the "Use F1, F2, etc. keys as standard function keys" toggle in macOS System Settings.'
      },
      {
        title: 'Windows Alt-Key Ribbon Navigation vs macOS Menu Bars',
        text: 'On Windows, pressing the Alt key displays ribbon key tips (e.g. Alt + H + O + I to auto-fit columns). On macOS, the ribbon shortcut system does not exist; equivalent formatting commands require dedicated custom keyboard shortcuts.'
      },
      {
        title: 'Compact Laptop Keyboards Lacking Dedicated Number Pads',
        text: 'Shortcuts designed for full-size desktop keyboards (such as Ctrl + NumPad Enter) require the Fn key or alternative key combinations on compact laptops (such as MacBooks or Dell XPS) that omit numeric keypads.'
      }
    ]
  },
  'date-calculator.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Project Management Sprint & Milestone Scheduling',
        desc: 'Technical program managers and scrum masters calculate exact calendar durations and business workdays (excluding weekends) between milestone kickoffs and release targets to plan realistic sprint capacities.'
      },
      {
        heading: 'Legal Contract Windows & Statutory Notice Periods',
        desc: 'Legal counsel and contract managers determine precise notice deadlines (such as "within 90 calendar days" or "10 business days prior to renewal") for commercial contracts, lease options, and warranty windows.'
      },
      {
        heading: 'SLA Uptime & Support Resolution Measurement',
        desc: 'Operations and customer support teams compute resolution windows and SLA compliance thresholds down to exact days, hours, and minutes for customer incident post-mortems.'
      }
    ],
    tableRows: [
      ['Calculation Modes', 'Days between dates, Add/Subtract duration, and Business Days', 'Basic days between dates only'],
      ['Calendar Standards', 'Gregorian calendar with full astronomical leap year logic', 'Naive 365-day math ignoring leap years'],
      ['Daylight Saving Safety', 'Calculates calendar spans independent of DST clock shifts', 'Vulnerable to 1-hour daylight saving drift'],
      ['Confidentiality', 'Sensitive milestone dates and legal timelines stay in local memory', 'Date queries transmitted to cloud servers'],
      ['Output Granularity', 'Displays elapsed time in total days, weeks, months, and business days', 'Single total days integer only']
    ],
    pitfalls: [
      {
        title: 'Daylight Saving Time (DST) 23-Hour and 25-Hour Day Calculations',
        text: 'Calculating date differences by dividing millisecond timestamps by 86,400,000 (24 hours) produces fractional results (e.g. 1.04 or 0.96 days) on dates when clocks shift for Daylight Saving Time. TabKit operates on calendar date components directly to ensure whole integer day counts.'
      },
      {
        title: 'The Astronomical Gregorian Leap Year Century Exception',
        text: 'While years divisible by 4 are leap years, years divisible by 100 are NOT leap years UNLESS they are also divisible by 400 (for example, the year 2000 was a leap year, but 1900 was not, and 2100 will not be). TabKit incorporates complete Gregorian astronomical leap rules.'
      },
      {
        title: 'Inclusive vs Exclusive Boundary Counting Discrepancies',
        text: 'In legal and project management contexts, whether both the start date and end date are counted (inclusive, +1 day) or only the elapsed time between them (exclusive) is a frequent source of dispute. Always specify your counting methodology.'
      }
    ]
  },
  'percentage-calculator.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'E-Commerce Margin, Markup & Discount Modeling',
        desc: 'Retail analysts and e-commerce operators compute gross profit margins ((Revenue - Cost) / Revenue), retail markups ((Price - Cost) / Cost), and multi-tier promotional discounts on product catalogs to maintain profitability.'
      },
      {
        heading: 'Financial Performance & Revenue Growth Analysis',
        desc: 'Financial analysts compute quarter-over-quarter percentage increases, inflation adjustments, and annual recurring revenue (ARR) variance to evaluate corporate performance metrics.'
      },
      {
        heading: 'A/B Test Conversion Rate Lift & Statistical Metrics',
        desc: 'Growth marketers and product managers calculate relative percentage increases between conversion rates in experiment variants to determine winning UI treatments.'
      }
    ],
    tableRows: [
      ['Calculation Types', 'Percentage of value, Percentage Change, Reverse Percentage, Margin vs Markup', 'Basic "X% of Y" only'],
      ['Mathematical Precision', 'High-precision decimal calculations with configurable rounding', 'Truncates decimal results causing inaccuracy'],
      ['Formula Transparency', 'Step-by-step algebraic breakdown of every calculation', 'Displays raw answer without explanation'],
      ['Confidentiality', 'Proprietary financial revenues and margin goals remain strictly in RAM', 'Transmitted over network or saved in server logs'],
      ['Real-Time Evaluation', 'Calculates results instantaneously on every keystroke', 'Requires manual button submission']
    ],
    pitfalls: [
      {
        title: 'The Dangerous Profit Margin vs Markup Confusion',
        text: 'A 50% markup on a $100 cost produces a $150 selling price, which represents a 33.3% gross profit margin. Conflating margin with markup is one of the most common causes of negative profitability in retail and consulting pricing.'
      },
      {
        title: 'Asymmetric Compounding of Percentage Losses and Gains',
        text: 'A 20% loss followed by a 20% gain does not return to the original value: $100 drops by 20% to $80, and $80 increases by 20% to $96 (a net 4% loss). Recovering from a 50% drop requires a 100% gain.'
      },
      {
        title: 'Percentage Points vs Relative Percentage Change Discrepancy',
        text: 'Moving an interest rate from 10% to 12% is an increase of 2 percentage points, but a 20% relative percentage increase. Conflating these two distinct metrics creates misleading statistical conclusions.'
      }
    ]
  },
  'pomodoro-timer.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Deep Work & Cognitive Fatigue Mitigation',
        desc: 'Software developers, writers, and knowledge workers structure intense 25-minute focus intervals separated by 5-minute cognitive breaks to maintain high mental stamina and prevent burnout during complex coding sprints.'
      },
      {
        heading: 'Sprint Task Estimation & Velocity Calibration',
        desc: 'Engineers track elapsed Pomodoro intervals per user story to calibrate story point estimation accuracy and understand the true time investment required for complex features.'
      },
      {
        heading: 'ADHD Support & Procrastination Overcoming',
        desc: 'Individuals struggling with executive dysfunction utilize bounded, structured work blocks to overcome initial task friction without feeling overwhelmed by open-ended work days.'
      }
    ],
    tableRows: [
      ['Timer Engine', 'Self-correcting wall-clock timestamp comparison (performance.now)', 'Naive setInterval throttled by browser background tabs'],
      ['Audio Synthesis', 'Browser-native Web Audio API synthesized chimes (no audio asset load)', 'External MP3 audio files failing on network lag'],
      ['Desktop Alerts', 'HTML5 Desktop Notifications with sound fallback', 'In-page text alert only'],
      ['Privacy & Storage', 'Session history and focus streaks saved in local IndexedDB/LocalStorage', 'Activity telemetry tracked by third-party servers'],
      ['Customization', 'Adjustable work intervals, short breaks, and long breaks with cycle counts', 'Rigid unchangeable 25/5 intervals']
    ],
    pitfalls: [
      {
        title: 'Background Tab Timer Throttling in Modern Browsers',
        text: 'To conserve battery, modern browsers (Chrome, Safari, Edge) aggressively throttle setInterval and setTimeout in inactive background tabs to fire only once per second or once per minute. Timers relying on naive counter increments lose minutes. TabKit synchronizes against system wall-clock timestamps to maintain millisecond precision.'
      },
      {
        title: 'Audio Autoplay Policy Restrictions',
        text: 'Web browsers block automated audio playback unless the user has actively interacted with the page during the session. If a user starts a timer without audio permission, alarms may fail to sound. TabKit initializes audio contexts on the initial user click.'
      },
      {
        title: 'Breaking Flow States with Inflexible Intervals',
        text: 'Forcing an arbitrary break in the middle of a complex algorithmic flow state can destroy focus. When in deep flow, extend intervals dynamically and take longer breaks later.'
      }
    ]
  },
  'random-name-picker.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Agile Scrum Standup & Retrospective Moderation',
        desc: 'Scrum masters and engineering team leads randomly select speaker order in daily standup meetings and retrospective discussions to promote engagement and eliminate speaking hierarchy biases.'
      },
      {
        heading: 'Verifiable Giveaway & Community Raffle Drawings',
        desc: 'Community managers conduct transparent, unbiased drawings for webinar prizes, conference ticket giveaways, and community contests with provable randomness.'
      },
      {
        heading: 'Fair Code Review & On-Call Rotation Distribution',
        desc: 'Engineering teams select random code reviewers from active contributor pools to distribute review workloads evenly across senior and junior team members.'
      }
    ],
    tableRows: [
      ['Randomness Source', 'Cryptographically secure window.crypto.getRandomValues() CSPRNG', 'Predictable pseudo-random Math.random()'],
      ['Draw Modes', 'With Replacement (items can repeat) & Without Replacement (elimination)', 'Single draw mode only'],
      ['Animation & Sound', 'Interactive visual wheel spin and winner celebration display', 'Plain text output without visual feedback'],
      ['Confidentiality', 'Employee rosters and customer lists remain 100% in local browser RAM', 'Names uploaded to third-party raffle websites'],
      ['List Management', 'Bulk paste, local storage persistence, and export of winning records', 'Requires manual re-entry on page refresh']
    ],
    pitfalls: [
      {
        title: 'Pseudo-Random Math.random() Clustering Artifacts',
        text: 'Standard JavaScript Math.random() uses PRNG algorithms (such as xorshift128+) that are deterministic and can produce perceptible clustering over small sample sizes. TabKit uses the browser\'s cryptographic random number generator to guarantee uniform mathematical probability.'
      },
      {
        title: 'Duplicate Name Ambiguities in Participant Pools',
        text: 'If a participant list contains common names (e.g. multiple "Alex" entries), selecting without index numbers creates confusion over who won. TabKit assigns unique line identifiers to distinguish duplicate entries.'
      },
      {
        title: 'Accidental Re-Selection in Elimination Draws',
        text: 'In multi-prize raffles, failing to remove winning names from the active drawing pool allows a single participant to win multiple times. TabKit provides an instant "Remove Winner from Pool" toggle.'
      }
    ]
  },
  'time-zone-converter.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Global Distributed Team Meeting Scheduling',
        desc: 'Engineering team leads coordinate sprint syncs across time zones (e.g. San Francisco PST, London GMT, Dubai GST, Singapore SGT) to find overlapping business hours without scheduling anyone at midnight.'
      },
      {
        heading: 'Synchronized Worldwide Product Launches',
        desc: 'Product marketing and release engineering teams set synchronized deployment times for major software updates, webinars, and embargoed announcements across global markets.'
      },
      {
        heading: 'Incident Post-Mortem Multi-Region Log Correlation',
        desc: 'Site Reliability Engineers (SREs) align server logs recorded in UTC with customer incident timestamps recorded in regional local times during outage investigations.'
      }
    ],
    tableRows: [
      ['Timezone Database', 'Complete IANA Time Zone Database (TZDB) standard coverage', 'Limited hardcoded time zones'],
      ['Daylight Saving Transitions', 'Automated historical and future DST shift calculations', 'Static offsets failing during DST transitions'],
      ['Format Options', '12-Hour AM/PM, 24-Hour Military, and ISO 8601 UTC offsets', 'Single display format only'],
      ['Privacy & Security', 'Meeting details and working hours stay 100% in local browser memory', 'Uploaded to calendar synchronization servers'],
      ['Fractional Timezones', 'Full support for half-hour (UTC+5:30) and 45-minute (UTC+5:45) zones', 'Rounds all timezones to nearest whole hour']
    ],
    pitfalls: [
      {
        title: 'Non-Synchronous Regional Daylight Saving Transitions',
        text: 'The United States switches to Daylight Saving Time on the second Sunday of March, while European countries transition on the last Sunday of March. During these three intervening weeks, the time difference between New York and London shrinks from 5 hours to 4 hours. Hardcoded offsets cause missed meetings.'
      },
      {
        title: 'Half-Hour and 45-Minute Fractional Timezone Blindspots',
        text: 'Not all time zones are whole-hour offsets from UTC. For example, India is UTC+05:30, Iran is UTC+03:30, and Nepal is UTC+05:45. Basic timezone tools that only permit whole-hour adjustments generate significant scheduling errors in these regions.'
      },
      {
        title: 'International Date Line Calendar Day Crossing',
        text: 'Scheduling a morning meeting in Tokyo with colleagues in California means the US participant must attend the previous afternoon. Failing to track the calendar day component causes participants to show up on the wrong day.'
      }
    ]
  },
  'unit-converter.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Cross-Disciplinary Scientific & Engineering Calculations',
        desc: 'Mechanical, civil, and aerospace engineers convert units across metric (SI) and imperial systems (Length, Mass, Pressure, Temperature, Energy, Power, Velocity, Flow) for technical specifications and CAD models.'
      },
      {
        heading: 'International E-Commerce Packaging & Shipping Compliance',
        desc: 'Logistics coordinators convert package dimensions and weights between kilograms/grams and pounds/ounces to ensure compliance with international air carrier rate tables (FedEx, DHL, UPS).'
      },
      {
        heading: 'Cloud Infrastructure & Memory Storage Provisioning',
        desc: 'DevOps engineers convert storage allocations between decimal SI units (Kilobytes = 1,000 bytes) and binary IEC units (Kibibytes = 1,024 bytes) when provisioning cloud volumes and container memory limits.'
      }
    ],
    tableRows: [
      ['Conversion Accuracy', 'High-precision IEEE 754 floating-point with rational fractions', 'Approximated values with severe rounding errors'],
      ['Unit Coverage', '10+ Engineering domains covering 80+ international unit standards', 'Basic length and weight only'],
      ['Real-Time Calculation', 'Instant simultaneous conversion across all related units as you type', 'Requires manual dropdown selection and button submit'],
      ['Confidentiality', 'Proprietary engineering dimensions remain 100% in local memory', 'Calculation inputs logged on third-party servers'],
      ['Binary Storage Support', 'Distinguishes decimal SI (KB/MB/GB) from binary IEC (KiB/MiB/GiB)', 'Conflates 1,000 bytes with 1,024 bytes']
    ],
    pitfalls: [
      {
        title: 'Decimal (SI) vs Binary (IEC) Data Storage Discrepancies',
        text: 'Hard drive manufacturers define a Terabyte as 10^12 bytes (1,000,000,000,000 bytes), whereas computer operating systems historically calculate gigabytes using powers of 2 (2^30 = 1,073,741,824 bytes). This causes a 1TB drive to display as ~931 GiB in Windows, confusing non-technical users.'
      },
      {
        title: 'Temperature Non-Linear Affine Transformation Errors',
        text: 'Unlike length or weight conversions that use simple proportional multiplication (y = a * x), temperature conversions involve an additive offset (Fahrenheit = Celsius * 1.8 + 32; Kelvin = Celsius + 273.15). Using naive proportional math produces completely incorrect temperature values.'
      },
      {
        title: 'US Customary vs UK Imperial Liquid Volume Incompatibilities',
        text: 'A US liquid gallon is 3.785 liters (128 US fluid ounces), whereas a British Imperial gallon is 4.546 liters (160 Imperial fluid ounces). Mixing US and UK liquid volume units creates a 20% measurement discrepancy.'
      }
    ]
  },
  'uuid-generator.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Distributed Database Primary Key Generation',
        desc: 'Software architects generate collision-resistant Universally Unique Identifiers (UUIDv4) for distributed databases (PostgreSQL, MongoDB, CockroachDB) where centralized auto-incrementing integer sequences create high-concurrency write bottlenecks.'
      },
      {
        heading: 'Financial Payment Idempotency Key Creation',
        desc: 'Engineers constructing API requests for payment processors (Stripe, Adyen, PayPal) generate unique UUIDs for Idempotency-Key HTTP headers to guarantee that retrying network requests will not cause duplicate customer charges.'
      },
      {
        heading: 'Distributed Microservice Tracing & Correlation IDs',
        desc: 'DevOps engineers tag incoming API requests with unique correlation IDs (X-Correlation-ID) across distributed microservice architectures (OpenTelemetry, Zipkin) to trace requests through complex service meshes.'
      }
    ],
    tableRows: [
      ['Specification Standard', 'RFC 4122 & RFC 9562 Version 4 (Random) & Version 7 (Time-Ordered)', 'Non-standard random hex generator'],
      ['Entropy Source', 'Cryptographically secure window.crypto.getRandomValues() CSPRNG', 'Predictable pseudo-random Math.random()'],
      ['Collision Probability', '122 bits of entropy; collision probability is less than 1 in a billion billion', 'High collision probability in concurrent systems'],
      ['Formatting Options', 'Uppercase, lowercase, hyphenated, and stripped formats with bulk generation', 'Single format output only'],
      ['Confidentiality', 'Generated keys never leave local browser memory', 'Keys logged on remote generation servers']
    ],
    pitfalls: [
      {
        title: 'Generating UUIDs with Pseudo-Random Math.random()',
        text: 'Many online code snippets construct UUIDs using Math.random(). Because Math.random() is deterministic and has limited internal state entropy, generating UUIDs in concurrent serverless or client environments will inevitably cause catastrophic primary key collisions. TabKit strictly uses cryptographic hardware entropy.'
      },
      {
        title: 'Database B-Tree Index Fragmentation with Random UUIDv4',
        text: 'Inserting completely random UUIDv4 keys into relational database B-tree indexes (PostgreSQL, MySQL InnoDB) causes severe page splitting and random disk I/O because new keys are scattered across the entire index. Modern high-write systems recommend time-ordered UUIDv7.'
      },
      {
        title: 'Stripping Hyphens Causing Parser Incompatibilities',
        text: 'While stripping hyphens produces a compact 32-character hexadecimal string, standard RFC 4122 database drivers and validator libraries strictly expect the canonical 8-4-4-4-12 hyphenated format (e.g. 123e4567-e89b-12d3-a456-426614174000).'
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
  console.log('Enriching Category 5: Productivity & Math (9 tools)...');
  for (const [file, data] of Object.entries(category5Data)) {
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
