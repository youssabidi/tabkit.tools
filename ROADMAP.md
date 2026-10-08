# TabKit Tools - Development Roadmap

## 1. Dashboard UX & Customization (The "Pro" Feel)
- [ ] **Drag-and-Drop Reordering:** Allow users to click and drag tools on the grid to rearrange their layout.
- [ ] **Collapsible / Resizable Cards:** Add a "minimize" button to tool cards, or allow cards to span 2 columns (useful for the Text Diff Checker).
- [ ] **Light / Dark / System Theme:** Add a theme toggle that saves to `localStorage`.
- [ ] **Keyboard Navigation (a11y):** Enhance the `Ctrl+K` command palette so users can navigate results with the `Up/Down` arrow keys and hit `Enter` to pin a tool.

## 2. Powerful New Developer & Utility Tools
- [ ] **JWT Decoder:** Decode JSON Web Tokens (JWT) locally to read the payload without pasting secure tokens into random websites.
- [ ] **Regex Tester:** A local sandbox to write and test Regular Expressions against dummy text, with live highlighting.
- [ ] **Markdown Preview & Editor:** A dual-pane editor where typing Markdown on the left renders formatted HTML on the right.
- [ ] **CRON Job Translator:** Translate `0 12 * * 1-5` into human-readable text ("At 12:00 PM, Monday through Friday").
- [ ] **CSS Format/Minify:** Similar to the JSON tool, but for CSS.

## 3. Enhancements to Existing Tools
- [ ] **JSON Formatter:** Add **Syntax Highlighting** (coloring keys blue, strings green, etc.).
- [ ] **Pomodoro Timer:** Add browser notifications (via the Notification API) when a sprint finishes.
- [ ] **World Time Zone:** Add the ability to rename a pinned time zone (e.g., rename "America/Los_Angeles" to "Dev Team HQ").

## 4. Codebase Architecture (DRY)
- [ ] **Web Components:** Extract the `<header>` and `<footer>` into native HTML Web Components so navigation updates only need to be made in one file.
- [ ] **Dynamic Script Loading:** Split `tools.js` into smaller modules. Load tool logic only when a user pins that specific tool (e.g., `import('./tools/qr-generator.js')`).

## 5. Progressive Web App (PWA) Upgrades
- [ ] **"Install App" Button:** Add a button in the header that triggers the native browser prompt to "Install as App" (Desktop/Mobile).
- [ ] **Update Notification:** Modify the Service Worker to detect new code publications and show a "Refresh to update" toast.
## 6. New Data & Developer Tools
CSV ↔ JSON Converter: Instantly convert CSV data from Excel into JSON arrays, or vice versa, completely locally.
URL & HTML Entity Encoder/Decoder: A quick tool to encode/decode URL strings (%20, %3F) and HTML entities (&amp;, &lt;).
Bulk UUID / GUID Generator: Generate thousands of unique identifiers (v4) instantly using the crypto.randomUUID() API.
Image to Base64 (Data URI) Generator: Allow users to drop a small image file (PNG/SVG) into the browser and instantly get the Base64 string for CSS/HTML embedding using the FileReader API.
SQL Formatter: Beautify and format messy, single-line SQL queries into readable, indented code.
## 7. Advanced Workspace Features
Multiple Workspaces (Tabs): Instead of just one grid, allow users to create multiple dashboards (e.g., "Development", "Writing", "Daily Admin") and switch between them.
Local History & Logs: For tools like the Hash Generator, Base64, or Password Generator, keep a short "Last 5 Results" history log stored securely in local memory.
Collapsible Sidebar: As the tool catalog grows to 50+, a sidebar for navigating categories (Text, Math, Dev, Media) might be faster than the command palette for discovery.
Local Usage Stats (Gamification): A strictly offline dashboard showing stats like "Time spent in Pomodoro," "URLs Cleaned," or "Passwords Generated."
## 8. Enhanced Data Portability
Encrypted Cloud Sync (Opt-in): While the app is zero-server, you could add a feature where users can connect their own Google Drive or Dropbox to sync their tabkit_pinned_tools and settings across devices using OAuth.
Auto-Backup: Automatically trigger a JSON download of the user's workspace config every Friday.