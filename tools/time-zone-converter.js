// Tool: time-zone-converter
window.TOOLS_REGISTRY = window.TOOLS_REGISTRY || {};
window.TOOLS_REGISTRY['time-zone-converter'] = Object.assign(window.TOOLS_REGISTRY['time-zone-converter'] || {}, {
    id: 'time-zone-converter',
    name: 'World Time Zone Converter',
    category: 'Productivity & Math',
    standaloneUrl: '/time-zone-converter.html',
    description: 'Interactive world clock with 25,000+ searchable cities and synchronized hour slider.',
    render: (toolId) => `
      <div class="flex flex-col h-full space-y-3 font-sans">
        <div class="relative">
          <input id="${toolId}_search" type="text" placeholder="Search any city (e.g. Osaka, Doha, Miami) or country..." class="w-full bg-workspace-bg border border-workspace-border rounded-lg px-2.5 py-1.5 text-base sm:text-xs font-mono text-workspace-text placeholder-workspace-muted focus:border-workspace-accent focus:outline-none" autocomplete="off" />
          <div id="${toolId}_statusBadge" class="absolute right-2.5 top-2 text-[10px] font-mono text-workspace-muted hidden"></div>
          <div id="${toolId}_results" class="absolute left-0 right-0 top-full mt-1 bg-workspace-surface border border-workspace-border rounded-lg max-h-52 overflow-y-auto hidden z-30 shadow-2xl p-1 text-xs"></div>
        </div>
        <div class="flex items-center justify-between text-xs font-mono">
          <span class="text-workspace-muted">Drag Hour:</span>
          <span id="${toolId}_selectedHour" class="text-workspace-accent font-bold text-sm">12:00 UTC</span>
        </div>
        <input id="${toolId}_slider" type="range" min="0" max="23" value="12" step="1" class="w-full accent-workspace-accent cursor-pointer bg-workspace-bg rounded-lg h-2" />
        <div id="${toolId}_zonesContainer" class="space-y-1.5 max-h-56 overflow-y-auto font-mono text-xs"></div>
      </div>
    `,
    init: (toolId) => {
      let pinned = JSON.parse(localStorage.getItem('tabkit_tz_pinned') || '["Asia/Qatar", "Africa/Tunis", "UTC", "America/New_York"]');
      const slider = document.getElementById(`${toolId}_slider`);
      const label = document.getElementById(`${toolId}_selectedHour`);
      const container = document.getElementById(`${toolId}_zonesContainer`);
      const search = document.getElementById(`${toolId}_search`);
      const results = document.getElementById(`${toolId}_results`);
      const badge = document.getElementById(`${toolId}_statusBadge`);
      let searchTimer = null;

      const currentUtc = new Date().getUTCHours();
      if (slider) slider.value = currentUtc;
      if (label) label.textContent = `${String(currentUtc).padStart(2, '0')}:00 UTC`;

      function getZoneDisplay(iana, utcHour) {
        try {
          const now = new Date();
          const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), utcHour, 0, 0));
          const timeStr = date.toLocaleTimeString('en-US', { timeZone: iana, hour: '2-digit', minute: '2-digit', hour12: false });
          const hour = parseInt(timeStr.split(':')[0], 10);
          const isWork = hour >= 9 && hour <= 18;
          return { timeStr, isWork };
        } catch (e) {
          return { timeStr: '--:--', isWork: false };
        }
      }

      function renderPinnedZones() {
        if (!container) return;
        container.innerHTML = pinned.map(iana => {
          const parts = iana.split('/');
          const title = parts[parts.length - 1].replace(/_/g, ' ');
          const subtitle = parts[0] || 'Zone';
          const { timeStr, isWork } = getZoneDisplay(iana, parseInt(slider.value, 10));

          return `
            <div class="flex items-center justify-between p-2 rounded bg-workspace-bg border border-workspace-border">
              <div>
                <div class="flex items-center gap-1.5">
                  <span class="text-workspace-text font-bold">${title}</span>
                  <span class="text-workspace-muted text-[11px]">— ${subtitle}</span>
                </div>
                <span class="text-[10px] text-workspace-muted">${iana}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-sm ${isWork ? 'text-workspace-accent' : 'text-workspace-muted'}">${timeStr}</span>
                <button data-remove-iana="${iana}" title="Remove zone" class="text-workspace-muted hover:text-workspace-danger p-0.5 rounded text-xs leading-none">×</button>
              </div>
            </div>
          `;
        }).join('');

        container.querySelectorAll('[data-remove-iana]').forEach(btn => {
          btn.onclick = () => {
            pinned = pinned.filter(z => z !== btn.dataset.removeIana);
            localStorage.setItem('tabkit_tz_pinned', JSON.stringify(pinned));
            renderPinnedZones();
            if (typeof updateStorageIndicator === 'function') updateStorageIndicator();
          };
        });
      }

      if (slider) {
        slider.oninput = () => {
          if (label) label.textContent = `${String(slider.value).padStart(2, '0')}:00 UTC`;
          renderPinnedZones();
        };
      }

      if (search) {
        search.addEventListener('focus', async () => {
          if (!citiesDataset) {
            if (badge) badge.classList.remove('hidden');
            await loadCitiesDatabase((msg) => {
              if (badge) {
                badge.textContent = msg;
                if (!msg) badge.classList.add('hidden');
              }
            });
          }
        });

        search.oninput = () => {
          clearTimeout(searchTimer);
          searchTimer = setTimeout(async () => {
            const q = search.value.toLowerCase().trim();
            if (!q) {
              if (results) results.classList.add('hidden');
              return;
            }
            const data = await loadCitiesDatabase();
            if (!data || !results) return;

            const matches = [];
            for (let i = 0; i < data.length; i++) {
              if (data[i].tokens.includes(q)) {
                matches.push(data[i]);
                if (matches.length >= 15) break;
              }
            }

            if (!matches.length) {
              results.innerHTML = `<div class="p-2 text-center text-workspace-muted text-xs font-mono">No matching cities found</div>`;
            } else {
              results.innerHTML = matches.map(item => `
                <div data-pick-iana="${item.iana}" class="p-2 hover:bg-workspace-surfaceHover rounded cursor-pointer flex items-center justify-between">
                  <div>
                    <span class="font-bold text-workspace-text">${item.city}</span>
                    <span class="text-workspace-muted text-[11px]"> (${item.country})</span>
                  </div>
                  <span class="text-[10px] font-mono text-workspace-accent">${item.iana}</span>
                </div>
              `).join('');

              results.querySelectorAll('[data-pick-iana]').forEach(row => {
                row.onclick = () => {
                  const pick = row.dataset.pickIana;
                  if (!pinned.includes(pick)) {
                    pinned.push(pick);
                    localStorage.setItem('tabkit_tz_pinned', JSON.stringify(pinned));
                    renderPinnedZones();
                    if (typeof updateStorageIndicator === 'function') updateStorageIndicator();
                  }
                  search.value = '';
                  results.classList.add('hidden');
                };
              });
            }
            results.classList.remove('hidden');
          }, 120);
        };
      }

      window.addEventListener('click', (e) => {
        if (search && results && !search.contains(e.target) && !results.contains(e.target)) {
          results.classList.add('hidden');
        }
      });

      renderPinnedZones();
    }
  });
