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
- [x] **Clean Canonical & OpenGraph Uniformity:** Standardized canonical tags, OpenGraph metadata, and structured data across all 50 tools.
- [x] **Full 57-Route Sitemap:** Comprehensive `sitemap.xml` with zero redirect chains and clean URLs.
- [x] **Streamlined Curated Landing Page:** Clean initial view displaying 8 popular suggested utilities with smooth "Browse All 50 Tools" toggle.

## Phase 8: Workflow Automation & Advanced Utilities
- [x] **Tool Chaining 2.0:** Direct 1-click piping between complementary tools (JSON ➔ TS, Markdown ➔ Minifier, CSV ➔ JSON) across both workbench and standalone tools.
- [x] **CSS & HTML Minifier (`css-html-minifier`):** Fast in-browser code minification, comment stripper, and beautifier with real-time byte analytics.
- [x] **PWA Shortcuts:** Native OS-level application shortcuts in `manifest.json` for rapid tool launching.
- [x] **Color Palette Generator & Contrast Studio (`color-palette-contrast`):** Contrast ratios (WCAG AAA) and complementary palette builder.
- [x] **JSON to CSV & TSV Converter (`json-to-csv`):** Tool #53 - Flatten nested JSON objects and arrays into structured CSV spreadsheets or TSV tables with UTF-8 BOM encoding.
- [x] **Favicon & PWA App Icon Generator (`favicon-generator`):** Tool #54 - Generate multi-resolution favicons, Apple touch icons, and Android PWA manifest assets directly in your browser.

---

## 📦 Total Tools in Registry: 54 Tools

### 📄 Documents & PDF (11)
1. `pdf-splitter` — Client-Side PDF Splitter & Page Remover
2. `pdf-merger` — Client-Side PDF Merger & Combiner
3. `pdf-rotator` — Client-Side PDF Page Rotator
4. `images-to-pdf` — Client-Side Images to PDF Converter
5. `pdf-watermarker` — Client-Side PDF Watermark & Stamp
6. `pdf-metadata-editor` — PDF Metadata Inspector & Stripper
7. `pdf-page-numberer` — Client-Side PDF Page Numberer
8. `pdf-text-extractor` — PDF Text & Markdown Extractor
9. `pdf-to-images` — Client-Side PDF to Images (PNG/JPG)
10. `pdf-password-protect` — Client-Side PDF Password Protect
11. `pdf-sign-stamp` — Client-Side PDF Signature & Stamp

### 📊 Text & Data (14)
12. `case-converter` — Case Converter & Word Counter
13. `csv-json-converter` — CSV ↔ JSON Converter
14. `csv-to-excel` — CSV to Excel (.xlsx) Converter
15. `excel-deduplicator` — Spreadsheet Row Deduplicator
16. `excel-empty-cleaner` — Empty Rows & Whitespace Stripper
17. `excel-formula-builder` — Excel Formula Builder Cheat Sheet
18. `excel-to-csv` — Excel to CSV Converter
19. `excel-to-json` — Excel to JSON Converter
20. `excel-to-markdown` — Excel to Markdown Table Converter
21. `excel-transpose` — Row & Column Transposer
22. `json-formatter` — JSON Formatter & Validator
23. `json-to-excel` — JSON to Excel Converter
24. `json-to-csv` — JSON to CSV & TSV Converter
24. `markdown-preview` — Markdown Live Editor & HTML Preview
25. `text-diff-checker` — Text Diff Checker & Notepad

### 💻 Developer & Code (8)
26. `chmod-calculator` — Visual chmod Permissions Calculator
27. `css-html-minifier` — CSS & HTML Minifier & Beautifier
28. `curl-converter` — cURL to Fetch / Axios / Python Converter
29. `json-to-typescript` — JSON to TypeScript Interface Generator
30. `jwt-decoder` — Client-Side JWT Token Decoder
31. `regex-tester` — Real-Time Regular Expression Sandbox
32. `sql-formatter` — SQL Query Beautifier & Indenter
33. `uuid-generator` — Bulk UUID / GUID v4 Generator

### 🔒 Privacy & Security (5)
34. `base64-encoder-decoder` — Base64 Encoder / Decoder
35. `exif-metadata-stripper` — Photo EXIF & GPS Metadata Stripper
36. `secure-password-generator` — Secure Password & PIN Generator
37. `sha256-hash-generator` — SHA-256 / 384 / 512 Hash Generator
38. `url-link-cleaner` — URL Tracking Link Cleaner

### 🎨 Media & Design (7)
39. `hex-color-converter` — HEX to RGB / HSL Color Converter
40. `image-compressor` — Client-Side Image Compressor & WebP
41. `image-to-base64` — Image to Base64 (Data URI) Converter
42. `qr-code-generator` — Free QR Code Generator
43. `social-seo-previewer` — Social Media & Google SERP Previewer
44. `svg-optimizer` — SVG Optimizer & React/CSS Exporter
45. `favicon-generator` — Favicon & PWA App Icon Generator

### ⏱️ Productivity & Math (8)
45. `date-calculator` — Days Between Dates Calculator
46. `percentage-calculator` — Online Percentage Calculator
47. `pomodoro-timer` — Offline Pomodoro Productivity Timer
48. `random-name-picker` — Random Name & Decision Picker
49. `time-zone-converter` — Global Time Zone Converter & Meeting Planner
50. `unit-converter` — Universal Unit Converter
51. `unix-timestamp-converter` — Unix Timestamp & Epoch Converter