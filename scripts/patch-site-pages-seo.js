const fs = require('fs');

// ==================== 1. CONTACT.HTML ====================
let contact = fs.readFileSync('contact.html', 'utf8');

const contactFaqSchema = `      {
        "@type": "FAQPage",
        "@id": "https://tabkit.tools/contact#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How quickly does the TabKit Tools team respond to inquiries?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our engineering and support team reviews all incoming inquiries within 24 to 48 business hours. Critical bug reports affecting data accuracy receive immediate priority triage."
            }
          },
          {
            "@type": "Question",
            "name": "Can I request a new offline browser tool or converter?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! We actively welcome community requests for new client-side utilities. Please provide input and output format specifications and any relevant ISO or RFC standards."
            }
          },
          {
            "@type": "Question",
            "name": "How should I report a security vulnerability or CSP issue?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Security disclosures should be emailed to support@tabkit.tools with the subject '[Security Audit]' along with reproducible steps. We coordinate prompt remediation."
            }
          }
        ]
      }`;

contact = contact.replace(
  /(\s*\{\s*"@type":\s*"BreadcrumbList"[\s\S]*?\}\s*)\n\s*\]\s*\}/,
  `$1,\n${contactFaqSchema}\n    ]\n  }`
);

const contactFaqSection = `
    <!-- FAQ Section -->
    <div class="border-t border-workspace-border pt-12 space-y-6">
      <div class="max-w-2xl">
        <h2 class="text-xl font-bold text-white mb-2">Frequently Asked Inquiries</h2>
        <p class="text-xs text-workspace-muted leading-relaxed">
          Common questions regarding communication, technical assistance, tool suggestions, and privacy commitments.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-5 rounded-2xl bg-workspace-surface/60 border border-workspace-border space-y-2">
          <h3 class="text-sm font-bold text-white">How quickly do you reply?</h3>
          <p class="text-xs text-workspace-muted leading-relaxed">
            Inquiries are processed by our core development team within 24–48 hours. Feature suggestions and converter requests are logged directly onto our public engineering roadmap.
          </p>
        </div>

        <div class="p-5 rounded-2xl bg-workspace-surface/60 border border-workspace-border space-y-2">
          <h3 class="text-sm font-bold text-white">Can I suggest new features?</h3>
          <p class="text-xs text-workspace-muted leading-relaxed">
            Absolutely. If you regularly use a repetitive data formatting, conversion, or PDF manipulation workflow that can run client-side, let us know and we will evaluate building it.
          </p>
        </div>

        <div class="p-5 rounded-2xl bg-workspace-surface/60 border border-workspace-border space-y-2">
          <h3 class="text-sm font-bold text-white">Responsible disclosure policy?</h3>
          <p class="text-xs text-workspace-muted leading-relaxed">
            We take browser security and CSP sandboxing seriously. Please send vulnerability reports with reproduction steps to support@tabkit.tools for prioritized same-day review.
          </p>
        </div>
      </div>
    </div>
`;

if (!contact.includes('Frequently Asked Inquiries')) {
  contact = contact.replace('</main>', `${contactFaqSection}\n  </main>`);
}

fs.writeFileSync('contact.html', contact, 'utf8');
console.log('Updated contact.html with FAQPage schema and content!');


// ==================== 2. REPORT-ISSUE.HTML ====================
let report = fs.readFileSync('report-issue.html', 'utf8');

const reportFaqSchema = `      {
        "@type": "FAQPage",
        "@id": "https://tabkit.tools/report-issue#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What details should I include in a bug report?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Providing your browser name and version, operating system (Windows, macOS, Linux, iOS, Android), the tool name, and the specific steps or sample text that triggered the error helps us reproduce and resolve the issue immediately."
            }
          },
          {
            "@type": "Question",
            "name": "Can I request a brand new offline productivity tool?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! If there is a calculation, conversion, or formatting workflow you find yourself performing frequently that could run privately in a browser, submit a Tool Request through this form."
            }
          },
          {
            "@type": "Question",
            "name": "How is my feedback submitted without tracking?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The feedback form formats your submission cleanly into a standardized markdown template that you can copy or send directly via email, ensuring no third-party tracking scripts monitor your actions."
            }
          }
        ]
      }`;

report = report.replace(
  /(\s*\{\s*"@type":\s*"BreadcrumbList"[\s\S]*?\}\s*)\n\s*\]\s*\}/,
  `$1,\n${reportFaqSchema}\n    ]\n  }`
);

const reportExtraContent = `
      <!-- Bug Diagnostic Checklist & Environment Table -->
      <div class="border-t border-workspace-border pt-8 space-y-4">
        <h2 class="text-xl font-bold text-white mb-2">Bug Diagnostic &amp; Reproduction Checklist</h2>
        <p class="text-xs text-workspace-muted leading-relaxed">
          Because TabKit Tools executes entirely inside your client browser, environmental factors such as browser extensions, strict Content Security Policies, or device memory limits can occasionally affect performance. When filing an issue, including the items below accelerates resolution:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div class="p-4 rounded-xl border border-workspace-border bg-workspace-surface/40 space-y-1.5">
            <h3 class="font-bold text-white">Browser &amp; OS Information</h3>
            <p class="text-workspace-muted leading-relaxed">Specify Chrome, Firefox, Safari, Edge, or Brave, along with whether you are running on desktop (Windows, macOS, Linux) or mobile (iOS, Android).</p>
          </div>
          <div class="p-4 rounded-xl border border-workspace-border bg-workspace-surface/40 space-y-1.5">
            <h3 class="font-bold text-white">Console Logs &amp; Error Messages</h3>
            <p class="text-workspace-muted leading-relaxed">Open DevTools (F12 or Ctrl+Shift+I), check the Console tab for red error messages, and paste non-sensitive stack traces into the description.</p>
          </div>
          <div class="p-4 rounded-xl border border-workspace-border bg-workspace-surface/40 space-y-1.5">
            <h3 class="font-bold text-white">Input File Size &amp; Format</h3>
            <p class="text-workspace-muted leading-relaxed">For PDF or spreadsheet converters, mention the approximate file size (e.g. 5 MB) and whether the file contains complex vector graphics or scanned raster images.</p>
          </div>
          <div class="p-4 rounded-xl border border-workspace-border bg-workspace-surface/40 space-y-1.5">
            <h3 class="font-bold text-white">Reproduction Steps</h3>
            <p class="text-workspace-muted leading-relaxed">List sequential steps: e.g., 1. Drop file -> 2. Select page 1-3 -> 3. Click Convert -> 4. Unexpected blank output observed.</p>
          </div>
        </div>
      </div>
`;

if (!report.includes('Bug Diagnostic &amp; Reproduction Checklist')) {
  report = report.replace('<!-- SEO Educational Content -->', `${reportExtraContent}\n    <!-- SEO Educational Content -->`);
}

fs.writeFileSync('report-issue.html', report, 'utf8');
console.log('Updated report-issue.html with FAQPage schema and diagnostic content!');


// ==================== 3. PRIVACY.HTML ====================
let privacy = fs.readFileSync('privacy.html', 'utf8');

const privacyFaqSchema = `    {
      "@type": "FAQPage",
      "@id": "https://tabkit.tools/privacy#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Are my uploaded files, PDFs, or data ever stored on TabKit servers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Never. TabKit Tools operates strictly on a client-side architecture. All documents, images, financial statements, and passwords reside exclusively in your browser memory and are wiped when the tab closes."
          }
        },
        {
          "@type": "Question",
          "name": "Does TabKit use tracking cookies or session telemetry?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No tracking cookies or analytics telemetry scripts are used. Browser localStorage is utilized solely for functional preferences such as pinned workbench tools and visual settings."
          }
        },
        {
          "@type": "Question",
          "name": "Can third-party advertisers access data processed inside TabKit?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Google AdSense scripts run inside isolated iframes that have no access to the application DOM, input forms, or memory buffers of your tools."
          }
        }
      ]
    }`;

privacy = privacy.replace(
  /(\s*\{\s*"@type":\s*"BreadcrumbList"[\s\S]*?\}\s*)\n\s*\]\s*\}/,
  `$1,\n${privacyFaqSchema}\n  ]\n}`
);

fs.writeFileSync('privacy.html', privacy, 'utf8');
console.log('Updated privacy.html with FAQPage schema!');


// ==================== 4. TERMS.HTML ====================
let terms = fs.readFileSync('terms.html', 'utf8');

const termsFaqSchema = `    {
      "@type": "FAQPage",
      "@id": "https://tabkit.tools/terms#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is TabKit Tools free for commercial and business use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. TabKit Tools is 100% free for commercial, professional, academic, and personal workflows. There are no licensing fees, account creation requirements, or usage quotas."
          }
        },
        {
          "@type": "Question",
          "name": "Can our enterprise use TabKit for confidential data and financial audits?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Because TabKit executes 100% client-side in the browser V8 engine without transmitting data over the network, organizations can process confidential bank statements and spreadsheets without violating data sovereignty or compliance policies."
          }
        },
        {
          "@type": "Question",
          "name": "Are there daily conversion or file size quotas?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No server quotas or daily limits exist. Processing capacity is governed solely by your local device hardware and browser memory capabilities."
          }
        }
      ]
    }`;

terms = terms.replace(
  /(\s*\{\s*"@type":\s*"BreadcrumbList"[\s\S]*?\}\s*)\n\s*\]\s*\}/,
  `$1,\n${termsFaqSchema}\n  ]\n}`
);

const termsExtraSections = `
      <section class="p-6 md:p-8 rounded-2xl bg-workspace-surface/50 border border-workspace-border space-y-4">
        <h2 class="text-lg font-bold text-workspace-text font-mono flex items-center gap-2">
          <span class="text-workspace-accent font-mono text-base">06.</span>
          Commercial Use &amp; Enterprise Compliance
        </h2>
        <p>
          Enterprises, accounting firms, software engineering teams, and academic institutions are granted unrestricted rights to integrate TabKit into their operational workflows. 
        </p>
        <p>
          Because our tools are architected without backend data endpoints, your organization maintains complete data sovereignty under GDPR, CCPA, and SOC 2 guidelines without requiring custom vendor data processing addendums (DPAs).
        </p>
      </section>

      <section class="p-6 md:p-8 rounded-2xl bg-workspace-surface/50 border border-workspace-border space-y-4">
        <h2 class="text-lg font-bold text-workspace-text font-mono flex items-center gap-2">
          <span class="text-workspace-accent font-mono text-base">07.</span>
          Open Web Standards &amp; Attribution
        </h2>
        <p>
          TabKit Tools is built upon open web specifications including HTML5 Web Workers, Web Cryptography API, WebAssembly, and standard ECMAScript modules. You are encouraged to inspect our unminified client-side source code to audit security protocols and calculation algorithms.
        </p>
      </section>

      <!-- Terms & Usage FAQ -->
      <section class="p-6 md:p-8 rounded-2xl bg-workspace-surface/50 border border-workspace-border space-y-6">
        <div class="border-b border-workspace-border pb-4">
          <h2 class="text-xl font-bold text-white mb-1">Terms of Service &amp; Licensing FAQ</h2>
          <p class="text-xs text-workspace-muted leading-relaxed">Common legal, commercial, and operational questions regarding TabKit Tools usage.</p>
        </div>

        <div class="space-y-4 text-xs">
          <div class="p-4 rounded-xl border border-workspace-border bg-workspace-surface/60 space-y-1.5">
            <h3 class="font-bold text-white text-sm">Is TabKit free for commercial and organizational use?</h3>
            <p class="text-workspace-muted leading-relaxed">Yes. You may freely use all 64 tools for commercial work, internal business processes, tax reconciliation, and client deliverables with zero subscription costs.</p>
          </div>

          <div class="p-4 rounded-xl border border-workspace-border bg-workspace-surface/60 space-y-1.5">
            <h3 class="font-bold text-white text-sm">Can we process confidential customer or financial data?</h3>
            <p class="text-workspace-muted leading-relaxed">Yes. Because all operations execute locally in your browser memory, data never leaves your computer. No cloud servers, databases, or third-party APIs receive your files.</p>
          </div>

          <div class="p-4 rounded-xl border border-workspace-border bg-workspace-surface/60 space-y-1.5">
            <h3 class="font-bold text-white text-sm">Are there file size or daily conversion limits?</h3>
            <p class="text-workspace-muted leading-relaxed">There are no server rate limits or paywalls. Conversion limits depend entirely on your computer's RAM and browser capabilities.</p>
          </div>
        </div>
      </section>
`;

if (!terms.includes('Commercial Use &amp; Enterprise Compliance')) {
  terms = terms.replace('</main>', `${termsExtraSections}\n  </main>`);
}

fs.writeFileSync('terms.html', terms, 'utf8');
console.log('Updated terms.html with FAQPage schema and enterprise terms!');
