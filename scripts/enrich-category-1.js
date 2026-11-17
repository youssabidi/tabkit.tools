const fs = require('fs');

const category1Data = {
  'base64-encoder-decoder.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Data URI Inlining for Web Assets & SVG Icons',
        desc: 'Front-end performance optimization often requires inlining small vector icons, WebP thumbnails, and critical fonts directly into CSS stylesheets or HTML markup. Encoding binary assets into Base64 data URIs (e.g. data:image/svg+xml;base64,...) eliminates extra HTTP request round-trips, reduces DNS lookups, and prevents layout shift (CLS) during initial render of critical above-the-fold content.'
      },
      {
        heading: 'HTTP Basic Authentication & Authorization Headers',
        desc: 'Modern REST and GraphQL APIs frequently use HTTP Basic Auth (RFC 7617) for internal microservice communication and webhooks. Developers must concatenate username and password with a colon (username:password) and encode the resulting string into Base64 for the Authorization header. Conducting this encoding in-browser prevents confidential service credentials from entering third-party server access logs.'
      },
      {
        heading: 'Binary Transport Over Text-Only Protocols',
        desc: 'Legacy message queues, SMTP email MIME attachments (RFC 2045), and raw JSON payloads are fundamentally restricted to 7-bit or 8-bit ASCII characters. Base64 bridges the gap by safely packing arbitrary binary blobs—such as compiled binaries, cryptographic certificates, or compressed gzip archives—into ASCII-safe strings that traverse firewalls, mail transfer agents, and proxies without truncation or encoding corruption.'
      }
    ],
    tableRows: [
      ['Execution Environment', 'Client-Side V8 / JavaScript Engine', 'Remote Cloud Proxy / API Gateway'],
      ['Credential Leak Risk', 'Zero: No network egress or packet transmission', 'High: Logged in web server access logs & traces'],
      ['Unicode / Multi-byte Support', 'RFC 4648 with UTF-8 byte serialization', 'Dependent on server default encoding'],
      ['Network Latency', '0ms instant execution (offline capable)', '150ms - 600ms HTTP round-trip latency'],
      ['Payload Size Limit', 'Browser memory limits (~50MB+ comfortably)', 'Strict HTTP POST payload limits (e.g. 4MB/10MB)']
    ],
    pitfalls: [
      {
        title: 'UTF-8 Multi-byte Character Corruption',
        text: 'The standard browser window.btoa() function was originally designed for 8-bit Latin1 character sequences (0x00 to 0xFF). Attempting to encode multi-byte Unicode strings—such as international typography, Cyrillic, Kanji, or emojis—throws an uncaught InvalidCharacterError exception. TabKit pre-serializes strings through an encodeURIComponent UTF-8 pipeline before binary conversion, ensuring 100% loss-free representation.'
      },
      {
        title: 'Base64 vs Base64URL Format Conflicts',
        text: 'Standard Base64 utilizes the plus sign (+) and forward slash (/), which carry special syntactic meanings in URL query parameters, REST route segments, and JSON Web Token (JWT) signatures. Base64URL (RFC 4648 §5) swaps these with hyphen (-) and underscore (_), while stripping trailing equal (=) padding characters. Be careful to verify which variant your consuming API expects.'
      },
      {
        title: '33% Data Expansion Overhead',
        text: 'Base64 converts 3 bytes of raw binary data into 4 ASCII characters, incurring an unavoidable 33% increase in data volume. Avoid Base64-encoding massive assets (>10MB) inside JSON payloads when binary multipart form-data or direct S3 presigned URL uploads are available.'
      }
    ]
  },
  'exif-metadata-stripper.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Source Protection & Investigative Journalism',
        desc: 'Reporters, whistleblowers, and human rights investigators frequently handle photos taken in sensitive or hostile environments. Modern smartphones automatically embed exact GPS latitude, longitude, altitude, and device hardware IDs into image files. Stripping this metadata locally before publishing or distributing documents is critical to preventing physical location tracking and protecting informant safety.'
      },
      {
        heading: 'Marketplace & Real Estate Listing Sanitization',
        desc: 'Platforms accepting user-generated media (such as classified ad boards, real estate listings, and peer-to-peer marketplaces) must strip EXIF data to prevent buyer/seller privacy violations. If photos taken inside private residences retain GPS metadata, malicious actors can extract the exact home address of users who believed their personal information was private.'
      },
      {
        heading: 'GDPR, CCPA & Privacy Regulatory Compliance',
        desc: 'Under European GDPR and California CCPA regulations, embedded GPS coordinates, camera serial numbers, and capture timestamps qualify as Personally Identifiable Information (PII). Organizations processing customer identification photos or warranty claim uploads must sanitize images to maintain audit-ready compliance and prevent inadvertent PII storage.'
      }
    ],
    tableRows: [
      ['Processing Pipeline', 'HTML5 Canvas 2D Re-rasterization (Offline)', 'Server-side ImageMagick / ExifTool cloud API'],
      ['File Upload Requirement', 'Never leaves local device memory', 'Requires uploading unencrypted photos to server'],
      ['Metadata Stripped', 'GPS, Camera Model, Shutter Count, Timestamps', 'Configurable by server command-line flags'],
      ['Processing Speed', 'Instant local blob generation (10-50ms)', 'Network upload + remote queue + download time'],
      ['Confidentiality', '100% Client-Side memory sandbox', 'Subject to cloud host security & privacy terms']
    ],
    pitfalls: [
      {
        title: 'Orientation Metadata (EXIF Tag 0x0112) Inversion',
        text: 'Smartphones frequently record portrait photos in landscape orientation physically on the camera sensor, relying on EXIF orientation flag 0x0112 to instruct image viewers how to rotate the display. Naively stripping metadata without re-orienting the pixel matrix causes images to appear upside-down or sideways. TabKit draws the image to an HTML5 canvas respecting hardware rotation before exporting clean pixels.'
      },
      {
        title: 'Color Space & Display P3 Profile Shifts',
        text: 'Modern mobile devices capture imagery using wide-gamut Display P3 color profiles. When rendering to a standard sRGB canvas context without explicit color space management, slight color shifts or desaturation can occur. TabKit preserves visual fidelity by adhering to standard browser color matching standards.'
      },
      {
        title: 'Lossless vs Lossy Re-encoding',
        text: 'Stripping EXIF headers from JPEG files via canvas re-encoding involves recompressing the DCT coefficients. While visually indistinguishable at quality 0.92+, it is technically a lossy transformation. For bit-exact pixel preservation in scientific imaging, binary marker byte slicing is required.'
      }
    ]
  },
  'secure-password-generator.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Database & Infrastructure Credential Provisioning',
        desc: 'DevOps and cloud infrastructure engineers routinely configure administrative passwords for PostgreSQL databases, Redis clusters, Kubernetes secret manifests, and root SSH access. Generating high-entropy, cryptographically randomized credentials entirely client-side eliminates the risk of secrets leaking into web server logs, proxy access trails, or cloud provider telemetry.'
      },
      {
        heading: 'CI/CD Service Account & API Token Creation',
        desc: 'Modern continuous delivery pipelines require isolated service tokens for GitHub Actions, Terraform Cloud, and Docker registry authentications. Using automated client-side password generation ensures service accounts obtain mathematically distinct, 32+ character secrets with zero cross-system duplication.'
      },
      {
        heading: 'NIST SP 800-63B Compliant Enterprise Onboarding',
        desc: 'Enterprise security policies following National Institute of Standards and Technology (NIST) guidelines emphasize password length and entropy over arbitrary character composition rules. This generator enables users to generate memorable 4-word passphrases or 24-character high-entropy strings that satisfy enterprise single sign-on (SSO) and IAM requirements.'
      }
    ],
    tableRows: [
      ['Randomness Source', 'window.crypto.getRandomValues() (CSPRNG)', 'Math.random() pseudo-random number generator'],
      ['Entropy Quality', 'Hardware entropy (OS /dev/urandom & BCrypt)', 'Deterministic seed; predictable after output sampling'],
      ['Network Footprint', '0 bytes transmitted over network', 'Credentials transmitted over HTTPS to cloud server'],
      ['Key Space Size', 'Up to 94 printable ASCII characters (128+ bits)', 'Limited or predictable character subsets'],
      ['Security Standard', 'Compliant with NIST SP 800-63B guidelines', 'Vulnerable to PRNG state reconstruction attacks']
    ],
    pitfalls: [
      {
        title: 'Modulo Bias in Integer Sampling',
        text: 'A common mistake in custom random password scripts is using the modulo operator (randomValue % charset.length) to pick characters. Because 256 is not evenly divisible by typical alphabet lengths (e.g. 62 or 94), lower-index characters have a slightly higher mathematical probability of appearing. TabKit uses rejection sampling to guarantee a perfectly uniform distribution across every character slot.'
      },
      {
        title: 'Ambiguous Character Transcription Errors',
        text: 'Characters like capital O and digit 0, or uppercase I, lowercase l, and number 1 frequently cause human transcription errors when entering credentials into emergency maintenance consoles or physical equipment. TabKit provides explicit toggles to eliminate visually ambiguous characters without sacrificing entropy.'
      },
      {
        title: 'Operating System Clipboard History Exposure',
        text: 'Modern operating systems (Windows 11 Clipboard History, macOS universal clipboard) frequently retain copies of clipboard contents. When generating production credentials, ensure your clipboard history is purged or paste immediately into an encrypted password manager (1Password, Bitwarden, KeepassXC).'
      }
    ]
  },
  'random-password-generator.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Database & Infrastructure Credential Provisioning',
        desc: 'DevOps and cloud infrastructure engineers routinely configure administrative passwords for PostgreSQL databases, Redis clusters, Kubernetes secret manifests, and root SSH access. Generating high-entropy, cryptographically randomized credentials entirely client-side eliminates the risk of secrets leaking into web server logs, proxy access trails, or cloud provider telemetry.'
      },
      {
        heading: 'CI/CD Service Account & API Token Creation',
        desc: 'Modern continuous delivery pipelines require isolated service tokens for GitHub Actions, Terraform Cloud, and Docker registry authentications. Using automated client-side password generation ensures service accounts obtain mathematically distinct, 32+ character secrets with zero cross-system duplication.'
      },
      {
        heading: 'NIST SP 800-63B Compliant Enterprise Onboarding',
        desc: 'Enterprise security policies following National Institute of Standards and Technology (NIST) guidelines emphasize password length and entropy over arbitrary character composition rules. This generator enables users to generate memorable 4-word passphrases or 24-character high-entropy strings that satisfy enterprise single sign-on (SSO) and IAM requirements.'
      }
    ],
    tableRows: [
      ['Randomness Source', 'window.crypto.getRandomValues() (CSPRNG)', 'Math.random() pseudo-random number generator'],
      ['Entropy Quality', 'Hardware entropy (OS /dev/urandom & BCrypt)', 'Deterministic seed; predictable after output sampling'],
      ['Network Footprint', '0 bytes transmitted over network', 'Credentials transmitted over HTTPS to cloud server'],
      ['Key Space Size', 'Up to 94 printable ASCII characters (128+ bits)', 'Limited or predictable character subsets'],
      ['Security Standard', 'Compliant with NIST SP 800-63B guidelines', 'Vulnerable to PRNG state reconstruction attacks']
    ],
    pitfalls: [
      {
        title: 'Modulo Bias in Integer Sampling',
        text: 'A common mistake in custom random password scripts is using the modulo operator (randomValue % charset.length) to pick characters. Because 256 is not evenly divisible by typical alphabet lengths (e.g. 62 or 94), lower-index characters have a slightly higher mathematical probability of appearing. TabKit uses rejection sampling to guarantee a perfectly uniform distribution across every character slot.'
      },
      {
        title: 'Ambiguous Character Transcription Errors',
        text: 'Characters like capital O and digit 0, or uppercase I, lowercase l, and number 1 frequently cause human transcription errors when entering credentials into emergency maintenance consoles or physical equipment. TabKit provides explicit toggles to eliminate visually ambiguous characters without sacrificing entropy.'
      },
      {
        title: 'Operating System Clipboard History Exposure',
        text: 'Modern operating systems (Windows 11 Clipboard History, macOS universal clipboard) frequently retain copies of clipboard contents. When generating production credentials, ensure your clipboard history is purged or paste immediately into an encrypted password manager (1Password, Bitwarden, KeepassXC).'
      }
    ]
  },
  'sha256-hash-generator.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Release Asset & Software Checksum Verification',
        desc: 'Security engineers and developers downloading compiled software binaries, OS ISO images, and container tarballs must verify file integrity against official publisher checksums. Generating a SHA-256 hash locally confirms the downloaded file has not been corrupted during transmission or compromised by a man-in-the-middle (MITM) tampering attack.'
      },
      {
        heading: 'Content-Addressable Storage & Deduplication',
        desc: 'Distributed systems like IPFS, Git, and cloud storage systems rely on content hashes to uniquely identify objects. By calculating the SHA-256 digest of documents, databases can instantly identify duplicate uploads and store files under deterministic content-addressed keys without inspecting file names.'
      },
      {
        heading: 'Cryptographic Proof of Existence & Timestamping',
        desc: 'Organizations frequently need to prove that a specific contract, code release, or design document existed at an exact point in time without publicly exposing the proprietary document contents. Hashing the file generates a permanent 64-character fingerprint that can be recorded on public ledgers or shared with auditors.'
      }
    ],
    tableRows: [
      ['Cryptographic Engine', 'Web Cryptography API (SubtleCrypto.digest)', 'Server-side OpenSSL / Crypto CLI'],
      ['Algorithm Standard', 'FIPS PUB 180-4 SHA-256 (256-bit hash digest)', 'FIPS PUB 180-4 SHA-256 (256-bit hash digest)'],
      ['Data Confidentiality', 'Proprietary files never leave browser tab memory', 'File bytes uploaded across public internet to server'],
      ['Collision Resistance', '2^128 operations against birthday attacks', '2^128 operations against birthday attacks'],
      ['Processing Speed', 'Hardware-accelerated crypto instructions (AES-NI/AVX)', 'Dependent on server CPU allocation & network throughput']
    ],
    pitfalls: [
      {
        title: 'Cross-Platform Line Ending Differences (CRLF vs LF)',
        text: 'The single most common cause of mismatched file hashes between team members is Git line-ending conversion. Windows files traditionally terminate lines with carriage return + line feed (\\r\\n), while macOS and Linux use simple line feeds (\\n). Even a single byte difference alters every single character in the resulting SHA-256 output. Normalize line endings before comparing checksums.'
      },
      {
        title: 'Character Encoding Mismatches (UTF-8 vs UTF-16LE)',
        text: 'Hashing a plain text string requires converting characters into raw bytes. Windows PowerShell traditionally outputs strings as UTF-16LE, whereas web browsers and Unix systems use UTF-8. Hashing the word "admin" in UTF-16 yields an entirely different hash than UTF-8. TabKit enforces standardized UTF-8 byte serialization.'
      },
      {
        title: 'Using Raw SHA-256 for Password Storage',
        text: 'SHA-256 is designed to be extremely fast for integrity checking. Because modern GPU clusters can calculate billions of SHA-256 hashes per second, hashing raw passwords with unsalted SHA-256 makes them trivial to crack via precomputed rainbow tables. Passwords must always use memory-hard slow hashing algorithms (Argon2id, bcrypt, PBKDF2).'
      }
    ]
  },
  'url-link-cleaner.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Privacy-Conscious Internal Link Distribution',
        desc: 'When sharing links across corporate Slack channels, Discord communities, or customer support tickets, raw copied URLs frequently contain personal click identifiers (fbclid, gclid, msclkid) that associate the link with the sharer\'s private account profile. Sanitizing URLs strips intrusive marketing telemetry while maintaining direct access to destination content.'
      },
      {
        heading: 'SEO Canonicalization & Clean Sitemap Audits',
        desc: 'Digital marketing and SEO teams must ensure inbound links, sitemaps, and internal navigation structures use clean canonical URLs. Eliminating redundant tracking query strings prevents search engine crawlers from indexing duplicate URL variations, consolidating domain authority and preserving crawl budget.'
      },
      {
        heading: 'Affiliate Marketing & Tracking Transparency',
        desc: 'E-commerce analysts and affiliate managers frequently inspect affiliate links to determine whether affiliate codes, referral parameters, or sub-IDs have been injected by browser extensions or adware. TabKit reveals the stripped parameters so analysts can audit the precise tracking mechanisms employed.'
      }
    ],
    tableRows: [
      ['Filtering Engine', 'Browser URL & URLSearchParams DOM APIs', 'Cloud-based link shortener / redirect service'],
      ['Network Requests', 'Zero outbound HTTP requests (100% offline)', 'Sends request to remote redirect service'],
      ['Parameter Blacklist', '50+ tracking tokens (UTM, Facebook, Google, Mailchimp)', 'Dependent on service database'],
      ['Destination Integrity', 'Path and functional routing parameters preserved', 'Risk of broken redirect chains or 404 links'],
      ['Execution Speed', '< 1ms local regex and query token parsing', '100ms - 400ms server ping and redirect']
    ],
    pitfalls: [
      {
        title: 'Stripping Required Functional Parameters',
        text: 'Not all query parameters are marketing trackers. For example, YouTube videos require the "v" parameter (?v=dQw4w9WgXcQ), and e-commerce stores require product IDs (?id=1024). Naively stripping all query strings breaks application navigation. TabKit targets an exhaustive blacklist of known telemetry keys while safely preserving functional routing query parameters.'
      },
      {
        title: 'Nested URLs & Redirect Wrappers',
        text: 'Many corporate email scanners (such as Proofpoint or Outlook SafeLinks) wrap destination URLs inside a redirect wrapper parameter (e.g. https://safelinks.protection.outlook.com/?url=https%3A%2F%2Ftarget.com). To clean these links, the embedded URL must be fully extracted and percent-decoded before stripping secondary tracking parameters.'
      },
      {
        title: 'Fragment Tracking (#utm_campaign=...) Patterns',
        text: 'Some single-page applications and modern marketing engines append tracking parameters after the hash symbol (#) instead of the query string (?) to avoid server-side caching invalidation. TabKit evaluates both the URL search query and the URL hash fragment to eliminate all tracking footprints.'
      }
    ]
  },
  'password-strength.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Pre-Submission Frontend Password Auditing',
        desc: 'Enterprise authentication flows and user registration forms require instant, non-blocking password strength validation before submitting credentials to identity providers (Auth0, Okta, AWS Cognito). Local browser evaluation gives users immediate visual guidance without introducing network latency or exposing plaintext inputs to network monitoring tools.'
      },
      {
        heading: 'Internal Security Policy Validation & Red Teaming',
        desc: 'Information security teams evaluating enterprise employee passphrases can test password complexity and entropy against dictionary pattern matching without typing confidential company credentials into external cloud checkers that may store or log submissions.'
      },
      {
        heading: 'NIST SP 800-63B Guidelines Compliance Checking',
        desc: 'Modern NIST authentication guidelines deprecate arbitrary composition rules (requiring uppercase, lowercase, numbers, and symbols) in favor of passphrase length and entropy. TabKit evaluates actual information entropy (Shannon entropy and dictionary resistance) rather than naive regex checks.'
      }
    ],
    tableRows: [
      ['Evaluation Methodology', 'Information entropy + dictionary pattern detection', 'Simple regex composition checklist'],
      ['Data Privacy', 'Zero network transmission; evaluated in RAM', 'Transmitted over network or saved to database'],
      ['Entropy Model', 'Log2(CharacterSpace^Length) with pattern penalty', 'Flat score based on 4-character class count'],
      ['Offline Accessibility', 'Fully functional offline via Service Worker PWA', 'Requires active internet connection to server API'],
      ['Crack Time Modeling', 'GPU cluster brute-force calculations (Hashcat)', 'Generic arbitrary qualitative estimates']
    ],
    pitfalls: [
      {
        title: 'The Illusion of Arbitrary Character Complexity',
        text: 'Traditional password rules requiring at least one capital letter, one number, and one symbol routinely produce predictable passwords like "P@ssword123!". While passing naive rule-based checks, this password has less than 20 bits of effective entropy and can be cracked in milliseconds by modern dictionary attack tools. Real security stems from sheer length (16+ characters).'
      },
      {
        title: 'Keyboard Walk & Spatial Pattern Blindspots',
        text: 'Users frequently select passwords that look random but follow physical keyboard layout paths (such as "qwertz", "1qaz2wsx", or "zaq12wsx"). Algorithms that only measure character set variety award high scores to these sequences. TabKit factors spatial sequences and repeated substrings into its entropy calculations.'
      },
      {
        title: 'Compromised Breach Lists vs Mathematical Entropy',
        text: 'A password can possess 80 bits of mathematical entropy, but if it has already appeared in a public credential breach (such as RockYou or Have I Been Pwned), its real-world security value is zero. In production environments, combine client-side entropy checks with k-anonymity breach list verification.'
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
  console.log('Enriching Category 1: Privacy & Security (6 tools)...');
  for (const [file, data] of Object.entries(category1Data)) {
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
