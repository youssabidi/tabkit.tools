# TabKit Tools - Master Roadmap

## Phase 1: Polish & App Experience (The "Premium" Feel)
*Goal: Make the existing tools feel like a professional, high-end desktop app.*
- [x] **Light / Dark Theme Toggle:** Slick high-contrast switch with dynamic Sun/Moon icons, zero-flicker instant hydration, and `localStorage` persistence.
- [x] **"Install App" Button (PWA):** Native install button in navigation bar with browser prompt handling and offline app shell.
- [x] **Instant Search & Keyboard Navigation:** Live filtering in Quick Launcher (`Ctrl+K`) with Arrow Up/Down navigation, Enter to pin, and escape to close.
- [x] **Syntax Highlighting:** Zero-dependency, colorful text formatting for JSON keys, strings, numbers, booleans, and null values.

## Phase 2: Workspace Customization (User Control)
*Goal: Allow users to make the dashboard truly their own with multi-deck persistence.*
- [x] **Drag-and-Drop Reordering:** Reorder cards by dragging headers with visual drop rings and index persistence.
- [x] **Resizable Cards:** Expand cards to span 2 columns with a single header click (ideal for Diff Checker, Markdown, and Splitter).
- [x] **Multiple Workspaces (Tabs):** Dynamic deck tabs ("Main Deck", custom named decks, zero limits, local backup & restore).

## Phase 3: "Supercharging" Existing Tools
*Goal: Take the best tools and make them vastly superior to standard online converters.*
- [x] **Visual PDF Splitter:** Visual page selector chips (P1, P2...) with All, Invert, range parsing, and zero cloud uploads.
- [x] **Batch Image Compression:** Multi-file drag and drop, dimension scaling (100%, 75%, 50%, 25%), per-file savings, and bulk download.
- [x] **Browser Notifications & Chime:** Web Audio API synthesizer bell chime and desktop notifications for the Pomodoro Timer.
- [x] **Tool Chaining ("Send To..."):** Seamless data handoff between tools (e.g., JSON Formatter ➔ TypeScript generator).

## Phase 4: Developer & Privacy Arsenal
*Goal: High-traffic developer and privacy tools with dedicated standalone pages.*
- [x] **Markdown Preview Editor:** Live split-screen Markdown-to-HTML editor with instant HTML export.
- [x] **CSV ↔ JSON Converter:** Bi-directional table-to-JSON and JSON-to-table local transformer with delimiter detection.
- [x] **Regex Tester:** Live regular expression sandbox with real-time match highlighting, error flags, and cheatsheet presets.
- [x] **JWT Decoder:** Client-side token header/payload claims inspector with expiration countdown validation.
- [x] **Image to Base64 (Data URI):** Converts images to Data URIs, HTML `<img>` tags, and CSS background rules.
- [x] **Bulk UUID / GUID Generator:** Cryptographically secure RFC 4122 v4 UUID generator with count and formatting controls.
- [x] **SQL Formatter:** Beautify, uppercase, and indent SQL clauses with clean clause indentation and minification.

## Phase 5: Client-Side PDF Powerhouse (Zero Uploads)
*Goal: Complete suite of 11 local in-browser PDF utilities replacing invasive cloud services.*
- [x] **PDF Splitter & Page Remover (`pdf-splitter`):** Extract specific page ranges or purge pages in-browser.
- [x] **PDF Merger / Combiner (`pdf-merger`):** Merge multiple PDFs with drag-and-drop order rearrangement.
- [x] **PDF Page Rotator (`pdf-rotator`):** Correct 90°, 180°, and 270° orientation across all pages, odd/even, or custom ranges.
- [x] **Images to PDF Converter (`images-to-pdf`):** Batch compile JPG, PNG, and WebP into standardized A4 multi-page PDFs.
- [x] **PDF Watermark & Stamp (`pdf-watermarker`):** Stamp diagonal text overlays across every page with opacity and color styling.
- [x] **PDF Metadata Inspector & Stripper (`pdf-metadata-editor`):** View and wipe author, title, keywords, and producer metadata.
- [x] **PDF Page Numberer (`pdf-page-numberer`):** Add pagination headers and footers with custom formatting and cover-page skip.
- [x] **PDF Text & Markdown Extractor (`pdf-text-extractor`):** Extract raw text and formatted markdown client-side.
- [x] **PDF to Images (`pdf-to-images`):** Render every PDF page into high-resolution PNG or JPG photos locally.
- [x] **PDF Password Protect (`pdf-password-protect`):** Encrypt sensitive PDF documents with custom passwords locally.
- [x] **PDF Signature & Stamp (`pdf-sign-stamp`):** Draw or type digital signatures and stamp onto any PDF page.

## Phase 6: Local Spreadsheet & Data Engineering Suite
*Goal: Fast, private Excel/CSV manipulation without launching Office or sending spreadsheets to cloud servers.*
- [x] **Excel to CSV Converter (`excel-to-csv`):** Convert `.xlsx` / `.xls` spreadsheets to clean UTF-8 CSV locally.
- [x] **CSV to Excel Converter (`csv-to-excel`):** Convert raw CSV, TSV, or pasted text into styled Microsoft Excel workbooks.
- [x] **Excel to JSON Converter (`excel-to-json`):** Transform spreadsheets into structured JSON arrays or objects.
- [x] **JSON to Excel Converter (`json-to-excel`):** Export JSON data structures directly into formatted Excel sheets.
- [x] **Spreadsheet Row Deduplicator (`excel-deduplicator`):** Detect and purge duplicate rows across custom columns.
- [x] **Excel to Markdown Table (`excel-to-markdown`):** Convert spreadsheets into clean GitHub-flavored Markdown tables.
- [x] **Row & Column Transposer (`excel-transpose`):** Flip spreadsheet axes (rows to columns, columns to rows) instantly.
- [x] **Empty Rows & Whitespace Stripper (`excel-empty-cleaner`):** Clean messy tables by purging blank rows and phantom padding.

## Phase 7: Security, Privacy & Google Search Indexing
*Goal: Industry-standard security posture, transparent legal compliance, and SEO optimization.*
- [x] **Hardened CSP & Permissions Policy:** Configured `object-src 'none'`, `frame-ancestors 'none'`, `base-uri 'self'`, and `interest-cohort=()` (FLoC disabled).
- [x] **Transparent Legal Commitments:** Comprehensive dedicated `privacy.html` and `terms.html` pages linked across all tool footers.
- [x] **Clean Canonical & OpenGraph Uniformity:** Standardized canonical tags, OpenGraph metadata, and structured data across all tools.
- [x] **Full Clean Sitemap:** Comprehensive `sitemap.xml` with zero redirect chains and clean URLs.
- [x] **Streamlined Curated Landing Page:** Clean initial view displaying 8 popular suggested utilities with smooth "Browse All Tools" toggle.

## Phase 8: Workflow Automation & Advanced Utilities
- [x] **Tool Chaining 2.0:** Direct 1-click piping between complementary tools (JSON ➔ TS, Markdown ➔ Minifier, CSV ➔ JSON) across both workbench and standalone tools.
- [x] **CSS & HTML Minifier (`css-html-minifier`):** Fast in-browser code minification, comment stripper, and beautifier with real-time byte analytics.
- [x] **PWA Shortcuts:** Native OS-level application shortcuts in `manifest.json` for rapid tool launching.
- [x] **Color Palette Generator & Contrast Studio (`color-palette-contrast`):** Contrast ratios (WCAG AAA) and complementary palette builder.
- [x] **JSON to CSV & TSV Converter (`json-to-csv`):** Flatten nested JSON objects and arrays into structured CSV spreadsheets or TSV tables with UTF-8 BOM encoding.
- [x] **Favicon & PWA App Icon Generator (`favicon-generator`):** Generate multi-resolution favicons, Apple touch icons, and Android PWA manifest assets directly in your browser.
- [x] **SVG to PNG & WebP Converter (`svg-to-png`):** High-DPI client-side rasterizer for vector graphics.
- [x] **Password Strength & Entropy Meter (`password-strength`):** Real-time cryptographic entropy analyzer and brute force crack duration estimator.

## Phase 9: High-Intent Financial & Spreadsheet Expansion
- [x] **PDF Bank Statement to Excel Converter (`bank-statement-to-excel`):** Convert PDF bank statements into structured Excel (.xlsx) and CSV spreadsheets locally with zero server uploads.
- [x] **Bank-Specific Programmatic Parsers:** Dedicated high-converting pages for Chase, Bank of America, Wells Fargo, Revolut, and Barclays.
- [x] **Client-Side WebAssembly OCR:** In-browser OCR fallback for scanned statements via Tesseract.js WASM.
- [x] **Invoice Generator & Excel Exporter (`invoice-generator`):** Professional invoice generator with live calculations, active formula Excel (.xlsx) workbooks, and print-ready PDF export.
- [x] **Excel & Google Sheets Shortcuts Studio (`excel-shortcuts`):** Interactive keyboard shortcuts reference and modern formula playground for Excel & Google Sheets.

## Phase 10: Complete Site-Wide SEO & Schema Dominance
- [x] **Full Schema.org Graph:** Injected `WebApplication`, `BreadcrumbList`, `HowTo`, and `FAQPage` across 100% of all 73 pages.
- [x] **Zero Thin Content:** Expanded legal, support SLA, and educational copy so every page exceeds 400 words (avg: 540 words).
- [x] **Category Anchor Resolution:** Injected matching IDs (`#documents-pdf`, etc.) in `index.html` with scroll padding to resolve all breadcrumb anchors.
- [x] **AI Agent Discoverability:** Deployed `llms.txt` and `llms-full.txt` catalogs for Perplexity, ChatGPT Search, and Claude citations.

## Phase 11: Studio Design Overhaul & Micro-Interactions
- [x] **Dynamic Cursor Spotlight Glow:** Cursor-following radial lighting effect on borders across workbench and category cards (`spotlight-card`).
- [x] **Tactile Spring Physics:** Physical micro-compression (`active:scale-[0.97]`), 1px specular top highlights, and tabular numerals.
- [x] **Ambient Air-Gap Canvas Grid:** Interactive hardware-accelerated particle canvas with battery and `prefers-reduced-motion` guards.
- [x] **Raycast-Grade Command Palette:** Quick category filter pills, dual-action items (Pin to Deck / Open Standalone), and keyboard navigation.
- [x] **Universal Header & Footer:** Standalone tool telemetry pill, 1-click Pin to Deck button, and companion bento recommendations.

## Phase 12: Architecture Automation & Single Source of Truth
- [x] **Automated Sitemap Generation:** Script crawls canonical URLs, excludes aliases, and timestamps fresh XML sitemap.
- [x] **Single Source of Truth:** `registry.js` dynamically syncs `components.js`, `llms.txt`, and DOM tool counts on `index.html`.
- [x] **Unified Sync Pipeline:** 1-command build automation (`node scripts/sync-all.js`) running all syncs and SEO verifications.

## Phase 13: Launch, Indexation & Distribution (Current Active Stage)
- [ ] **Google Search Console Crawl Monitoring:** Tracking indexation across the 72 submitted URLs and monitoring the new green Rich Results tabs (FAQs, Breadcrumbs, How-To, WebApps).
- [ ] **Community & Product Launch:** Show HN, Product Hunt, Reddit (r/webdev, r/privacy, r/excel) distribution campaigns.
- [ ] **Continuous Tool Expansion:** Adding new offline tools based on user feedback and search trends.

---

## 📦 Total Tools in Registry: 64 Tools

### 📄 Documents & PDF (17)
1. `bank-statement-to-excel` — PDF Bank Statement to Excel Converter
2. `convert-chase-statement-to-excel` — Convert Chase Statement to Excel
3. `convert-bank-of-america-statement-to-excel` — Convert Bank of America Statement to Excel
4. `convert-wells-fargo-statement-to-excel` — Convert Wells Fargo Statement to Excel
5. `convert-revolut-statement-to-excel` — Convert Revolut Statement to Excel
6. `convert-barclays-statement-to-excel` — Convert Barclays Statement to Excel
7. `pdf-splitter` — Client-Side PDF Splitter & Page Remover
8. `pdf-merger` — Client-Side PDF Merger & Combiner
9. `pdf-rotator` — Client-Side PDF Page Rotator
10. `images-to-pdf` — Client-Side Images to PDF Converter
11. `pdf-watermarker` — Client-Side PDF Watermark & Stamp
12. `pdf-metadata-editor` — PDF Metadata Inspector & Stripper
13. `pdf-page-numberer` — Client-Side PDF Page Numberer
14. `pdf-text-extractor` — PDF Text & Markdown Extractor
15. `pdf-to-images` — Client-Side PDF to Images (PNG/JPG)
16. `pdf-password-protect` — Client-Side PDF Password Protect
17. `pdf-sign-stamp` — Client-Side PDF Signature & Stamp

### 📊 Text & Data (15)
18. `case-converter` — Case Converter & Word Counter
19. `excel-formula-builder` — Excel Formula Builder Cheat Sheet
20. `json-formatter` — JSON Formatter & Validator
21. `text-diff-checker` — Text Diff Checker & Notepad
22. `markdown-preview` — Markdown Live Editor & HTML Preview
23. `csv-json-converter` — CSV ↔ JSON Converter
24. `excel-to-csv` — Excel to CSV Converter
25. `excel-to-json` — Excel to JSON Converter
26. `excel-deduplicator` — Spreadsheet Row Deduplicator
27. `csv-to-excel` — CSV to Excel (.xlsx) Converter
28. `json-to-csv` — JSON to CSV & TSV Converter
29. `json-to-excel` — JSON to Excel (.xlsx) Converter
30. `excel-to-markdown` — Excel to Markdown Table Generator
31. `excel-transpose` — Spreadsheet Row & Column Transposer
32. `excel-empty-cleaner` — Empty Rows & Whitespace Stripper

### 💻 Developer & Code (8)
33. `chmod-calculator` — Visual chmod Permissions Calculator
34. `css-html-minifier` — CSS & HTML Minifier & Beautifier
35. `curl-converter` — cURL to Fetch / Axios / Python Converter
36. `json-to-typescript` — JSON to TypeScript Interface Generator
37. `unix-timestamp-converter` — Unix Timestamp & Epoch Converter
38. `regex-tester` — Real-Time Regular Expression Sandbox
39. `jwt-decoder` — Client-Side JWT Token Decoder
40. `sql-formatter` — SQL Query Beautifier & Indenter

### 🔒 Privacy & Security (6)
41. `base64-encoder-decoder` — Base64 Encoder / Decoder
42. `exif-metadata-stripper` — Photo EXIF & GPS Metadata Stripper
43. `secure-password-generator` — Secure Password & PIN Generator
44. `sha256-hash-generator` — SHA-256 / 384 / 512 Hash Generator
45. `url-link-cleaner` — URL Tracking Link Cleaner
46. `password-strength` — Real-Time Password Strength & Entropy Analyzer

### 🎨 Media & Design (9)
47. `favicon-generator` — Favicon & PWA App Icon Generator
48. `color-palette-contrast` — WCAG Color Contrast & Palette Studio
49. `hex-color-converter` — HEX to RGB / HSL Color Converter
50. `image-compressor` — Client-Side Image Compressor & WebP
51. `qr-code-generator` — Free QR Code Generator
52. `social-seo-previewer` — Social Media & Google SERP Previewer
53. `svg-optimizer` — SVG Optimizer & React/CSS Exporter
54. `image-to-base64` — Image to Base64 (Data URI) Converter
55. `svg-to-png` — SVG to PNG & WebP Rasterizer Studio

### ⏱️ Productivity & Math (9)
56. `invoice-generator` — Free Invoice Generator & Excel Exporter
57. `excel-shortcuts` — Excel & Google Sheets Shortcuts Studio
58. `date-calculator` — Days Between Dates Calculator
59. `percentage-calculator` — Online Percentage Calculator
60. `pomodoro-timer` — Offline Pomodoro Productivity Timer
61. `random-name-picker` — Random Name & Decision Picker
62. `time-zone-converter` — Global Time Zone Converter & Meeting Planner
63. `unit-converter` — Universal Unit Converter
64. `uuid-generator` — Bulk UUID / GUID v4 Generator
