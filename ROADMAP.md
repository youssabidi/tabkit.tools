# TabKit Tools - Master Roadmap

## Phase 1: Polish & App Experience (The "Premium" Feel)
*Goal: Make the existing 25 tools feel like a professional, expensive desktop app.*
- [ ] **Light / Dark Theme Toggle:** Add a slick switch that remembers the user's preference using `localStorage`.
- [ ] **"Install App" Button (PWA):** Expose a button so users can install TabKit to their Windows Desktop or Phone home screen for instant offline access.
- [ ] **Instant Search & Keyboard Navigation:** Upgrade the tool drawer so users can type to instantly filter the 25 tools, and navigate with their arrow keys.
- [ ] **Syntax Highlighting:** Add colorful text rendering to the JSON Formatter so code is actually readable.

## Phase 2: Workspace Customization (User Control)
*Goal: Allow users to make the dashboard truly their own, which keeps them coming back.*
- [ ] **Drag-and-Drop Reordering:** Let users click, hold, and drag tool cards to reorganize their grid.
- [ ] **Resizable Cards:** Allow certain tools (like the Text Diff Checker or PDF Splitter) to be dragged wider to span two columns for better visibility.
- [ ] **Multiple Workspaces (Tabs):** Let users create separate dashboards (e.g., a "Dev Tools" tab, a "Daily Admin" tab) instead of cramping everything into one grid.

## Phase 3: "Supercharging" Existing Tools
*Goal: Take the best tools and make them vastly superior to standard online converters.*
- [ ] **Visual PDF Splitter:** Instead of typing page numbers, show actual image thumbnails of the PDF pages so the user can click to delete them.
- [ ] **Batch Image Compression:** Allow users to drop multiple images at once into the compressor, and add width/height resizing sliders.
- [ ] **Browser Notifications:** Connect the Pomodoro Timer to the browser's native notification system so it pings the user even if they are in another tab.
- [ ] **Tool Chaining ("Send To..."):** Add a button that lets a user send data directly from one tool to another (e.g., format JSON, then click "Send to TypeScript Converter").

## Phase 4: High-Value New Tools (Expanding the Arsenal)
*Goal: Build highly-requested developer/data tools to attract specific niches.*
- [ ] **Markdown Preview Editor:** A dual-pane text editor that renders HTML live as you type.
- [ ] **CSV ↔ JSON Converter:** For data analysts wanting instant offline data conversion.
- [ ] **Regex Tester:** A sandbox for developers to test code patterns safely.
- [ ] **JWT Decoder:** Decode JSON Web Tokens locally to read payloads securely.
- [ ] **Image to Base64 (Data URI):** Quickly drop an image to get its CSS-ready string.
- [ ] **Bulk UUID / GUID Generator:** Generate thousands of unique identifiers offline.
- [ ] **SQL Formatter:** Beautify and format messy, single-line SQL queries.

---

## ✅ Completed Milestones
- [x] **Web Components Architecture:** Extract `<header>` and `<footer>` for DRY navigation.
- [x] **Dynamic Script Loading:** Split monolithic `tools.js` into modular files (`tools/*.js`) that load only when pinned.
- [x] **Offline Privacy Suite:** Built 9 new offline tools (PDF Splitter, Image Compressor, EXIF Stripper, curl converter, etc.).
- [x] **CSS Compilation:** Migrated from Tailwind CDN to a local compiled `styles.css` using Tailwind v4.