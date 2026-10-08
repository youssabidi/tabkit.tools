// TabKit Tools - Lightweight Registry & Dynamic Loader
window.TOOLS_REGISTRY = {
  "text-diff-checker": {
    "id": "text-diff-checker",
    "name": "Text Diff Checker & Notepad",
    "category": "Workspace",
    "standaloneUrl": "/text-diff-checker.html",
    "description": "Auto-saving local notes and true line-by-line diff comparison."
  },
  "url-link-cleaner": {
    "id": "url-link-cleaner",
    "name": "URL Tracking Link Cleaner",
    "category": "Links",
    "standaloneUrl": "/url-link-cleaner.html",
    "description": "Extract URLs, strip tracking tags (UTM, fbclid, gclid), and copy clean links."
  },
  "case-converter": {
    "id": "case-converter",
    "name": "Case Converter & Word Counter",
    "category": "Text",
    "standaloneUrl": "/case-converter.html",
    "description": "Deduplicate lines, toggle cases, and count words and characters without uploads."
  },
  "qr-code-generator": {
    "id": "qr-code-generator",
    "name": "Free QR Code Generator",
    "category": "Utilities",
    "standaloneUrl": "/qr-code-generator.html",
    "description": "Generate high-contrast QR codes for links, phone dialer numbers, or plain text."
  },
  "time-zone-converter": {
    "id": "time-zone-converter",
    "name": "World Time Zone Converter",
    "category": "Productivity",
    "standaloneUrl": "/time-zone-converter.html",
    "description": "Interactive world clock with 25,000+ searchable cities and synchronized hour slider."
  },
  "secure-password-generator": {
    "id": "secure-password-generator",
    "name": "Secure Password Generator",
    "category": "Security",
    "standaloneUrl": "/random-password-generator.html",
    "description": "Generate cryptographically secure passwords or numeric PIN codes."
  },
  "unit-converter": {
    "id": "unit-converter",
    "name": "Universal Unit Converter",
    "category": "Utilities",
    "standaloneUrl": "/unit-converter.html",
    "description": "Multi-category converter for data, length, mass, temperature, speed, volume, and time."
  },
  "percentage-calculator": {
    "id": "percentage-calculator",
    "name": "Online Percentage Calculator",
    "category": "Utilities",
    "standaloneUrl": "/percentage-calculator.html",
    "description": "Everyday percentage calculator for discounts, tips, and fractions."
  },
  "date-calculator": {
    "id": "date-calculator",
    "name": "Days Between Dates Calculator",
    "category": "Utilities",
    "standaloneUrl": "/date-calculator.html",
    "description": "Calculate days between dates or add/subtract days from a date."
  },
  "random-name-picker": {
    "id": "random-name-picker",
    "name": "Random Name Picker & Wheel",
    "category": "Utilities",
    "standaloneUrl": "/random-name-picker.html",
    "description": "Pick a random name from a list or generate a random number."
  },
  "json-formatter": {
    "id": "json-formatter",
    "name": "JSON Formatter & Validator",
    "category": "Developer",
    "standaloneUrl": "/json-formatter.html",
    "description": "Format, validate, and minify JSON strings instantly."
  },
  "base64-encoder-decoder": {
    "id": "base64-encoder-decoder",
    "name": "Base64 Encoder / Decoder",
    "category": "Developer",
    "standaloneUrl": "/base64-encoder-decoder.html",
    "description": "Encode or decode text to Base64 format locally."
  },
  "sha256-hash-generator": {
    "id": "sha256-hash-generator",
    "name": "SHA-256 Hash Generator",
    "category": "Security",
    "standaloneUrl": "/sha256-hash-generator.html",
    "description": "Generate SHA-256, SHA-384, and SHA-512 hashes instantly."
  },
  "hex-color-converter": {
    "id": "hex-color-converter",
    "name": "HEX to RGB Color Converter",
    "category": "Developer",
    "standaloneUrl": "/hex-color-converter.html",
    "description": "Convert colors between HEX, RGB, and HSL formats."
  },
  "pomodoro-timer": {
    "id": "pomodoro-timer",
    "name": "Pomodoro Timer Online",
    "category": "Productivity",
    "standaloneUrl": "/pomodoro-timer.html",
    "description": "A simple Pomodoro countdown timer for focused work sessions."
  },
  "excel-formula-builder": {
    "id": "excel-formula-builder",
    "name": "Excel Formula Builder Cheat Sheet",
    "category": "Data",
    "standaloneUrl": "/excel-formula-builder.html",
    "description": "Massive offline registry of Excel/Sheets formulas with a fill-in-the-blanks builder."
  }
};

// Dynamic Tool Loader
const _loadedToolScripts = new Set();
window.loadTool = function(toolId) {
  return new Promise((resolve, reject) => {
    if (!window.TOOLS_REGISTRY[toolId]) {
      return reject(new Error('Unknown tool: ' + toolId));
    }
    if (window.TOOLS_REGISTRY[toolId].render) {
      return resolve(window.TOOLS_REGISTRY[toolId]);
    }
    if (_loadedToolScripts.has(toolId)) {
      // Check if rendered
      const check = setInterval(() => {
        if (window.TOOLS_REGISTRY[toolId].render) {
          clearInterval(check);
          resolve(window.TOOLS_REGISTRY[toolId]);
        }
      }, 10);
      return;
    }
    _loadedToolScripts.add(toolId);
    const script = document.createElement('script');
    script.src = 'tools/' + toolId + '.js';
    script.async = true;
    script.onload = () => {
      resolve(window.TOOLS_REGISTRY[toolId]);
    };
    script.onerror = (err) => {
      _loadedToolScripts.delete(toolId);
      reject(err);
    };
    document.head.appendChild(script);
  });
};
