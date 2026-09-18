/* Demo UI. All data and logic come from the app's own compiled modules on window.OT. */
(function () {
  const { destinations, themes } = OT.destinations;
  const { states, zones, zoneBlurbs, getState } = OT.states;
  const { guides } = OT.guides;
  const { themeEmoji, formatDays, shortDays, seasonBadge } = OT.format;
  const { sceneSvg } = OT.scene;
  const { buildTrip, formatMonths, monthName, monthFull } = OT.trip;
  const { circuits, circuitSummary } = OT.circuits;
  const { tripToText, tripToIcs, downloadFile, tripShareUrl } = OT.exportTrip;

  const bySlug = (s) => destinations.find((d) => d.slug === s);
  const esc = (s) =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  /* ---------- Trip Bag ---------- */
  const KEY = "onlytravelers.demo.cart.v3";
  let cart = [];
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (Array.isArray(p)) cart = p.filter((s) => typeof s === "string" && bySlug(s));
    }
  } catch (e) {}
  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(cart));
    } catch (e) {}
  };
  const inCart = (s) => cart.includes(s);
  const cartItems = () => cart.map(bySlug).filter(Boolean);

  function toggle(slug) {
    cart = inCart(slug) ? cart.filter((s) => s !== slug) : cart.concat(slug);
    save();
    badge();
    if (route().view === "destinations") updateGrid();
    else render(false);
  }
  function removeItem(slug) {
    cart = cart.filter((s) => s !== slug);
    save();
    badge();
    render(false);
  }
  function clearCart() {
    cart = [];
    save();
    badge();
    render(false);
  }
  function badge() {
    const el = document.getElementById("cart-badge");
    el.textContent = String(cart.length);
    el.hidden = cart.length === 0;
  }

  /* ---------- shared bits ---------- */
  function scene(slug, themesList, w, h, cls) {
    return `<div class="scene ${cls || ""}">${sceneSvg(slug, themesList, { width: w, height: h })}</div>`;
  }

  function bagButton(slug, extra, big) {
    const on = inCart(slug);
    return `<button type="button" data-toggle="${slug}" class="${extra || ""} rounded-lg font-semibold transition ${
      big ? "px-6 py-3 text-base" : "px-3 py-2 text-sm"
    } ${on ? "border bd surface-alt txt" : "bg-accent"}">${on ? "In your Trip Bag ✓" : "Add to Trip Bag"}</button>`;
  }

  function card(d) {
    const g = guides[d.slug];
    return `
    <article class="group flex flex-col overflow-hidden rounded-2xl border bd surface shadow-card transition hover:-translate-y-1">
      <a href="#/destinations/${d.slug}" class="relative block aspect-[3/2]">
        ${scene(d.slug, d.themes, 360, 240, "h-full")}
        <span class="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-navy-800">${esc(d.stateName)}</span>
        ${d.permitRequired ? '<span class="absolute right-3 top-3 rounded-full bg-accent px-2 py-1 text-[10px] font-bold uppercase">Permit</span>' : ""}
      </a>
      <div class="flex flex-1 flex-col gap-2 p-4">
        <div class="flex flex-wrap gap-1.5">
          ${d.themes.slice(0, 3).map((t) => `<span class="rounded-full surface-alt px-2 py-0.5 text-[11px] font-medium txt-muted">${themeEmoji[t]} ${t}</span>`).join("")}
        </div>
        <a href="#/destinations/${d.slug}"><h3 class="font-display text-lg font-semibold leading-snug txt group-hover:accent">${esc(d.name)}</h3></a>
        <p class="text-xs txt-faint">${esc(d.district)}</p>
        ${g ? `<p class="line-clamp-3 text-sm txt-muted">${esc(g.summary)}</p>` : ""}
        <div class="mt-auto flex items-center justify-between pt-2 text-xs txt-faint">
          <span>${shortDays(d.idealDays)}</span><span>${esc(d.bestMonthsLabel)}</span>
        </div>
        ${bagButton(d.slug, "mt-2 w-full")}
      </div>
    </article>`;
  }

  /* ---------- locator map ---------- */
  const OUTLINE = [
    [68.2, 23.7], [68.5, 24.3], [70, 24.3], [70.6, 27.7], [72.9, 28], [73.9, 30.1], [74.6, 31.7],
    [74, 32.5], [74.3, 34.1], [76, 34.6], [77.8, 35.5], [78.9, 34.4], [79.2, 33], [79, 32],
    [80.1, 30.6], [81, 30.2], [82.5, 30.1], [84, 29], [86, 28], [88, 27.9], [88.7, 26.5],
    [89.8, 26.7], [92, 27.5], [94.5, 28], [96.5, 28.5], [97.3, 28.2], [96.5, 27], [95, 26.6],
    [94.6, 25.2], [93.4, 24], [92.5, 22], [91.5, 22.8], [89.5, 22], [88, 21.6], [86.5, 20.5],
    [85, 19.5], [83, 17.5], [80.3, 15.8], [80.2, 13.5], [79.8, 10.3], [79, 9.3], [78.2, 8.4],
    [77.5, 8.1], [76.5, 9.5], [75.7, 11.6], [74.8, 13], [73.8, 15.5], [72.8, 18.9], [72.6, 21.5],
    [70, 20.8], [69, 22.3],
  ];
  const SIZE = 300, PAD = 12;
  const proj = (lng, lat) => [
    Math.round((PAD + ((lng - 67) / 31) * (SIZE - PAD * 2)) * 10) / 10,
    Math.round((PAD + ((37 - lat) / 31) * (SIZE - PAD * 2)) * 10) / 10,
  ];
  function stateMap(stateId) {
    const st = getState(stateId);
    if (!st) return "";
    const path = OUTLINE.map(([lng, lat], i) => {
      const [x, y] = proj(lng, lat);
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    }).join(" ") + " Z";
    const [px, py] = proj(st.lng, st.lat);
    const dots = states
      .filter((s) => s.id !== st.id)
      .map((s) => {
        const [x, y] = proj(s.lng, s.lat);
        return `<circle cx="${x}" cy="${y}" r="1.8" fill="#b0c1d9"/>`;
      })
      .join("");
    const right = px > SIZE * 0.72;
    return `<svg viewBox="0 0 ${SIZE} ${SIZE}" class="aspect-square w-full rounded-lg" style="background:var(--surface-alt)" role="img" aria-label="Locator map for ${esc(st.name)}">
      <path d="${path}" fill="#e4ebf3" stroke="#b0c1d9" stroke-width="1.2" stroke-linejoin="round"/>
      ${dots}
      <circle cx="${px}" cy="${py}" r="13" fill="#e8492a" opacity="0.18"/>
      <circle cx="${px}" cy="${py}" r="6" fill="#e8492a" stroke="#fff" stroke-width="2"/>
      <text x="${right ? px - 10 : px + 10}" y="${py + 4}" text-anchor="${right ? "end" : "start"}" font-size="11" font-weight="600" fill="#0b1b30">${esc(st.capital)}</text>
    </svg>`;
  }

  /* ---------- views ---------- */
  const FEATURED = [
    "taj-mahal-agra", "alleppey-backwaters", "hampi-unesco",
    "pangong-tso", "living-root-bridges-nongriat", "white-rann-dhordo",
  ];

  function homeView() {
    return `
    <section class="topo border-b bd">
      <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <p class="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white" style="background:#0b1b30;">Be travelers, not tourists</p>
        <h1 class="font-display max-w-3xl text-4xl font-bold leading-[1.1] txt sm:text-6xl">Before life gets too busy, travel.</h1>
        <p class="mt-6 max-w-xl text-lg txt-muted">Every state, every union territory, ${destinations.length} destinations — each with what it is, how long it deserves, when to go and how to reach it. Add the ones that pull you in, and we build the whole trip around them.</p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a href="#/destinations" class="rounded-lg bg-accent px-6 py-3 text-sm font-semibold shadow-card">Explore ${destinations.length} destinations</a>
          <a href="#/trip" class="rounded-lg border bd surface px-6 py-3 text-sm font-semibold txt">Build my trip</a>
        </div>
        <dl class="mt-12 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
          ${[["36", "states & UTs"], [String(destinations.length), "destinations"], ["6", "zones"], ["100%", "with a guide"]]
            .map(([v, l]) => `<div><dt class="font-display text-2xl font-bold txt">${v}</dt><dd class="text-xs uppercase tracking-wide txt-faint">${l}</dd></div>`)
            .join("")}
        </dl>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div class="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 class="font-display text-2xl font-semibold txt">Start somewhere</h2>
          <p class="mt-1 text-sm txt-muted">Six that show the range of what is in here.</p>
        </div>
        <a href="#/destinations" class="shrink-0 text-sm font-semibold accent">View all →</a>
      </div>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">${FEATURED.map(bySlug).filter(Boolean).map(card).join("")}</div>
    </section>

    <section class="border-y bd surface py-14">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 class="font-display mb-2 text-2xl font-semibold txt">Travel by what pulls you in</h2>
        <p class="mb-6 text-sm txt-muted">Fourteen themes across the whole catalogue.</p>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          ${themes
            .map((t) => {
              const n = destinations.filter((d) => d.themes.includes(t)).length;
              return `<a href="#/destinations?theme=${encodeURIComponent(t)}" class="flex flex-col items-center gap-1 rounded-xl border bd px-3 py-5 text-center transition hover:-translate-y-0.5" style="background:var(--bg)">
                <span class="text-2xl" aria-hidden="true">${themeEmoji[t]}</span>
                <span class="text-xs font-semibold txt">${t}</span><span class="text-[11px] txt-faint">${n}</span></a>`;
            })
            .join("")}
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h2 class="font-display mb-2 text-2xl font-semibold txt">India, state by state</h2>
      <p class="mb-6 text-sm txt-muted">Six zones, 36 states and union territories. Every one of them is covered.</p>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        ${zones
          .map((z) => {
            const n = destinations.filter((d) => d.zone === z).length;
            const sc = states.filter((s) => s.zone === z).length;
            return `<a href="#/states?zone=${encodeURIComponent(z)}" class="rounded-xl border bd surface p-5 shadow-card transition hover:-translate-y-0.5">
              <div class="flex items-baseline justify-between"><h3 class="font-display font-semibold txt">${z}</h3><span class="text-xs txt-faint">${n} places</span></div>
              <p class="mt-2 text-sm txt-muted">${esc(zoneBlurbs[z])}</p>
              <p class="mt-3 text-xs txt-faint">${sc} states &amp; UTs</p></a>`;
          })
          .join("")}
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      <div class="grid gap-10 rounded-2xl p-10 text-white sm:grid-cols-2 sm:p-14" style="background:#0b1b30;">
        <div>
          <h2 class="font-display text-3xl font-bold">A Trip Bag that turns into a real itinerary.</h2>
          <p class="mt-4 text-navy-200">Not a list of places — a plan. We sequence your picks by zone and state, add the travel between them with mode and hours, work out which months actually suit the whole trip, and flag the permits and ferries that catch people out.</p>
          <a href="#/trip" class="mt-6 inline-block rounded-lg bg-accent px-6 py-3 text-sm font-semibold">Build my trip</a>
        </div>
        <ul class="flex flex-col justify-center gap-3">
          ${[["🗺️", "Route sequenced across zones, states and districts"], ["🚆", "Every hop costed: flight, train or road, with hours"], ["📅", "Day-by-day plan, travel days included"], ["🛂", "Permit, ferry, altitude and season warnings"]]
            .map(([i, t]) => `<li class="flex items-center gap-3 rounded-lg p-4" style="background:rgba(255,255,255,0.07)"><span class="text-xl" aria-hidden="true">${i}</span><span class="text-sm">${t}</span></li>`)
            .join("")}
        </ul>
      </div>
    </section>`;
  }

  /* ---------- destinations explorer ---------- */
  const filters = { q: "", zone: "All", state: "All", theme: "All", month: 0, days: 0, visible: 24 };

  function filtered() {
    const q = filters.q.trim().toLowerCase();
    return destinations.filter((d) => {
      if (filters.zone !== "All" && d.zone !== filters.zone) return false;
      if (filters.state !== "All" && d.stateId !== filters.state) return false;
      if (filters.theme !== "All" && !d.themes.includes(filters.theme)) return false;
      if (filters.month && !d.bestMonths.includes(filters.month)) return false;
      if (filters.days && d.idealDays > filters.days) return false;
      if (q) {
        const g = guides[d.slug];
        const hay = `${d.name} ${d.district} ${d.stateName} ${d.rawTheme} ${g ? g.summary : ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  function updateGrid() {
    const list = filtered();
    const grid = document.getElementById("dest-grid");
    if (!grid) return;
    grid.innerHTML = list.length
      ? list.slice(0, filters.visible).map(card).join("")
      : '<div class="col-span-full rounded-xl border border-dashed bd p-10 text-center txt-faint">Nothing matches those filters. Try widening the month or the length.</div>';
    const count = document.getElementById("dest-count");
    if (count) count.textContent = `Showing ${Math.min(filters.visible, list.length)} of ${list.length} destinations`;
    const more = document.getElementById("more-wrap");
    if (more) {
      const remaining = list.length - filters.visible;
      more.hidden = remaining <= 0;
      const btn = document.getElementById("more-btn");
      if (btn && remaining > 0) btn.textContent = `Show ${Math.min(24, remaining)} more`;
    }
  }

  function destinationsView() {
    const sel = "rounded-lg border bd px-3 py-2.5 text-sm txt";
    const stateOpts = states.filter((s) => filters.zone === "All" || s.zone === filters.zone);
    const list = filtered();
    return `
    <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 class="font-display text-3xl font-bold txt">All destinations</h1>
      <p class="mt-2 max-w-2xl txt-muted">${destinations.length} places across all 36 states and union territories. Filter by where you are going, what you like, when you can travel, or how much time you have.</p>
      <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <input id="f-q" type="text" value="${esc(filters.q)}" placeholder="Search a place, district or state…" class="rounded-lg border bd px-4 py-2.5 text-sm txt lg:col-span-3"/>
        <select id="f-zone" class="${sel}"><option value="All">All zones</option>${zones.map((z) => `<option value="${z}"${filters.zone === z ? " selected" : ""}>${z}</option>`).join("")}</select>
        <select id="f-state" class="${sel}"><option value="All">All states &amp; UTs</option>${stateOpts.map((s) => `<option value="${s.id}"${filters.state === s.id ? " selected" : ""}>${esc(s.name)}</option>`).join("")}</select>
        <select id="f-theme" class="${sel}"><option value="All">All themes</option>${themes.map((t) => `<option value="${t}"${filters.theme === t ? " selected" : ""}>${t}</option>`).join("")}</select>
        <select id="f-month" class="${sel}"><option value="0">Any month</option>${Array.from({ length: 12 }, (_, i) => i + 1).map((m) => `<option value="${m}"${filters.month === m ? " selected" : ""}>Good in ${monthName(m)}</option>`).join("")}</select>
        <select id="f-days" class="${sel}">${[[0, "Any length"], [0.5, "Half a day"], [1, "Up to 1 day"], [2, "Up to 2 days"], [3, "Up to 3 days"], [5, "Up to 5 days"]].map(([v, l]) => `<option value="${v}"${filters.days === v ? " selected" : ""}>${l}</option>`).join("")}</select>
        <button type="button" data-clear-filters class="rounded-lg border bd px-3 py-2.5 text-sm font-semibold accent">Clear filters</button>
      </div>
      <p id="dest-count" class="mt-4 text-sm txt-faint">Showing ${Math.min(filters.visible, list.length)} of ${list.length} destinations</p>
      <div id="dest-grid" class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">${list.slice(0, filters.visible).map(card).join("")}</div>
      <div id="more-wrap" class="mt-10 text-center"${list.length > filters.visible ? "" : " hidden"}>
        <button id="more-btn" type="button" data-more class="rounded-lg border bd surface px-6 py-3 text-sm font-semibold txt">Show 24 more</button>
      </div>
    </div>`;
  }

  /* ---------- detail ---------- */
  function detailView(slug) {
    const d = bySlug(slug);
    if (!d) {
      return `<div class="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 class="font-display text-3xl font-bold txt">We haven't mapped that one</h1>
        <a href="#/destinations" class="mt-6 inline-block rounded-lg bg-accent px-6 py-3 text-sm font-semibold">Explore destinations</a></div>`;
    }
    const st = getState(d.stateId);
    const g = guides[d.slug];
    const season = seasonBadge(d);
    const nearby = destinations.filter((x) => x.slug !== d.slug && x.stateId === d.stateId).slice(0, 3);
    const tone =
      season.tone === "monsoon" ? "background:#d1fae5;color:#065f46"
      : season.tone === "year" ? "background:#e0f2fe;color:#075985"
      : "background:#fef3c7;color:#92400e";

    return `
    <article>
      <div class="relative aspect-[16/5]">
        ${scene(d.slug, d.themes, 640, 200, "absolute inset-0 h-full w-full")}
        <div class="absolute inset-0" style="background:linear-gradient(to top, rgba(8,19,36,.88), rgba(8,19,36,.25) 55%, transparent)"></div>
        <div class="absolute inset-x-0 bottom-0">
          <div class="mx-auto max-w-6xl px-4 pb-6 sm:px-6 sm:pb-8">
            <a href="#/destinations" class="text-sm font-medium text-white/80">← All destinations</a>
            <h1 class="font-display mt-2 text-3xl font-bold text-white sm:text-5xl">${esc(d.name)}</h1>
          </div>
        </div>
      </div>

      <div class="border-b bd surface">
        <div class="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 text-sm sm:px-6">
          <span class="txt-muted">${esc(d.district)} · <a href="#/states/${st.id}" class="font-semibold txt">${esc(st.name)}</a> · ${d.zone}</span>
          <span class="flex flex-wrap gap-1.5">${d.themes.map((t) => `<span class="rounded-full surface-alt px-2 py-0.5 text-[11px] font-medium txt-muted">${themeEmoji[t]} ${t}</span>`).join("")}</span>
          <span class="rounded-full px-2.5 py-1 text-[11px] font-semibold text-white" style="background:#0b1b30">${formatDays(d.idealDays)}</span>
          <span class="rounded-full px-2.5 py-1 text-[11px] font-semibold" style="${tone}">${esc(season.label)}</span>
        </div>
      </div>

      <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div class="grid gap-10 lg:grid-cols-3">
          <div class="lg:col-span-2">
            ${g ? `
              <h2 class="font-display text-2xl font-semibold txt">About ${esc(d.name)}</h2>
              <p class="mt-3 max-w-[65ch] txt-muted">${esc(g.summary)}</p>
              <h3 class="mt-8 font-display text-lg font-semibold txt">What to do</h3>
              <ul class="mt-3 flex flex-col gap-2">${g.highlights.map((h) => `<li class="flex gap-2 txt-muted"><span class="accent">✓</span><span>${esc(h)}</span></li>`).join("")}</ul>
              <div class="mt-8 rounded-xl border bd surface-alt p-5">
                <h3 class="font-display text-xs font-semibold uppercase tracking-wide txt-faint">Traveler tip</h3>
                <p class="mt-2 txt">${esc(g.tip)}</p>
              </div>` : ""}

            <h3 class="mt-10 font-display text-lg font-semibold txt">How to reach</h3>
            <dl class="mt-3 grid gap-3 sm:grid-cols-2">
              ${[["Nearest airports", st.airports.join(" · ")], ["Railhead", st.railhead], ["Where to base", `${d.district}, or ${st.capital} for connections`], ["State peak season", st.peakSeason]]
                .map(([l, v]) => `<div class="rounded-lg border bd surface p-4"><dt class="text-xs uppercase tracking-wide txt-faint">${l}</dt><dd class="mt-1 font-semibold txt">${esc(v)}</dd></div>`)
                .join("")}
            </dl>

            ${d.permitRequired ? `<div class="mt-6 rounded-xl border-l-4 p-4" style="border-color:#e8492a;background:rgba(232,73,42,.09)"><h4 class="font-display text-sm font-bold accent">Permit required</h4><p class="mt-1 text-sm txt-muted">An Inner Line Permit must be arranged in advance through a registered agent or the state portal — it is not issued on arrival, and you will be turned back at the checkpost without one.</p></div>` : ""}
            ${d.ferryOrFlightOnly ? `<div class="mt-4 rounded-xl border-l-4 p-4" style="border-color:#0ea5e9;background:rgba(14,165,233,.1)"><h4 class="font-display text-sm font-bold" style="color:#0369a1">Ferry and flight constrained</h4><p class="mt-1 text-sm txt-muted">Sailings and island flights are limited and fill early. Lock transport before booking a room, not after.</p></div>` : ""}
            ${d.monsoonProduct ? `<div class="mt-4 rounded-xl border-l-4 p-4" style="border-color:#10b981;background:rgba(16,185,129,.1)"><h4 class="font-display text-sm font-bold" style="color:#047857">A monsoon destination</h4><p class="mt-1 text-sm txt-muted">At its best in the rains, when most of the country is off-season. Go between June and September and you get it at full force.</p></div>` : ""}

            <h3 class="mt-10 font-display text-lg font-semibold txt">Gallery</h3>
            <div class="mt-3 grid gap-3 sm:grid-cols-3">
              ${[0, 1, 2].map((i) => `<div class="aspect-[3/2] overflow-hidden rounded-lg">${scene(d.slug + "-" + i, d.themes, 300, 200, "h-full")}</div>`).join("")}
            </div>
            <p class="mt-2 text-xs txt-faint">Generated artwork. Photograph slots are ready — licensed or own photographs drop straight into these.</p>
          </div>

          <aside>
            <div class="flex flex-col gap-4 lg:sticky lg:top-24">
              <div class="rounded-2xl border bd surface p-6 shadow-card">
                <dl class="flex flex-col gap-3 text-sm">
                  ${[["Time here", formatDays(d.idealDays)], ["Best months", d.bestMonthsLabel], ["Theme", d.rawTheme], ["District", d.district]]
                    .map(([l, v]) => `<div class="flex justify-between gap-4"><dt class="txt-faint">${l}</dt><dd class="text-right font-semibold txt">${esc(v)}</dd></div>`)
                    .join("")}
                </dl>
                <p class="mt-4 rounded-lg surface-alt p-3 text-xs txt-muted">Time shown is time <strong>at</strong> the destination. Your trip plan adds the travel to reach it.</p>
                ${bagButton(d.slug, "mt-4 w-full", true)}
                <a href="#/trip" class="mt-3 block text-center text-sm font-semibold accent">Go to my trip →</a>
              </div>
              <div class="rounded-2xl border bd surface p-4 shadow-card">
                <h3 class="mb-2 font-display text-xs font-semibold uppercase tracking-wide txt-faint">Where it is</h3>
                ${stateMap(st.id)}
                <p class="mt-2 text-xs txt-faint">${esc(d.district)}, ${esc(st.name)}. Pin marks the state travel hub.</p>
              </div>
            </div>
          </aside>
        </div>

        ${nearby.length ? `<div class="mt-16">
          <h2 class="font-display text-2xl font-semibold txt">More in ${esc(st.name)}</h2>
          <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">${nearby.map(card).join("")}</div>
        </div>` : ""}
      </div>
    </article>`;
  }

  /* ---------- states ---------- */
  function statesView(zoneFilter) {
    const shown = zoneFilter ? zones.filter((z) => z === zoneFilter) : zones;
    return `
    <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 class="font-display text-3xl font-bold txt">India, state by state</h1>
      <p class="mt-2 max-w-2xl txt-muted">All 28 states and 8 union territories, grouped into six travel zones — with the capital, airports and peak window for each.</p>
      <div class="mt-10 flex flex-col gap-12">
        ${shown
          .map((z) => `
          <section>
            <div class="border-b bd pb-3">
              <h2 class="font-display text-xl font-semibold txt">${z}</h2>
              <p class="mt-1 text-sm txt-muted">${esc(zoneBlurbs[z])}</p>
            </div>
            <div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              ${states.filter((s) => s.zone === z).map((s) => {
                const n = destinations.filter((d) => d.stateId === s.id).length;
                return `<a href="#/states/${s.id}" class="flex flex-col rounded-xl border bd surface p-5 shadow-card transition hover:-translate-y-0.5">
                  <div class="flex items-start justify-between gap-3"><h3 class="font-display font-semibold leading-snug txt">${esc(s.name)}</h3><span class="shrink-0 rounded-full surface-alt px-2 py-0.5 text-[11px] font-semibold txt-muted">${n}</span></div>
                  <p class="mt-2 flex-1 text-sm txt-muted">${esc(s.positioning)}</p>
                  <div class="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                    <span class="rounded surface-alt px-2 py-0.5 txt-muted">${s.kind}</span>
                    <span class="rounded surface-alt px-2 py-0.5 txt-muted">Peak ${esc(s.peakSeason)}</span>
                    ${s.permitRequired ? '<span class="rounded px-2 py-0.5 font-semibold" style="background:rgba(232,73,42,.15);color:#c73820">Permit</span>' : ""}
                  </div></a>`;
              }).join("")}
            </div>
          </section>`)
          .join("")}
      </div>
    </div>`;
  }

  function stateView(id) {
    const st = getState(id);
    if (!st) return statesView(null);
    const list = destinations.filter((d) => d.stateId === id);
    const totalDays = list.reduce((s, d) => s + d.idealDays, 0);
    return `
    <div>
      <div class="border-b bd surface">
        <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <a href="#/states" class="text-sm font-medium txt-faint">← All states &amp; union territories</a>
          <div class="mt-3 grid gap-8 lg:grid-cols-3">
            <div class="lg:col-span-2">
              <div class="flex flex-wrap items-center gap-2">
                <span class="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white" style="background:#0b1b30">${st.kind}</span>
                <span class="rounded-full surface-alt px-2.5 py-1 text-[11px] font-semibold txt-muted">${st.zone}</span>
                ${st.permitRequired ? '<span class="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase" style="background:rgba(232,73,42,.15);color:#c73820">Permit required</span>' : ""}
                ${st.ferryOrFlightOnly ? '<span class="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase" style="background:rgba(14,165,233,.15);color:#0369a1">Ferry / flight only</span>' : ""}
              </div>
              <h1 class="font-display mt-3 text-4xl font-bold txt">${esc(st.name)}</h1>
              <p class="mt-3 max-w-[65ch] text-lg txt-muted">${esc(st.positioning)}</p>
              <dl class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                ${[["Capital", st.capital], ["Airports", st.airports.join(" · ")], ["Peak season", st.peakSeason], ["Destinations", String(list.length)]]
                  .map(([l, v]) => `<div class="rounded-lg border bd p-3" style="background:var(--bg)"><dt class="text-[11px] uppercase tracking-wide txt-faint">${l}</dt><dd class="mt-0.5 text-sm font-semibold txt">${esc(v)}</dd></div>`)
                  .join("")}
              </dl>
              <div class="mt-3 rounded-lg border bd p-3" style="background:var(--bg)">
                <dt class="text-[11px] uppercase tracking-wide txt-faint">Railhead</dt>
                <dd class="mt-0.5 text-sm font-semibold txt">${esc(st.railhead)}</dd>
              </div>
              ${st.routingNote ? `<p class="mt-3 rounded-lg border-l-4 bd surface-alt p-3 text-sm txt-muted"><strong>Routing note:</strong> best travelled as part of ${esc(st.routingNote)}, not as a standalone trip.</p>` : ""}
            </div>
            <div>${stateMap(st.id)}<p class="mt-2 text-center text-xs txt-faint">${esc(st.capital)} · ${st.lat.toFixed(2)}°N, ${st.lng.toFixed(2)}°E</p></div>
          </div>
        </div>
      </div>
      <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 class="font-display text-2xl font-semibold txt">${list.length} destinations in ${esc(st.name)}</h2>
          <p class="text-sm txt-faint">${totalDays} days to see all of it, before travel between them</p>
        </div>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">${list.map(card).join("")}</div>
      </div>
    </div>`;
  }

  /* ---------- cart ---------- */
  function cartView() {
    const items = cartItems();
    if (!items.length) {
      return `<div class="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 class="font-display text-3xl font-bold txt">Your Trip Bag is empty</h1>
        <p class="mt-3 txt-muted">Add the places that pull you in. We turn the bag into a sequenced itinerary with travel time, seasons and permits worked out.</p>
        <a href="#/destinations" class="mt-6 inline-block rounded-lg bg-accent px-6 py-3 text-sm font-semibold">Explore destinations</a></div>`;
    }
    const trip = buildTrip(items);
    const days = items.reduce((s, i) => s + i.idealDays, 0);
    const byState = {};
    items.forEach((i) => (byState[i.stateName] = byState[i.stateName] || []).push(i));
    return `
    <div class="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h1 class="font-display text-3xl font-bold txt">Your Trip Bag</h1>
        <button type="button" data-clear-cart class="text-sm font-semibold txt-faint">Clear all</button>
      </div>
      <p class="mt-2 txt-muted">${items.length} ${items.length === 1 ? "destination" : "destinations"} · ${formatDays(days)} at the places themselves · ${trip.totalDays} days once travel is added</p>
      <div class="mt-8 flex flex-col gap-8">
        ${Object.keys(byState).map((sn) => `
          <div>
            <h2 class="mb-3 font-display text-sm font-semibold uppercase tracking-wide txt-faint">${esc(sn)}</h2>
            <div class="flex flex-col gap-3">
              ${byState[sn].map((i) => `
                <div class="flex items-center gap-4 rounded-xl border bd surface p-4 shadow-card">
                  <span class="text-2xl" aria-hidden="true">${themeEmoji[i.themes[0]]}</span>
                  <div class="min-w-0 flex-1">
                    <a href="#/destinations/${i.slug}" class="font-display font-semibold txt">${esc(i.name)}</a>
                    <p class="text-sm txt-faint">${esc(i.district)} · ${shortDays(i.idealDays)} · ${esc(i.bestMonthsLabel)}${i.permitRequired ? ' <span class="ml-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase" style="background:rgba(232,73,42,.15);color:#c73820">Permit</span>' : ""}</p>
                  </div>
                  <button type="button" data-remove="${i.slug}" class="shrink-0 rounded-md px-3 py-1.5 text-sm font-semibold txt-faint">Remove</button>
                </div>`).join("")}
            </div>
          </div>`).join("")}
      </div>
      <div class="mt-10 flex flex-col items-center gap-3 rounded-2xl p-8 text-center text-white" style="background:#0b1b30;">
        <h2 class="font-display text-xl font-semibold">Ready to see this as a trip?</h2>
        <p class="max-w-md text-sm text-navy-200">We sequence these by zone and state, add every hop with its mode and hours, check the season fit and flag permits and ferries.</p>
        <a href="#/trip" class="mt-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold">Build my trip</a>
      </div>
    </div>`;
  }

  /* ---------- trip ---------- */
  const WARN = {
    permit: ["#e8492a", "Permit"],
    season: ["#f59e0b", "Season"],
    transport: ["#0ea5e9", "Transport"],
    altitude: ["#8b5cf6", "Altitude"],
    pace: ["#64748b", "Pace"],
  };

  const planner = { month: 0, budget: 0 };

  /**
   * On a normal website an anchor download just works. Inside the artifact
   * viewer, a page may only hand over a file through the downloads
   * capability, and only with an allowed extension — .ics is not one — so
   * anything it will not take is shown as copyable text instead.
   */
  async function saveFile(filename, contents, mime) {
    const dl = window.claude && window.claude.use ? await window.claude.use("downloads") : null;
    if (!dl) {
      if (window.claude && window.claude.use) return showCopyPanel(filename, contents);
      return downloadFile(filename, contents, mime);
    }
    try {
      await dl.save({ filename, data: contents });
    } catch (err) {
      if (err && err.code === "declined") return;
      showCopyPanel(filename, contents);
    }
  }

  function showCopyPanel(filename, contents) {
    const existing = document.getElementById("copy-panel");
    if (existing) existing.remove();
    const wrap = document.createElement("div");
    wrap.id = "copy-panel";
    wrap.className = "fixed inset-0 z-[60] flex items-center justify-center p-4";
    wrap.style.background = "rgba(8,19,36,.6)";
    wrap.innerHTML = `
      <div class="flex max-h-[80vh] w-full max-w-2xl flex-col gap-3 rounded-2xl border bd surface p-5 shadow-card">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="font-display text-lg font-semibold txt">Your itinerary</h2>
            <p class="mt-1 text-sm txt-muted">This preview can't hand you a <code>${esc(filename.split(".").pop())}</code> file directly. Copy the text below and save it as <strong>${esc(filename)}</strong> — on the live site the button downloads it straight away.</p>
          </div>
          <button type="button" data-close-copy class="rounded-md px-2 py-1 text-lg font-semibold txt-faint" aria-label="Close">✕</button>
        </div>
        <textarea readonly class="h-64 w-full flex-1 rounded-lg border bd p-3 font-mono text-xs txt" style="background:var(--surface-alt)">${esc(contents)}</textarea>
        <div class="flex justify-end gap-2">
          <button type="button" data-close-copy class="rounded-lg border bd px-4 py-2 text-sm font-semibold txt">Close</button>
        </div>
      </div>`;
    document.body.appendChild(wrap);
    const ta = wrap.querySelector("textarea");
    ta.focus();
    ta.select();
  }

  function tripView() {
    const items = cartItems();
    const trip = buildTrip(items, {
      travelMonth: planner.month || undefined,
      daysAvailable: planner.budget || undefined,
    });
    if (!trip) {
      return `<div class="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 class="font-display text-3xl font-bold txt">Nothing to build yet</h1>
        <p class="mt-3 txt-muted">Add a few destinations to your Trip Bag and we will sequence them into a real itinerary — route, travel time, season fit and the warnings that catch people out.</p>
        <a href="#/destinations" class="mt-6 inline-block rounded-lg bg-accent px-6 py-3 text-sm font-semibold">Explore destinations</a></div>`;
    }
    const icon = (m) =>
      m === "Flight" ? "✈️" : m === "Ferry or flight" ? "⛴️" : m === "Road" ? "🚗" : m === "Walk / local transport" ? "🚶" : "🚆";

    const inSeason = trip.stops.filter((s) => !s.outOfSeason).length;
    const fits = planner.budget
      ? trip.totalDays <= planner.budget
        ? `Fits your ${planner.budget} days`
        : `${formatDays(trip.totalDays - planner.budget)} over`
      : `This plan needs ${trip.totalDays} days`;
    const sel = "rounded-lg border bd px-3 py-2 text-sm txt";

    return `
    <div class="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 class="font-display text-3xl font-bold txt">Your trip</h1>
          <p class="mt-2 txt-muted">Built from ${trip.stops.length} ${trip.stops.length === 1 ? "destination" : "destinations"} across ${trip.statesCovered.length} ${trip.statesCovered.length === 1 ? "state" : "states"}, with travel between them costed in.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button type="button" data-share class="rounded-lg border bd surface px-3 py-2 text-sm font-semibold txt">Share link</button>
          <button type="button" data-print class="rounded-lg border bd surface px-3 py-2 text-sm font-semibold txt">Print</button>
          <button type="button" data-export="txt" class="rounded-lg border bd surface px-3 py-2 text-sm font-semibold txt">Text</button>
          <button type="button" data-export="ics" class="rounded-lg border bd surface px-3 py-2 text-sm font-semibold txt">Calendar</button>
        </div>
      </div>

      <div class="mt-6 grid gap-3 rounded-xl border bd surface p-4 shadow-card sm:grid-cols-2">
        <label class="flex flex-col gap-1 text-sm">
          <span class="font-semibold txt">When are you going?</span>
          <select id="p-month" class="${sel}">
            <option value="0">Not decided yet</option>
            ${Array.from({ length: 12 }, (_, i) => i + 1).map((m) => `<option value="${m}"${planner.month === m ? " selected" : ""}>${monthFull(m)}</option>`).join("")}
          </select>
          <span class="text-xs txt-faint">${planner.month ? `${inSeason} of ${trip.stops.length} stops are in season` : "Pick a month to check every stop against its season"}</span>
        </label>
        <label class="flex flex-col gap-1 text-sm">
          <span class="font-semibold txt">How many days do you have?</span>
          <select id="p-budget" class="${sel}">
            <option value="0">However long it takes</option>
            ${[3, 5, 7, 10, 14, 21, 30].map((d) => `<option value="${d}"${planner.budget === d ? " selected" : ""}>${d} days</option>`).join("")}
          </select>
          <span class="text-xs ${fits.includes("over") ? "accent" : "txt-faint"}">${fits}</span>
        </label>
      </div>

      <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        ${[[trip.totalDays, "days total"], [shortDays(trip.daysAtDestinations), "at the places"], [shortDays(trip.travelDays), "in transit"], [trip.approxKm.toLocaleString("en-IN") + " km", "approx distance"]]
          .map(([v, l]) => `<div class="rounded-xl border bd surface p-4 text-center shadow-card"><div class="font-display text-2xl font-bold tabular-nums txt">${v}</div><div class="text-xs uppercase tracking-wide txt-faint">${l}</div></div>`)
          .join("")}
      </div>

      <div class="mt-6 rounded-xl border bd surface p-5 shadow-card">
        <h2 class="font-display text-sm font-semibold uppercase tracking-wide txt-faint">When to go</h2>
        ${trip.commonMonths.length
          ? `<p class="mt-2 text-lg font-semibold txt">${formatMonths(trip.commonMonths)}</p><p class="mt-1 text-sm txt-muted">These months suit every destination in the bag.</p>`
          : `<p class="mt-2 text-lg font-semibold accent">No month suits all of them</p><p class="mt-1 text-sm txt-muted">The best you can do is ${formatMonths(trip.bestPartialMonths)}, which suits ${trip.bestPartialCount} of ${trip.stops.length}. Drop the outliers, or split this into two trips.</p>`}
        <div class="mt-3 flex flex-wrap gap-1">
          ${Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
            const fit = trip.monthFit[m - 1];
            const ratio = trip.stops.length ? fit / trip.stops.length : 0;
            const style =
              ratio === 1 ? "background:#059669;color:#fff"
              : ratio >= 0.66 ? "background:#6ee7b7;color:#064e3b"
              : ratio >= 0.34 ? "background:#d1fae5;color:#065f46"
              : ratio > 0 ? "background:#fef3c7;color:#92400e"
              : "background:var(--surface-alt);color:var(--text-faint)";
            return `<span class="rounded px-2 py-1 text-[11px] font-semibold" style="${style}" title="${fit} of ${trip.stops.length} in season in ${monthName(m)}">${monthName(m)}<span class="ml-1 tabular-nums opacity-70">${fit}</span></span>`;
          }).join("")}
        </div>
      </div>

      ${trip.warnings.length ? `<div class="mt-6 flex flex-col gap-3">${trip.warnings.map((w) => {
        const [color, label] = WARN[w.kind] || ["#64748b", w.kind];
        return `<div class="rounded-xl border-l-4 surface p-4 shadow-card" style="border-color:${color}">
          <div class="flex items-center gap-2">
            <span class="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase" style="background:${color}22;color:${color}">${label}</span>
            <h3 class="font-display text-sm font-semibold txt">${esc(w.title)}</h3>
          </div>
          <p class="mt-1.5 text-sm txt-muted">${esc(w.detail)}</p></div>`;
      }).join("")}</div>` : ""}

      <h2 class="mt-10 font-display text-xl font-semibold txt">The route</h2>
      <div class="mt-3 flex flex-wrap items-center gap-x-1 gap-y-2 rounded-xl border bd surface p-4 text-sm shadow-card">
        <span class="rounded surface-alt px-2 py-1 text-xs font-semibold txt-faint">Fly into ${trip.arrivalAirports[0] || "—"}</span>
        ${trip.stops.map((s) => `<span class="flex items-center gap-1"><span class="txt-faint">→</span><a href="#/destinations/${s.destination.slug}" class="font-medium txt">${esc(s.destination.name)}</a></span>`).join("")}
        <span class="txt-faint">→</span>
        <span class="rounded surface-alt px-2 py-1 text-xs font-semibold txt-faint">Out of ${trip.departureAirports[0] || "—"}</span>
      </div>

      <h2 class="mt-10 font-display text-xl font-semibold txt">Day by day</h2>
      <div class="mt-4 flex flex-col gap-4">
        ${trip.stops.map((s, i) => `
          <div>
            ${s.arrivalLeg ? `<div class="mb-4 ml-4 flex items-start gap-3 border-l-2 border-dashed bd pl-6 text-sm txt-muted">
              <span aria-hidden="true">${icon(s.arrivalLeg.mode)}</span>
              <div><p class="font-semibold txt">${s.arrivalLeg.mode} · ~${s.arrivalLeg.approxKm} km · ~${s.arrivalLeg.approxHours} hrs</p>
              <p class="mt-0.5">${esc(s.arrivalLeg.note)}</p></div></div>` : ""}
            <div class="rounded-xl border bd surface p-5 shadow-card">
              <div class="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <span class="text-xs font-semibold uppercase tracking-wide accent">Stop ${i + 1}</span>
                  <h3 class="font-display text-lg font-semibold txt"><a href="#/destinations/${s.destination.slug}">${esc(s.destination.name)}</a></h3>
                  <p class="text-sm txt-faint">${esc(s.destination.district)} · ${esc(s.state.name)}</p>
                </div>
                <div class="flex items-center gap-2">
                  <span class="rounded-full px-3 py-1 text-xs font-semibold tabular-nums text-white" style="background:#0b1b30">Day ${s.startDay}${s.endDay > s.startDay ? "–" + s.endDay : ""}</span>
                  <button type="button" data-remove="${s.destination.slug}" aria-label="Remove ${esc(s.destination.name)} from the trip" class="rounded-md px-2 py-1 text-sm font-semibold txt-faint">✕</button>
                </div>
              </div>
              ${s.outOfSeason ? `<p class="mt-2 rounded-lg px-3 py-2 text-xs font-medium" style="background:rgba(232,73,42,.1);color:#c73820">Out of season in ${monthFull(trip.travelMonth)} — best ${esc(s.destination.bestMonthsLabel)}.</p>` : ""}
              <div class="mt-3 flex flex-wrap gap-1.5">
                ${s.destination.themes.map((t) => `<span class="rounded-full surface-alt px-2 py-0.5 text-[11px] txt-muted">${themeEmoji[t]} ${t}</span>`).join("")}
                <span class="rounded-full surface-alt px-2 py-0.5 text-[11px] txt-muted">${formatDays(s.destination.idealDays)} here</span>
                <span class="rounded-full surface-alt px-2 py-0.5 text-[11px] txt-muted">Best: ${esc(s.destination.bestMonthsLabel)}</span>
              </div>
              <p class="mt-3 text-xs txt-faint">Airports: ${s.state.airports.join(" · ")} · Railhead: ${esc(s.state.railhead.split(",")[0])}</p>
            </div>
          </div>`).join("")}
      </div>

      <details class="mt-8 rounded-xl border bd surface p-5 shadow-card">
        <summary class="cursor-pointer font-display text-sm font-semibold txt">See all ${trip.totalDays} days as a list</summary>
        <ol class="mt-4 flex flex-col gap-2">
          ${trip.days.map((d) => `<li class="flex gap-3 text-sm"><span class="w-16 shrink-0 font-semibold tabular-nums txt-faint">Day ${d.day}</span>
            <span class="flex flex-1 flex-col gap-1">${d.entries.map((e) => `<span>
              <span class="${e.kind === "travel" ? "txt-muted" : "font-medium txt"}">${e.kind === "travel" ? "In transit — " : ""}${esc(e.title)}</span>
              <span class="ml-2 rounded surface-alt px-1.5 py-0.5 text-[10px] uppercase tracking-wide txt-faint">${esc(e.share)}</span>
              <span class="block text-xs txt-faint">${esc(e.detail)}</span></span>`).join("")}</span></li>`).join("")}
        </ol>
      </details>

      <div class="mt-8 flex flex-wrap gap-3">
        <a href="#/cart" class="rounded-lg border bd surface px-6 py-3 text-sm font-semibold txt">Edit Trip Bag</a>
        <a href="#/destinations" class="rounded-lg bg-accent px-6 py-3 text-sm font-semibold">Add more destinations</a>
      </div>
    </div>`;
  }

  /* ---------- circuits ---------- */
  function circuitsView() {
    return `
    <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 class="font-display text-3xl font-bold txt">Circuits</h1>
      <p class="mt-2 max-w-2xl txt-muted">Twelve routes that hold together as one trip — grouped by geography and season, not by popularity. Load one into your Trip Bag and change it from there; nothing here is fixed.</p>
      <div class="mt-8 grid gap-6 lg:grid-cols-2">
        ${circuits.map(circuitSummary).map((c) => {
          const plan = buildTrip(c.items);
          return `<article class="flex flex-col overflow-hidden rounded-2xl border bd surface shadow-card">
            <div class="relative aspect-[4/1]">
              ${scene(c.id, [c.dominantTheme], 640, 160, "absolute inset-0 h-full w-full")}
              <div class="absolute inset-0" style="background:linear-gradient(to top, rgba(8,19,36,.85), transparent)"></div>
              <div class="absolute inset-x-0 bottom-0 p-4">
                <h2 class="font-display text-xl font-bold text-white">${esc(c.name)}</h2>
                <p class="text-sm text-white/80">${esc(c.tagline)}</p>
              </div>
            </div>
            <div class="flex flex-1 flex-col gap-3 p-5">
              <p class="text-sm txt-muted">${esc(c.rationale)}</p>
              <dl class="grid grid-cols-3 gap-2 text-center">
                ${[["Stops", c.items.length], ["Days", plan ? plan.totalDays : "—"], ["States", c.states.length]]
                  .map(([l, v]) => `<div class="rounded-lg surface-alt p-2"><dt class="text-[10px] uppercase tracking-wide txt-faint">${l}</dt><dd class="font-display font-bold tabular-nums txt">${v}</dd></div>`).join("")}
              </dl>
              <p class="text-xs txt-faint">Best months: <span class="font-semibold txt-muted">${c.commonMonths.length ? formatMonths(c.commonMonths) : "varies by stop"}</span>${plan ? ` · ${shortDays(plan.travelDays)} of it in transit` : ""}</p>
              <ol class="flex flex-wrap gap-1.5">
                ${c.items.map((d, i) => `<li class="flex items-center gap-1">${i > 0 ? '<span class="txt-faint">→</span>' : ""}<a href="#/destinations/${d.slug}" class="rounded-full surface-alt px-2 py-0.5 text-[11px] font-medium txt-muted">${themeEmoji[d.themes[0]]} ${esc(d.name)}</a></li>`).join("")}
              </ol>
              <div class="mt-auto flex flex-wrap gap-2 pt-2">
                <button type="button" data-circuit="${c.id}" class="rounded-lg bg-accent px-4 py-2 text-sm font-semibold">Use this trip</button>
                <button type="button" data-circuit-add="${c.id}" class="rounded-lg border bd px-4 py-2 text-sm font-semibold txt">Add to my bag</button>
              </div>
            </div>
          </article>`;
        }).join("")}
      </div>
    </div>`;
  }

  /* ---------- campaign ---------- */
  const PRINCIPLES = [
    ["Go for understanding, not a checklist", "A tourist collects landmarks. A traveler asks why a place is the way it is — why Varanasi's ghats face the river the way they do, why Kutch turns white every winter. Every destination page here leads with that context first."],
    ["Move at the place's pace, not your itinerary's", "We use the directory's real day counts, and our trip builder adds the travel between them instead of pretending distance doesn't exist. A plan that looks slower is usually the honest one."],
    ["Spend where it lands with people, not around them", "Our traveler tips point toward homestays, local guides, community-run conservation and family kitchens over the version of a place built only for tour buses."],
    ["Leave with a story, not just a photo", "If a destination page here doesn't teach you something you didn't know before you clicked it, we haven't done our job."],
  ];

  function campaignView() {
    return `
    <section class="py-16 text-white" style="background:#0b1b30;">
      <div class="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <p class="text-sm font-semibold uppercase tracking-widest" style="color:#fa6d47;">Our campaign</p>
        <h1 class="font-display mt-3 text-4xl font-bold sm:text-5xl">Be travelers, not tourists.</h1>
        <p class="mt-5 text-lg text-navy-200">Tourism moves through a place. Traveling moves you. OnlyTravelers exists to make the second one easier to plan than the first.</p>
      </div>
    </section>
    <section class="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div class="grid gap-8 sm:grid-cols-2">
        ${PRINCIPLES.map(([t, b]) => `<div class="rounded-xl border bd surface p-6 shadow-card"><h2 class="font-display text-lg font-semibold txt">${t}</h2><p class="mt-3 text-sm txt-muted">${b}</p></div>`).join("")}
      </div>
      <div class="mt-14 rounded-2xl border bd surface-alt p-8 text-center">
        <h2 class="font-display text-2xl font-semibold txt">India rewards the traveler who slows down.</h2>
        <p class="mx-auto mt-3 max-w-xl txt-muted">Start with a place you're actually curious about, read why it matters, and add it to your Trip Bag. We'll handle turning your curiosity into an itinerary.</p>
        <a href="#/destinations" class="mt-6 inline-block rounded-lg bg-accent px-6 py-3 text-sm font-semibold">Start exploring</a>
      </div>
    </section>`;
  }

  /* ---------- router ---------- */
  function route() {
    const raw = (location.hash || "#/").replace(/^#/, "");
    const [path, qs] = raw.split("?");
    const parts = path.split("/").filter(Boolean);
    const params = new URLSearchParams(qs || "");
    if (!parts.length) return { view: "home" };
    if (parts[0] === "destinations") return parts.length > 1 ? { view: "detail", slug: parts[1] } : { view: "destinations", theme: params.get("theme") };
    if (parts[0] === "states") return parts.length > 1 ? { view: "state", id: parts[1] } : { view: "states", zone: params.get("zone") };
    if (parts[0] === "cart") return { view: "cart" };
    if (parts[0] === "trip") return { view: "trip", bag: params.get("bag") };
    if (parts[0] === "circuits") return { view: "circuits" };
    if (parts[0] === "campaign") return { view: "campaign" };
    return { view: "home" };
  }

  function render(scroll) {
    const r = route();
    let html = "";
    if (r.view === "home") html = homeView();
    else if (r.view === "destinations") {
      if (r.theme && themes.includes(r.theme)) filters.theme = r.theme;
      html = destinationsView();
    } else if (r.view === "detail") html = detailView(r.slug);
    else if (r.view === "states") html = statesView(r.zone);
    else if (r.view === "state") html = stateView(r.id);
    else if (r.view === "cart") html = cartView();
    else if (r.view === "trip") {
      // A shared link carries the bag: #/trip?bag=slug,slug
      if (r.bag) {
        const incoming = r.bag.split(",").map((s) => s.trim()).filter((s) => bySlug(s));
        if (incoming.length) {
          cart = incoming;
          save();
        }
      }
      html = tripView();
    } else if (r.view === "circuits") html = circuitsView();
    else if (r.view === "campaign") html = campaignView();

    document.getElementById("app").innerHTML = html;
    document.querySelectorAll(".nav-link").forEach((a) => {
      const active = a.dataset.route === r.view || (r.view === "detail" && a.dataset.route === "destinations") || (r.view === "state" && a.dataset.route === "states");
      a.classList.toggle("accent", active);
      a.classList.toggle("txt-muted", !active);
    });
    badge();
    if (scroll !== false) window.scrollTo(0, 0);
  }

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-toggle]");
    if (t) { e.preventDefault(); toggle(t.dataset.toggle); return; }
    const rm = e.target.closest("[data-remove]");
    if (rm) { e.preventDefault(); removeItem(rm.dataset.remove); return; }
    if (e.target.closest("[data-clear-cart]")) { e.preventDefault(); clearCart(); return; }
    if (e.target.closest("[data-clear-filters]")) {
      e.preventDefault();
      Object.assign(filters, { q: "", zone: "All", state: "All", theme: "All", month: 0, days: 0, visible: 24 });
      render(false);
      return;
    }
    if (e.target.closest("[data-more]")) { e.preventDefault(); filters.visible += 24; updateGrid(); return; }

    const useCircuit = e.target.closest("[data-circuit]");
    if (useCircuit) {
      e.preventDefault();
      const c = circuits.find((x) => x.id === useCircuit.dataset.circuit);
      if (c) { cart = c.slugs.filter(bySlug); save(); location.hash = "#/trip"; }
      return;
    }
    const addCircuit = e.target.closest("[data-circuit-add]");
    if (addCircuit) {
      e.preventDefault();
      const c = circuits.find((x) => x.id === addCircuit.dataset.circuitAdd);
      if (c) {
        c.slugs.filter(bySlug).forEach((s) => { if (!cart.includes(s)) cart.push(s); });
        save(); badge();
        addCircuit.textContent = "Added ✓";
        setTimeout(() => { addCircuit.textContent = "Add to my bag"; }, 1800);
      }
      return;
    }

    const shareBtn = e.target.closest("[data-share]");
    if (shareBtn) {
      e.preventDefault();
      const url = location.origin + location.pathname + "#/trip?bag=" + cart.join(",");
      const done = () => { shareBtn.textContent = "Link copied ✓"; setTimeout(() => { shareBtn.textContent = "Share link"; }, 2000); };
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, () => window.prompt("Copy your trip link:", url));
      else window.prompt("Copy your trip link:", url);
      return;
    }
    if (e.target.closest("[data-print]")) { e.preventDefault(); window.print(); return; }
    const exp = e.target.closest("[data-export]");
    if (exp) {
      e.preventDefault();
      const trip = buildTrip(cartItems(), { travelMonth: planner.month || undefined, daysAvailable: planner.budget || undefined });
      if (!trip) return;
      if (exp.dataset.export === "txt") {
        saveFile("onlytravelers-itinerary.txt", tripToText(trip), "text/plain");
      } else {
        const start = new Date();
        start.setDate(start.getDate() + 30);
        saveFile("onlytravelers-itinerary.ics", tripToIcs(trip, start), "text/calendar");
      }
      return;
    }
    if (e.target.closest("[data-close-copy]")) {
      e.preventDefault();
      const panel = document.getElementById("copy-panel");
      if (panel) panel.remove();
    }
  });

  document.addEventListener("input", (e) => {
    if (e.target.id === "f-q") { filters.q = e.target.value; filters.visible = 24; updateGrid(); }
  });

  document.addEventListener("change", (e) => {
    const id = e.target.id;
    if (id === "p-month") { planner.month = Number(e.target.value); render(false); return; }
    if (id === "p-budget") { planner.budget = Number(e.target.value); render(false); return; }
    if (id === "f-zone") { filters.zone = e.target.value; filters.state = "All"; filters.visible = 24; render(false); return; }
    if (id === "f-state") filters.state = e.target.value;
    else if (id === "f-theme") filters.theme = e.target.value;
    else if (id === "f-month") filters.month = Number(e.target.value);
    else if (id === "f-days") filters.days = Number(e.target.value);
    else return;
    filters.visible = 24;
    updateGrid();
  });

  window.addEventListener("hashchange", () => render(true));
  render(true);
})();
