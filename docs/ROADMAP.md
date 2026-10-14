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
- [x] **Multiple Workspaces (Tabs):** Dynamic deck tabs ("★ Main Deck", "🛠 Dev Suite", "🖼 Media & Privacy", "⚡ Daily Admin", plus custom decks).

## Phase 3: "Supercharging" Existing Tools
*Goal: Take the best tools and make them vastly superior to standard online converters.*
- [x] **Visual PDF Splitter:** Visual page selector chips (P1, P2...) with All, Invert, range parsing, and zero cloud uploads.
- [x] **Batch Image Compression:** Multi-file drag and drop, dimension scaling (100%, 75%, 50%, 25%), per-file savings, and bulk download.
- [x] **Browser Notifications & Chime:** Web Audio API synthesizer bell chime and desktop notifications for the Pomodoro Timer.
- [x] **Tool Chaining ("Send To..."):** Seamless data handoff between tools (e.g., JSON Formatter ➔ TypeScript generator).

## Phase 4: High-Value New Tools (Expanding the Arsenal)
*Goal: Built 7 high-traffic developer and privacy tools with dedicated standalone pages.*
- [x] **Markdown Preview Editor:** Live split-screen Markdown-to-HTML editor with instant HTML export.
- [x] **CSV ↔ JSON Converter:** Bi-directional table-to-JSON and JSON-to-table local transformer with delimiter detection.
- [x] **Regex Tester:** Live regular expression sandbox with real-time match highlighting, error flags, and cheatsheet presets.
- [x] **JWT Decoder:** Client-side token header/payload claims inspector with expiration countdown validation.
- [x] **Image to Base64 (Data URI):** Converts images to Data URIs, HTML `<img>` tags, and CSS background rules.
- [x] **Bulk UUID / GUID Generator:** Cryptographically secure RFC 4122 v4 UUID generator with count and formatting controls.
- [x] **SQL Formatter:** Beautify, uppercase, and indent SQL clauses with clean clause indentation and minification.

## Phase 5: SEO & Discoverability
- [x] **Full XML Sitemap:** Comprehensive `sitemap.xml` listing all 32 tools with weekly change frequency and 0.9 priority.
- [x] **Schema.org Structured Data:** JSON-LD `WebApplication` and `FAQPage` schemas on every tool page.
- [x] **Search Engine Directives:** Clean `robots.txt` pointing to sitemap.

## Phase 6: Client-Side PDF & Document Powerhouse (Zero Uploads)
*Goal: Complete suite of local in-browser PDF utilities replacing invasive cloud services.*
- [x] **PDF Merger / Combiner (`pdf-merger`):** Merge and combine multiple PDFs with drag-and-drop order rearrangement and page count calculations.
- [x] **PDF Page Rotator (`pdf-rotator`):** Correct 90°, 180°, and 270° orientation across all pages, odd/even pages, or custom ranges.
- [x] **Images to PDF Converter (`images-to-pdf`):** Batch compile JPG, PNG, and WebP images into standardized A4 or auto-fit multi-page PDFs.
- [x] **PDF Watermark & Stamp (`pdf-watermarker`):** Stamp "CONFIDENTIAL", "DRAFT", or custom text diagonally across every page with opacity and color styling.
- [x] **PDF Metadata Inspector & Stripper (`pdf-metadata-editor`):** View and wipe author, title, keywords, software creator, and producer metadata for total privacy.
- [x] **PDF Page Numberer (`pdf-page-numberer`):** Add formatted page numbers (e.g., "Page 1 of N", "1 / N") to bottom-center, bottom-right, or top-right with cover-page skip.

---

## 📦 Total Tools in Registry: 38 Tools
1. `base64-encoder-decoder`
2. `case-converter`
3. `chmod-calculator`
4. `curl-converter`
5. `csv-json-converter`
6. `date-calculator`
7. `excel-formula-builder`
8. `exif-metadata-stripper`
9. `hex-color-converter`
10. `image-compressor`
11. `image-to-base64`
12. `images-to-pdf` *(New)*
13. `json-formatter`
14. `json-to-typescript`
15. `jwt-decoder`
16. `markdown-preview`
17. `pdf-merger` *(New)*
18. `pdf-metadata-editor` *(New)*
19. `pdf-page-numberer` *(New)*
20. `pdf-rotator` *(New)*
21. `pdf-splitter`
22. `pdf-watermarker` *(New)*
23. `percentage-calculator`
24. `pomodoro-timer`
25. `qr-code-generator`
26. `random-name-picker`
27. `regex-tester`
28. `secure-password-generator`
29. `sha256-hash-generator`
30. `social-seo-previewer`
31. `sql-formatter`
32. `svg-optimizer`
33. `text-diff-checker`
34. `time-zone-converter`
35. `unit-converter`
36. `unix-timestamp-converter`
37. `url-link-cleaner`
38. `uuid-generator`