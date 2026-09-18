/* Demo UI. All data and logic come from the app's own compiled modules on window.OT. */
(function () {
  const { destinations, themes } = OT.destinations;
  const { states, zones, zoneBlurbs, getState } = OT.states;
  const { guides } = OT.guides;
  const { themeEmoji, formatDays, shortDays, seasonBadge, countLabel } = OT.format;
  const { sceneSvg } = OT.scene;
  const { buildTrip, formatMonths, monthName, monthFull } = OT.trip;
  const { circuits, circuitSummary } = OT.circuits;
  const { tripToText, tripToIcs, downloadFile, tripShareUrl, tripEnquiry, whatsappUrl, mailtoUrl } = OT.exportTrip;
  const { search: searchAll, SEARCH_SUGGESTIONS } = OT.search;
  const { startTrip } = OT.starter;
  const { todayFor, formatTripDate } = OT.today;
  const { essentialsFor, NATIONAL_NUMBERS } = OT.essentials;

  const bySlug = (s) => destinations.find((d) => d.slug === s);
  const esc = (s) =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  /* ---------- trips ----------
     Many named trips, with the active one's stops mirrored into `cart` so
     every card, button and circuit keeps working unchanged. */
  const KEY = "onlytravelers.demo.trips.v1";
  const PROFILE_KEY = "onlytravelers.demo.profile.v1";
  const CHECK_KEY = "onlytravelers.demo.checks.v1";
  const SPEND_KEY = "onlytravelers.demo.spend.v1";
  const WALLET_KEY = "onlytravelers.demo.wallet.v1";

  const store = { trips: [], activeId: null };
  let cart = [];
  let profile = Object.assign({}, OT.profileData.DEFAULT_PROFILE);

  const readKey = (k, fallback) => {
    try {
      const raw = localStorage.getItem(k);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  };
  const writeKey = (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  };

  const newId = () => "trip_" + Math.random().toString(36).slice(2, 9);

  function makeTrip(name, slugs) {
    const stamp = new Date().toISOString();
    return {
      id: newId(),
      name: name || OT.tripsData.suggestTripName(slugs || []),
      slugs: (slugs || []).filter(bySlug),
      status: "planning",
      createdAt: stamp,
      updatedAt: stamp,
    };
  }

  function loadState() {
    const stored = readKey(KEY, null);
    if (stored && Array.isArray(stored.trips)) {
      store.trips = stored.trips.filter((t) => t && t.id && Array.isArray(t.slugs));
      store.activeId = stored.activeId;
    }
    // Carry across the single bag this demo used to keep.
    const legacy = readKey("onlytravelers.demo.cart.v3", null);
    if (!store.trips.length && Array.isArray(legacy) && legacy.length) {
      store.trips = [makeTrip(null, legacy.filter(bySlug))];
      try { localStorage.removeItem("onlytravelers.demo.cart.v3"); } catch (e) {}
    }
    if (!store.trips.some((t) => t.id === store.activeId)) {
      store.activeId = store.trips[0] ? store.trips[0].id : null;
    }
    cart = activeTrip() ? activeTrip().slugs.slice() : [];
    const p = readKey(PROFILE_KEY, null);
    if (p) profile = Object.assign({}, OT.profileData.DEFAULT_PROFILE, p);
  }

  function activeTrip() {
    return store.trips.find((t) => t.id === store.activeId) || null;
  }

  /** Writes the working bag back to the active trip, creating one if needed. */
  const save = () => {
    let trip = activeTrip();
    if (!trip) {
      trip = makeTrip(null, cart);
      store.trips.push(trip);
      store.activeId = trip.id;
    }
    trip.slugs = cart.slice();
    trip.updatedAt = new Date().toISOString();
    if (trip.name === "New trip" && trip.slugs.length) {
      trip.name = OT.tripsData.suggestTripName(trip.slugs);
    }
    writeKey(KEY, store);
  };

  const persistTrips = () => writeKey(KEY, store);

  loadState();
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
    const tab = document.getElementById("tab-badge");
    if (tab) {
      tab.textContent = String(cart.length);
      tab.hidden = cart.length === 0;
    }
    const trip = activeTrip();
    const label = document.getElementById("bag-label");
    if (label) label.textContent = trip ? trip.name : "Trip Bag";
  }

  const TAB_MATCH = {
    home: (v) => v === "home",
    explore: (v) => ["destinations", "detail", "states", "state", "circuits"].indexOf(v) !== -1,
    trips: (v) => ["trips", "workspace", "trip", "cart"].indexOf(v) !== -1,
    profile: (v) => v === "profile",
    search: () => false,
  };

  function syncTabs(view) {
    document.querySelectorAll(".tab").forEach((a) => {
      const on = TAB_MATCH[a.dataset.tab] ? TAB_MATCH[a.dataset.tab](view) : false;
      a.classList.toggle("accent", on);
      a.classList.toggle("txt-faint", !on);
    });
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
    // With a trip on the go, home opens on it — the hero is for people who
    // have not started one.
    const trip = activeTrip();
    const items = trip ? trip.slugs.map(bySlug).filter(Boolean) : [];
    const plan = items.length ? buildTrip(items, { travelMonth: trip.travelMonth, daysAvailable: trip.daysAvailable }) : null;
    const hero = plan
      ? `<section class="border-b bd surface-alt">
           <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6">
             <p class="text-xs font-semibold uppercase tracking-wide txt-faint">Your trip</p>
             <h1 class="font-display text-2xl font-bold txt">${esc(trip.name)}</h1>
             <div class="mt-4">${todayBody(trip, plan)}</div>
             <div class="mt-4 flex flex-wrap gap-2">
               <a href="#/trips" class="rounded-lg border bd surface px-4 py-2 text-sm font-semibold txt">All my trips${store.trips.length > 1 ? ` (${store.trips.length})` : ""}</a>
               <a href="#/start" class="rounded-lg border bd surface px-4 py-2 text-sm font-semibold txt">Plan another</a>
               <a href="#/destinations" class="rounded-lg border bd surface px-4 py-2 text-sm font-semibold txt">Add a stop</a>
             </div>
           </div>
         </section>`
      : marketingHero();
    return hero + homeBody();
  }

  function marketingHero() {
    return `
    <section class="topo border-b bd">
      <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <p class="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white" style="background:#0b1b30;">Be travelers, not tourists</p>
        <h1 class="font-display max-w-3xl text-4xl font-bold leading-[1.1] txt sm:text-6xl">Before life gets too busy, travel.</h1>
        <p class="mt-6 max-w-xl text-lg txt-muted">Every state, every union territory, ${destinations.length} destinations — each with what it is, how long it deserves, when to go and how to reach it. Add the ones that pull you in, and we build the whole trip around them.</p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a href="#/start" class="rounded-lg bg-accent px-6 py-3 text-sm font-semibold shadow-card">Plan my trip in 30 seconds</a>
          <a href="#/destinations" class="rounded-lg border bd surface px-6 py-3 text-sm font-semibold txt">Browse ${destinations.length} destinations</a>
        </div>
        <dl class="mt-12 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
          ${[["36", "states & UTs"], [String(destinations.length), "destinations"], ["6", "zones"], ["100%", "with a guide"]]
            .map(([v, l]) => `<div><dt class="font-display text-2xl font-bold txt">${v}</dt><dd class="text-xs uppercase tracking-wide txt-faint">${l}</dd></div>`)
            .join("")}
        </dl>
      </div>
    </section>`;
  }

  function homeBody() {
    return `
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
              <p class="mt-3 text-xs txt-faint">${countLabel(sc, "state")} &amp; UTs</p></a>`;
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

  function tripBody(trip, plan) {
    // The workspace has already made this trip active, so the shared renderer
    // below is looking at the same stops.
    planner.month = trip.travelMonth || 0;
    planner.budget = trip.daysAvailable || 0;
    return tripView(true);
  }

  function tripView(embedded) {
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
    <div class="${embedded ? "" : "mx-auto max-w-4xl px-4 py-12 sm:px-6"}">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          ${embedded ? "" : '<h1 class="font-display text-3xl font-bold txt">Your trip</h1>'}
          <p class="${embedded ? "" : "mt-2"} txt-muted">Built from ${trip.stops.length} ${trip.stops.length === 1 ? "destination" : "destinations"} across ${trip.statesCovered.length} ${trip.statesCovered.length === 1 ? "state" : "states"}, with travel between them costed in.</p>
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

  /* ---------- trips hub ---------- */
  function tripsView() {
    if (!store.trips.length) {
      return `<div class="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 class="font-display text-3xl font-bold txt">My trips</h1>
        <p class="mt-2 txt-muted">Nothing saved yet.</p>
        <div class="mt-10 rounded-2xl border border-dashed bd surface p-10 text-center">
          <h2 class="font-display text-lg font-semibold txt">Start with a place, or a circuit</h2>
          <p class="mx-auto mt-2 max-w-md text-sm txt-muted">Add destinations as you browse and they collect into a trip. Or load one of the twelve circuits and edit it from there.</p>
          <div class="mt-6 flex flex-wrap justify-center gap-3">
            <a href="#/destinations" class="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold">Explore destinations</a>
            <a href="#/circuits" class="rounded-lg border bd surface px-5 py-2.5 text-sm font-semibold txt">Browse circuits</a>
          </div>
        </div>
      </div>`;
    }

    return `<div class="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 class="font-display text-3xl font-bold txt">My trips</h1>
          <p class="mt-2 txt-muted">${store.trips.length} ${store.trips.length === 1 ? "trip" : "trips"} on this device.</p>
        </div>
        <button type="button" data-new-trip class="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold">New trip</button>
      </div>
      <div class="mt-8 flex flex-col gap-4">
        ${store.trips.map((t) => {
          const items = t.slugs.map(bySlug).filter(Boolean);
          const plan = buildTrip(items, { travelMonth: t.travelMonth, daysAvailable: t.daysAvailable });
          const status = OT.tripsData.TRIP_STATUS.find((s) => s.id === t.status) || OT.tripsData.TRIP_STATUS[0];
          const isActive = t.id === store.activeId;
          return `<article class="rounded-2xl border ${isActive ? "border-coral-300" : "bd"} surface p-5 shadow-card">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="rounded-full px-2 py-0.5 text-[11px] font-semibold ${status.tone}">${status.label}</span>
                  ${isActive ? '<span class="rounded-full px-2 py-0.5 text-[11px] font-semibold" style="background:rgba(232,73,42,.15);color:#c73820">Active</span>' : ""}
                </div>
                <h2 class="font-display mt-2 text-xl font-semibold txt"><a href="#/trips/${t.id}">${esc(t.name)}</a></h2>
                <p class="mt-1 text-sm txt-faint">${items.length ? `${countLabel(items.length, "stop")}${plan ? ` · ${countLabel(plan.totalDays, "day")} · ${countLabel(plan.statesCovered.length, "state")}` : ""}` : "No destinations yet"}${t.travelMonth ? ` · ${monthFull(t.travelMonth)}` : ""}</p>
              </div>
              <div class="flex shrink-0 flex-wrap gap-2">
                ${isActive ? "" : `<button type="button" data-activate="${t.id}" class="rounded-lg border bd px-3 py-1.5 text-xs font-semibold txt">Make active</button>`}
                <button type="button" data-delete-trip="${t.id}" class="rounded-lg px-3 py-1.5 text-xs font-semibold txt-faint">Delete</button>
              </div>
            </div>
            ${items.length ? `<ol class="mt-3 flex flex-wrap gap-1.5">${items.slice(0, 6).map((d) => `<li class="rounded-full surface-alt px-2 py-0.5 text-[11px] font-medium txt-muted">${themeEmoji[d.themes[0]]} ${esc(d.name)}</li>`).join("")}${items.length > 6 ? `<li class="rounded-full surface-alt px-2 py-0.5 text-[11px] txt-faint">+${items.length - 6} more</li>` : ""}</ol>` : ""}
            <div class="mt-4 flex flex-wrap gap-2">
              <a href="#/trips/${t.id}" class="rounded-lg px-4 py-2 text-xs font-semibold text-white" style="background:#0b1b30">Open trip</a>
              <a href="#/trips/${t.id}?tab=prep" class="rounded-lg border bd px-4 py-2 text-xs font-semibold txt">Prep list</a>
              <a href="#/trips/${t.id}?tab=bookings" class="rounded-lg border bd px-4 py-2 text-xs font-semibold txt">Bookings</a>
            </div>
          </article>`;
        }).join("")}
      </div>
    </div>`;
  }

  /* ---------- trip workspace ---------- */
  const WORK_TABS = [
    { id: "today", label: "Today", icon: "📍" },
    { id: "itinerary", label: "Itinerary", icon: "🗓️" },
    { id: "prep", label: "Prep", icon: "✅" },
    { id: "bookings", label: "Bookings", icon: "🎫" },
    { id: "spend", label: "Spend", icon: "💸" },
  ];

  function checksFor(id) {
    const all = readKey(CHECK_KEY, {});
    return Array.isArray(all[id]) ? all[id] : [];
  }
  function spendFor(id) {
    const all = readKey(SPEND_KEY, {});
    return Array.isArray(all[id]) ? all[id] : [];
  }

  function workspaceView(tripId, tab) {
    const trip = store.trips.find((t) => t.id === tripId);
    if (!trip) {
      return `<div class="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 class="font-display text-3xl font-bold txt">Trip not found</h1>
        <a href="#/trips" class="mt-6 inline-block rounded-lg bg-accent px-6 py-3 text-sm font-semibold">My trips</a></div>`;
    }
    if (store.activeId !== trip.id) {
      store.activeId = trip.id;
      cart = trip.slugs.slice();
      persistTrips();
    }

    const items = trip.slugs.map(bySlug).filter(Boolean);
    const plan = buildTrip(items, { travelMonth: trip.travelMonth, daysAvailable: trip.daysAvailable });
    const status = OT.tripsData.TRIP_STATUS.find((s) => s.id === trip.status) || OT.tripsData.TRIP_STATUS[0];
    const prepItems = plan ? OT.prep.buildPrepList(plan, profile) : [];
    const ticked = checksFor(trip.id);
    const criticalLeft = prepItems.filter((p) => p.critical && ticked.indexOf(p.id) === -1).length;
    const bookingTasks = plan ? OT.bookings.buildBookingTasks(plan, trip.startDate) : [];

    const header = `
      <a href="#/trips" class="text-sm font-medium txt-faint">← My trips</a>
      <div class="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div class="min-w-0 flex-1">
          <h1 class="font-display text-3xl font-bold txt">${esc(trip.name)}</h1>
          <p class="mt-1 text-sm txt-faint">${countLabel(items.length, "stop")}${plan ? ` · ${countLabel(plan.totalDays, "day")} · ${countLabel(plan.statesCovered.length, "state")}` : ""}${trip.travelMonth ? ` · ${monthFull(trip.travelMonth)}` : ""}</p>
        </div>
        <select id="w-status" class="rounded-full px-3 py-1.5 text-xs font-semibold ${status.tone}">
          ${OT.tripsData.TRIP_STATUS.map((s) => `<option value="${s.id}"${s.id === trip.status ? " selected" : ""}>${s.label}</option>`).join("")}
        </select>
      </div>
      <div class="mt-6 flex gap-1 overflow-x-auto border-b bd pb-px">
        ${WORK_TABS.map((t) => {
          const on = t.id === tab;
          const badgeN = t.id === "prep" && criticalLeft ? criticalLeft : t.id === "bookings" && bookingTasks.length ? bookingTasks.length : 0;
          return `<a href="#/trips/${trip.id}${t.id === "itinerary" ? "" : "?tab=" + t.id}" class="flex shrink-0 items-center gap-1.5 rounded-t-lg px-2.5 py-2.5 text-sm font-semibold sm:px-4 ${on ? "accent" : "txt-muted"}" style="${on ? "border-bottom:2px solid var(--accent)" : "border-bottom:2px solid transparent"}">
            <span aria-hidden="true">${t.icon}</span>${t.label}${badgeN ? `<span class="rounded-full surface-alt px-1.5 text-[10px] font-bold">${badgeN}</span>` : ""}</a>`;
        }).join("")}
      </div>`;

    if (!items.length) {
      return `<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6">${header}
        <div class="mt-8 rounded-2xl border border-dashed bd surface p-10 text-center">
          <h2 class="font-display text-lg font-semibold txt">This trip is empty</h2>
          <p class="mx-auto mt-2 max-w-md text-sm txt-muted">Add destinations and everything else here fills in — the route, the prep list, what needs booking and in what order.</p>
          <div class="mt-6 flex flex-wrap justify-center gap-3">
            <a href="#/destinations" class="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold">Add destinations</a>
            <a href="#/circuits" class="rounded-lg border bd surface px-5 py-2.5 text-sm font-semibold txt">Load a circuit</a>
          </div>
        </div></div>`;
    }

    let body = "";
    if (tab === "today") body = todayBody(trip, plan);
    else if (tab === "itinerary") body = tripBody(trip, plan);
    else if (tab === "prep") body = prepBody(trip, prepItems, ticked);
    else if (tab === "bookings") body = bookingsBody(trip, bookingTasks);
    else body = spendBody(trip, plan);

    return `<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6">${header}<div class="mt-6">${body}</div></div>`;
  }

  /* ---------- Today ---------- */
  function todayBody(trip, plan) {
    const state = todayFor(trip, plan);
    if (!state) {
      return `<div class="rounded-2xl border border-dashed bd surface p-5">
        <h2 class="font-display font-semibold txt">Set a start date</h2>
        <p class="mt-1 text-sm txt-muted">Add the date you leave and this becomes a day-by-day companion: where you are, what moves today, and what is next.</p>
        <a href="#/trips/${trip.id}?tab=bookings" class="mt-3 inline-block rounded-lg border bd px-4 py-2 text-sm font-semibold txt">Set start date</a>
      </div>`;
    }
    if (state.phase === "before") {
      const first = state.next;
      return `<div class="rounded-2xl border bd surface p-5 shadow-card">
        <p class="text-xs font-semibold uppercase tracking-wide accent">${state.daysUntil === 1 ? "Tomorrow" : `In ${state.daysUntil} days`}</p>
        <h2 class="font-display mt-1 text-xl font-semibold txt">${esc(trip.name)}</h2>
        ${first ? `<p class="mt-1 text-sm txt-muted">Starts at ${esc(first.destination.name)}, ${esc(first.state.name)} on ${esc(formatTripDate(trip.startDate, 1))}.</p>` : ""}
        <a href="#/trips/${trip.id}?tab=prep" class="mt-4 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-semibold">Check the prep list</a>
      </div>`;
    }
    if (state.phase === "after") {
      return `<div class="rounded-2xl border bd surface p-5 shadow-card">
        <h2 class="font-display text-xl font-semibold txt">That trip is done</h2>
        <p class="mt-1 text-sm txt-muted">${countLabel(plan.totalDays, "day")}, ${countLabel(plan.stops.length, "stop")}, ${countLabel(plan.statesCovered.length, "state")}. Keep it — the next one starts from what this one taught you.</p>
        <a href="#/start" class="mt-4 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-semibold">Plan the next one</a>
      </div>`;
    }

    const cur = state.current;
    const ess = cur ? essentialsFor(cur.state.id) : null;
    return `
      <div class="rounded-2xl border bd surface p-5 shadow-card">
        <p class="text-xs font-semibold uppercase tracking-wide accent">Day ${state.dayNumber} of ${plan.totalDays}</p>
        ${state.todayLeg
          ? `<h2 class="font-display mt-1 text-xl font-semibold txt">Moving today: ${esc(state.todayLeg.fromName)} → ${esc(state.todayLeg.toName)}</h2>
             <p class="mt-1 text-sm txt-muted">${esc(state.todayLeg.mode)}, about ${state.todayLeg.approxKm} km / ${state.todayLeg.approxHours} hrs. ${esc(state.todayLeg.note)}</p>`
          : cur
            ? `<h2 class="font-display mt-1 text-xl font-semibold txt">${esc(cur.destination.name)}</h2>
               <p class="mt-1 text-sm txt-muted">${esc(cur.destination.district)}, ${esc(cur.state.name)} · ${esc(cur.destination.rawTheme)}</p>`
            : ""}
        ${cur && guides[cur.destination.slug] ? `<p class="mt-3 text-sm txt-muted">${esc(guides[cur.destination.slug].tip)}</p>` : ""}
      </div>

      ${state.nextLeg && state.lastDayHere
        ? `<div class="mt-4 rounded-xl border bd surface p-4">
             <p class="text-xs font-semibold uppercase tracking-wide txt-faint">Next</p>
             <p class="mt-1 text-sm txt">${esc(state.nextLeg.mode)} to ${esc(state.nextLeg.toName)} — about ${state.nextLeg.approxKm} km / ${state.nextLeg.approxHours} hrs.</p>
           </div>`
        : state.next
          ? `<div class="mt-4 rounded-xl border bd surface p-4">
               <p class="text-xs font-semibold uppercase tracking-wide txt-faint">After this</p>
               <p class="mt-1 text-sm txt">${esc(state.next.destination.name)}, ${esc(state.next.state.name)}</p>
             </div>`
          : ""}

      ${ess ? `<div class="mt-4 rounded-xl border bd surface p-4">
        <h3 class="font-display text-sm font-semibold txt">On the ground in ${esc(cur.state.name)}</h3>
        <dl class="mt-2 grid gap-2 text-sm sm:grid-cols-2">
          <div><dt class="text-xs uppercase tracking-wide txt-faint">Languages</dt><dd class="txt-muted">${esc(ess.languages.join(", "))}</dd></div>
          <div><dt class="text-xs uppercase tracking-wide txt-faint">Getting around</dt><dd class="txt-muted">${esc(ess.gettingAround)}</dd></div>
          <div><dt class="text-xs uppercase tracking-wide txt-faint">Eat</dt><dd class="txt-muted">${esc(ess.eat)}</dd></div>
          <div><dt class="text-xs uppercase tracking-wide txt-faint">Watch for</dt><dd class="txt-muted">${esc(ess.watchFor)}</dd></div>
        </dl>
        <p class="mt-3 text-xs txt-faint">${NATIONAL_NUMBERS.map((n) => `${esc(n.label)} ${esc(n.number)}`).join(" · ")}</p>
      </div>` : ""}`;
  }

  /* ---------- documents wallet ---------- */
  function walletFor(id) {
    const all = readKey(WALLET_KEY, {});
    return all[id] && typeof all[id] === "object" ? all[id] : {};
  }
  function saveWallet(tripId, taskId, patch) {
    const all = readKey(WALLET_KEY, {});
    const forTrip = all[tripId] || {};
    const prev = forTrip[taskId] || {};
    const next = {
      reference: patch.reference !== undefined ? patch.reference : prev.reference || "",
      booked: patch.booked !== undefined ? patch.booked : prev.booked || false,
    };
    if (!next.reference && !next.booked) delete forTrip[taskId];
    else forTrip[taskId] = next;
    all[tripId] = forTrip;
    writeKey(WALLET_KEY, all);
    return forTrip;
  }

  function prepBody(trip, prepItems, ticked) {
    const done = prepItems.filter((p) => ticked.indexOf(p.id) !== -1).length;
    const criticalLeft = prepItems.filter((p) => p.critical && ticked.indexOf(p.id) === -1).length;
    return `
      <div class="rounded-xl border bd surface p-4 shadow-card">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h2 class="font-display font-semibold txt">${done} of ${prepItems.length} done</h2>
            <p class="text-sm txt-muted">${criticalLeft ? `${criticalLeft} of them will stop the trip if you skip them.` : "Nothing critical outstanding."}</p>
          </div>
          <div class="h-2 w-24 overflow-hidden rounded-full surface-alt">
            <div class="h-full bg-accent" style="width:${prepItems.length ? (done / prepItems.length) * 100 : 0}%"></div>
          </div>
        </div>
        <p class="mt-3 text-xs txt-faint">Built from what is actually in this trip — permits, ferries, altitude, season and distance.</p>
      </div>
      ${OT.prep.groupPrep(prepItems).map((g) => `
        <section class="mt-6">
          <h3 class="font-display text-sm font-semibold uppercase tracking-wide txt-faint">${g.category}</h3>
          <ul class="mt-3 flex flex-col gap-2">
            ${g.items.map((item) => {
              const isDone = ticked.indexOf(item.id) !== -1;
              return `<li><label class="flex cursor-pointer gap-3 rounded-xl border p-4 ${isDone ? "bd surface-alt" : item.critical ? "border-coral-200 surface" : "bd surface"}">
                <input type="checkbox" data-check="${item.id}" ${isDone ? "checked" : ""} class="mt-0.5 h-5 w-5 shrink-0" style="accent-color:var(--accent)"/>
                <span class="min-w-0">
                  <span class="font-display block font-semibold ${isDone ? "txt-faint line-through" : "txt"}">${esc(item.title)}${item.critical && !isDone ? ' <span class="ml-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase" style="background:rgba(232,73,42,.15);color:#c73820">Critical</span>' : ""}</span>
                  <span class="mt-1 block text-sm txt-muted">${esc(item.detail)}</span>
                  ${item.because && item.because.length ? `<span class="mt-1.5 block text-xs txt-faint">Because of: ${esc(item.because.join(", "))}</span>` : ""}
                </span></label></li>`;
            }).join("")}
          </ul>
        </section>`).join("")}`;
  }

  function bookingsBody(trip, tasks) {
    const wallet = walletFor(trip.id);
    const booked = tasks.filter((t) => wallet[t.id] && wallet[t.id].booked).length;
    const items = trip.slugs.map(bySlug).filter(Boolean);
    const plan = buildTrip(items, { travelMonth: trip.travelMonth, daysAvailable: trip.daysAvailable });
    const brief = plan ? tripEnquiry(plan, trip.startDate) : "";
    return `
      <div class="rounded-xl border bd surface p-4 shadow-card">
        <h2 class="font-display font-semibold txt">${tasks.length} things to book, in this order</h2>
        <p class="mt-1 text-sm txt-muted">Permits first, then the transport everything hangs off, then park entry, then rooms. ${booked} of ${tasks.length} booked.</p>
        <p class="mt-3 rounded-lg surface-alt p-3 text-xs txt-muted">We never quote a price. Fares and availability change by the week, so take the brief below to the operator and book at their live price.</p>
        ${brief ? `<div class="mt-3 flex flex-wrap gap-2">
          <a href="${whatsappUrl(brief)}" target="_blank" rel="noopener noreferrer" class="rounded-lg border bd px-3 py-1.5 text-xs font-semibold txt">Send on WhatsApp</a>
          <a href="${mailtoUrl("Trip enquiry — " + trip.name, brief)}" class="rounded-lg border bd px-3 py-1.5 text-xs font-semibold txt">Email it</a>
          <button type="button" data-copy-enquiry class="rounded-lg border bd px-3 py-1.5 text-xs font-semibold txt">Copy enquiry</button>
        </div>` : ""}
      </div>
      <label class="mt-4 flex flex-col gap-1 text-sm">
        <span class="font-semibold txt">Start date</span>
        <input type="date" id="w-start" value="${trip.startDate || ""}" class="w-full max-w-xs rounded-lg border bd px-3 py-2 text-sm txt"/>
        <span class="text-xs txt-faint">Set this and every booking below gets a real date instead of a day number.</span>
      </label>
      <ul class="mt-5 flex flex-col gap-3">
        ${tasks.map((task) => {
          const providers = OT.operators.providersFor(task.kind);
          return `<li class="rounded-xl border ${task.urgency === "first" ? "border-coral-400" : "bd"} surface p-4 shadow-card" ${task.urgency === "first" ? 'style="border-left-width:4px"' : ""}>
            <div class="flex flex-wrap items-start justify-between gap-2">
              <div class="min-w-0">
                <span class="rounded surface-alt px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide txt-faint">${OT.operators.kindLabel(task.kind)}</span>
                <h3 class="font-display mt-1.5 font-semibold txt">${esc(task.title)}</h3>
                <p class="mt-1 text-sm txt-muted">${esc(task.brief)}</p>
                ${task.urgencyNote ? `<p class="mt-1 text-xs font-medium accent">${esc(task.urgencyNote)}</p>` : ""}
              </div>
            </div>
            <div class="mt-3 flex flex-wrap gap-2">
              ${providers.map((p) => p.url
                ? `<a href="${p.url}" target="_blank" rel="noopener noreferrer" title="${esc(p.note)}" class="rounded-lg px-3 py-1.5 text-xs font-semibold text-white" style="background:#0b1b30">${esc(p.name)} ↗${p.official ? " · official" : ""}</a>`
                : `<span title="${esc(p.note)}" class="rounded-lg border border-dashed bd px-3 py-1.5 text-xs txt-faint">${esc(p.name)} — add your partner link</span>`).join("")}
            </div>
            <div class="mt-3 flex flex-wrap items-center gap-3 border-t bd pt-3">
              <label class="flex items-center gap-2 text-xs font-semibold txt-muted">
                <input type="checkbox" data-wallet-booked="${task.id}"${wallet[task.id] && wallet[task.id].booked ? " checked" : ""}/> Booked
              </label>
              <input type="text" data-wallet-ref="${task.id}" value="${esc((wallet[task.id] && wallet[task.id].reference) || "")}" placeholder="PNR / permit no / confirmation" aria-label="Reference for ${esc(task.title)}" class="min-w-0 flex-1 rounded-lg border bd px-3 py-1.5 text-xs txt"/>
            </div>
          </li>`;
        }).join("")}
      </ul>`;
  }

  function spendBody(trip, plan) {
    const list = spendFor(trip.id);
    const total = list.reduce((s, e) => s + e.amount, 0);
    const days = plan ? plan.totalDays : 0;
    const cats = {};
    list.forEach((e) => (cats[e.category] = (cats[e.category] || 0) + e.amount));
    const rows = Object.keys(cats).sort((a, b) => cats[b] - cats[a]);
    const rupees = (n) => "₹" + n.toLocaleString("en-IN");

    return `
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
        ${[[rupees(total), "total so far"], [days ? rupees(Math.round(total / days)) : "—", "per day"], [String(list.length), "entries"]]
          .map(([v, l]) => `<div class="rounded-xl border bd surface p-4 text-center shadow-card"><div class="font-display text-2xl font-bold tabular-nums txt">${v}</div><div class="text-xs uppercase tracking-wide txt-faint">${l}</div></div>`).join("")}
      </div>
      <form id="spend-form" class="mt-5 rounded-xl border bd surface p-4 shadow-card">
        <h2 class="font-display text-sm font-semibold txt">Add a spend</h2>
        <div class="mt-3 grid gap-2 sm:grid-cols-[1fr_auto_auto_auto]">
          <input id="sp-label" placeholder="What was it?" class="rounded-lg border bd px-3 py-2 text-sm txt"/>
          <select id="sp-cat" class="rounded-lg border bd px-3 py-2 text-sm txt">
            ${["Transport","Stay","Food","Entry & permits","Guides","Shopping","Other"].map((c) => `<option>${c}</option>`).join("")}
          </select>
          <input id="sp-amt" inputmode="numeric" placeholder="₹" class="w-24 rounded-lg border bd px-3 py-2 text-sm tabular-nums txt"/>
          <button type="submit" class="rounded-lg bg-accent px-4 py-2 text-sm font-semibold">Add</button>
        </div>
      </form>
      ${rows.length ? `<div class="mt-5 rounded-xl border bd surface p-4 shadow-card">
        <h2 class="font-display text-sm font-semibold txt">Where it went</h2>
        <ul class="mt-3 flex flex-col gap-2">
          ${rows.map((c) => `<li class="flex items-center gap-3 text-sm">
            <span class="w-32 shrink-0 txt-muted">${c}</span>
            <span class="h-2 flex-1 overflow-hidden rounded-full surface-alt"><span class="block h-full" style="width:${(cats[c] / total) * 100}%;background:var(--text-muted)"></span></span>
            <span class="w-20 shrink-0 text-right font-semibold tabular-nums txt">${rupees(cats[c])}</span></li>`).join("")}
        </ul></div>` : ""}
      ${list.length ? `<ul class="mt-5 flex flex-col gap-2">${list.slice().reverse().map((e) => `
        <li class="flex items-center gap-3 rounded-xl border bd surface p-3 text-sm shadow-card">
          <span class="rounded surface-alt px-2 py-0.5 text-[11px] txt-faint">${esc(e.category)}</span>
          <span class="min-w-0 flex-1 truncate txt">${esc(e.label)}</span>
          <span class="font-semibold tabular-nums txt">${rupees(e.amount)}</span>
          <button type="button" data-del-spend="${e.id}" class="rounded px-2 txt-faint">✕</button></li>`).join("")}</ul>`
        : `<p class="mt-5 rounded-xl border border-dashed bd p-8 text-center text-sm txt-faint">Nothing logged yet. We never fill this in for you — fares and room rates move too fast for a guess to be worth anything.</p>`}`;
  }

  /* ---------- profile ---------- */
  function profileView() {
    const P = OT.profileData;
    const chip = (on) => `rounded-full px-3 py-1.5 text-sm font-medium ${on ? "text-white" : "border bd surface txt-muted"}`;
    const chipStyle = (on) => (on ? 'style="background:#0b1b30"' : "");
    const completed = store.trips.filter((t) => t.status === "completed").length;
    const seen = new Set(store.trips.filter((t) => t.status === "completed").flatMap((t) => t.slugs)).size;

    return `<div class="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 class="font-display text-3xl font-bold txt">You</h1>
      <p class="mt-2 txt-muted">How you travel, so the app plans the way you would. All of it stays on this device — there is no account.</p>
      <div class="mt-6 grid grid-cols-3 gap-3">
        ${[[String(store.trips.length), "trips saved"], [String(completed), "completed"], [String(seen), "places seen"]]
          .map(([v, l]) => `<div class="rounded-xl border bd surface p-4 text-center shadow-card"><div class="font-display text-2xl font-bold tabular-nums txt">${v}</div><div class="text-xs uppercase tracking-wide txt-faint">${l}</div></div>`).join("")}
      </div>
      <div class="mt-6 flex flex-col gap-5">
        <section class="rounded-2xl border bd surface p-5 shadow-card">
          <h2 class="font-display font-semibold txt">The basics</h2>
          <div class="mt-3 grid gap-3 sm:grid-cols-2">
            <label class="flex flex-col gap-1 text-sm"><span class="font-medium txt-muted">Name</span>
              <input id="pf-name" value="${esc(profile.name || "")}" placeholder="What should we call you?" class="rounded-lg border bd px-3 py-2 txt"/></label>
            <label class="flex flex-col gap-1 text-sm"><span class="font-medium txt-muted">Home city</span>
              <input id="pf-home" value="${esc(profile.homeCity || "")}" placeholder="Where do trips start?" class="rounded-lg border bd px-3 py-2 txt"/></label>
          </div>
        </section>
        <section class="rounded-2xl border bd surface p-5 shadow-card">
          <h2 class="font-display font-semibold txt">Your pace</h2>
          <div class="mt-3 flex flex-col gap-2">
            ${P.PACE_OPTIONS.map((p) => `<label class="flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${profile.pace === p.id ? "border-coral-300" : "bd"}">
              <input type="radio" name="pace" data-pace="${p.id}" ${profile.pace === p.id ? "checked" : ""} class="mt-1" style="accent-color:var(--accent)"/>
              <span><span class="block font-semibold txt">${p.label}</span><span class="block text-sm txt-muted">${esc(p.detail)}</span></span></label>`).join("")}
          </div>
        </section>
        <section class="rounded-2xl border bd surface p-5 shadow-card">
          <h2 class="font-display font-semibold txt">What pulls you in</h2>
          <div class="mt-3 flex flex-wrap gap-2">
            ${themes.map((t) => {
              const on = (profile.interests || []).indexOf(t) !== -1;
              return `<button type="button" data-interest="${t}" class="${chip(on)}" ${chipStyle(on)}>${themeEmoji[t]} ${t}</button>`;
            }).join("")}
          </div>
        </section>
        <section class="rounded-2xl border bd surface p-5 shadow-card">
          <h2 class="font-display font-semibold txt">How you travel</h2>
          <div class="mt-3 flex flex-col gap-4">
            <div><span class="text-sm font-medium txt-muted">Usually with</span>
              <div class="mt-2 flex flex-wrap gap-2">${P.COMPANY_OPTIONS.map((c) => `<button type="button" data-company="${c.id}" class="${chip(profile.company === c.id)}" ${chipStyle(profile.company === c.id)}>${c.label}</button>`).join("")}</div></div>
            <div><span class="text-sm font-medium txt-muted">Where you stay</span>
              <div class="mt-2 flex flex-wrap gap-2">${P.STAY_OPTIONS.map((s) => `<button type="button" data-stay="${s.id}" title="${esc(s.detail)}" class="${chip(profile.stayStyle === s.id)}" ${chipStyle(profile.stayStyle === s.id)}>${s.label}</button>`).join("")}</div></div>
            <label class="flex items-center gap-3 text-sm">
              <input type="checkbox" id="pf-veg" ${profile.vegetarian ? "checked" : ""} class="h-5 w-5" style="accent-color:var(--accent)"/>
              <span class="txt">Vegetarian — add food notes to the prep list</span></label>
          </div>
        </section>
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
  /* ---------- trip starter ---------- */
  const DAY_CHOICES = [4, 7, 10, 14, 21];
  const starter = { days: 7, month: new Date().getMonth() + 1, interests: [], result: null, ran: false };

  function startView() {
    const r = starter.result;
    return `
    <div class="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 class="font-display text-3xl font-bold txt">Plan my trip</h1>
      <p class="mt-2 txt-muted">Three questions. We check every stop against its season, add the travel between them, and give you something you can change.</p>

      <div class="mt-6 flex flex-col gap-5 rounded-2xl border bd surface p-5 shadow-card">
        <div>
          <span class="text-sm font-semibold txt">How many days do you have?</span>
          <div class="mt-2 flex flex-wrap gap-2">
            ${DAY_CHOICES.map((d) => `<button type="button" data-start-days="${d}" class="rounded-full px-4 py-2 text-sm font-semibold ${d === starter.days ? "text-white" : "border bd txt-muted"}" ${d === starter.days ? 'style="background:#0b1b30"' : ""}>${d} days</button>`).join("")}
          </div>
        </div>

        <div>
          <span class="text-sm font-semibold txt">Roughly when?</span>
          <div class="mt-2 flex flex-wrap gap-1.5">
            ${Array.from({ length: 12 }, (_, i) => i + 1).map((m) => `<button type="button" data-start-month="${m}" class="rounded-lg px-3 py-1.5 text-sm font-semibold ${m === starter.month ? "bg-accent" : "border bd txt-muted"}">${monthName(m)}</button>`).join("")}
          </div>
        </div>

        <div>
          <span class="text-sm font-semibold txt">What pulls you in? <span class="font-normal txt-faint">Leave empty for anything</span></span>
          <div class="mt-2 flex flex-wrap gap-2">
            ${themes.map((t) => `<button type="button" data-start-theme="${esc(t)}" class="rounded-full px-3 py-1.5 text-sm font-medium ${starter.interests.indexOf(t) !== -1 ? "text-white" : "border bd txt-muted"}" ${starter.interests.indexOf(t) !== -1 ? 'style="background:#0b1b30"' : ""}>${themeEmoji[t]} ${esc(t)}</button>`).join("")}
          </div>
        </div>

        <button type="button" data-start-run class="self-start rounded-lg bg-accent px-6 py-3 text-sm font-semibold">Build me a trip</button>
        <p class="text-xs txt-faint">Planning at a ${esc(profile.pace)} pace, from your profile.</p>
      </div>

      ${starter.ran && !r ? `<div class="mt-6 rounded-2xl border bd surface p-6">
        <h2 class="font-display font-semibold txt">Nothing fits that yet</h2>
        <p class="mt-2 text-sm txt-muted">Nothing in the catalogue is in season in ${monthFull(starter.month)} for those themes. Try a different month, or clear the themes and let us pick.</p>
      </div>` : ""}

      ${r ? `
      <div class="mt-8">
        ${r.relaxed === "interests" ? `<div class="mb-4 rounded-xl border bd surface-alt p-4" style="border-left:4px solid #f59e0b">
          <h3 class="font-display text-sm font-semibold txt">Those themes are out of season in ${monthFull(starter.month)}</h3>
          <p class="mt-1 text-sm txt-muted">${r.betterMonths && r.betterMonths.length ? `They are at their best in ${formatMonths(r.betterMonths)}. Here is what ${monthFull(starter.month)} is actually good for instead.` : `Here is what ${monthFull(starter.month)} is good for instead.`}</p>
        </div>` : ""}

        <article class="overflow-hidden rounded-2xl border bd surface shadow-card">
          <div class="relative" style="aspect-ratio:16/5">
            ${scene(r.slugs[0], r.plan.stops[0].destination.themes, 900, 280, "absolute inset-0 h-full w-full")}
            <div class="absolute inset-0" style="background:linear-gradient(to top, rgba(8,19,33,.85), transparent)"></div>
            <div class="absolute inset-x-0 bottom-0 p-5">
              <h2 class="font-display text-2xl font-bold text-white">${r.plan.totalDays} days, ${r.plan.stops.length} ${r.plan.stops.length === 1 ? "stop" : "stops"}</h2>
              <p class="text-sm" style="color:rgba(255,255,255,.8)">${r.plan.statesCovered.map(esc).join(" · ")}</p>
            </div>
          </div>
          <div class="p-5">
            <ul class="flex flex-col gap-1.5">
              ${r.reasons.map((x) => `<li class="flex gap-2 text-sm txt-muted"><span class="accent" aria-hidden="true">✓</span>${esc(x)}</li>`).join("")}
            </ul>
            <ol class="mt-4 flex flex-wrap gap-1.5">
              ${r.plan.stops.map((st, i) => `<li class="flex items-center gap-1">${i > 0 ? '<span class="txt-faint">→</span>' : ""}<a href="#/destinations/${st.destination.slug}" class="rounded-full surface-alt px-2.5 py-1 text-xs font-medium txt">${themeEmoji[st.destination.themes[0]]} ${esc(st.destination.name)}</a></li>`).join("")}
            </ol>
            <p class="mt-3 text-xs txt-faint">${shortDays(r.plan.daysAtDestinations)} at the places · ${shortDays(r.plan.travelDays)} in transit · ${r.plan.approxKm.toLocaleString("en-IN")} km</p>
            <div class="mt-5 flex flex-wrap gap-2">
              <button type="button" data-start-save class="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold">Save as my trip</button>
              <button type="button" data-start-run class="rounded-lg border bd px-5 py-2.5 text-sm font-semibold txt">Try again</button>
            </div>
          </div>
        </article>
      </div>` : ""}
    </div>`;
  }

  function route() {
    const raw = (location.hash || "#/").replace(/^#/, "");
    const [path, qs] = raw.split("?");
    const parts = path.split("/").filter(Boolean);
    const params = new URLSearchParams(qs || "");
    if (!parts.length) return { view: "home" };
    if (parts[0] === "destinations") return parts.length > 1 ? { view: "detail", slug: parts[1] } : { view: "destinations", theme: params.get("theme") };
    if (parts[0] === "states") return parts.length > 1 ? { view: "state", id: parts[1] } : { view: "states", zone: params.get("zone") };
    if (parts[0] === "cart") return { view: "cart" };
    if (parts[0] === "trips")
      return parts.length > 1
        ? { view: "workspace", id: parts[1], tab: params.get("tab") || "itinerary" }
        : { view: "trips" };
    if (parts[0] === "trip") return { view: "trip", bag: params.get("bag") };
    if (parts[0] === "start") return { view: "start" };
    if (parts[0] === "circuits") return { view: "circuits" };
    if (parts[0] === "profile") return { view: "profile" };
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
    } else if (r.view === "start") html = startView();
    else if (r.view === "circuits") html = circuitsView();
    else if (r.view === "trips") html = tripsView();
    else if (r.view === "workspace") html = workspaceView(r.id, r.tab);
    else if (r.view === "profile") html = profileView();
    else if (r.view === "campaign") html = campaignView();

    document.getElementById("app").innerHTML = html;
    document.querySelectorAll(".nav-link").forEach((a) => {
      const active =
        a.dataset.route === r.view ||
        (r.view === "detail" && a.dataset.route === "destinations") ||
        (r.view === "state" && a.dataset.route === "states") ||
        (r.view === "workspace" && a.dataset.route === "trips");
      a.classList.toggle("accent", active);
      a.classList.toggle("txt-muted", !active);
    });
    badge();
    syncTabs(r.view);
    if (scroll !== false) window.scrollTo(0, 0);
  }

  /* ---------- global search ----------
     The overlay lives outside #app, so typing in it survives a re-render. */
  const SEARCH_ICON = { destination: "📍", state: "🗺️", circuit: "🧭", theme: "🏷️", action: "⚡" };
  let searchCursor = 0;
  let searchHits = [];

  const searchEl = () => document.getElementById("search-overlay");
  const searchInput = () => document.getElementById("search-input");

  function renderSearch() {
    const q = searchInput().value;
    const box = document.getElementById("search-results");
    if (!q.trim()) {
      searchHits = [];
      box.innerHTML = `<div class="px-4 py-4">
        <p class="mb-2 text-xs font-semibold uppercase tracking-wide txt-faint">Try</p>
        <div class="flex flex-wrap gap-2">
          ${SEARCH_SUGGESTIONS.map((x) => `<button type="button" data-search-suggest="${esc(x)}" class="rounded-full surface-alt px-3 py-1 text-sm txt-muted">${esc(x)}</button>`).join("")}
        </div></div>`;
      return;
    }
    searchHits = searchAll(q);
    if (!searchHits.length) {
      box.innerHTML = `<p class="px-4 py-8 text-center text-sm txt-muted">Nothing matches “${esc(q.trim())}”. Try a state, a district or a theme like Beach.</p>`;
      return;
    }
    if (searchCursor >= searchHits.length) searchCursor = 0;
    box.innerHTML = `<ul role="listbox" aria-label="Search results">${searchHits
      .map((r, i) => {
        const inBag = r.slug && cart.indexOf(r.slug) !== -1;
        return `<li role="option" aria-selected="${i === searchCursor}" data-search-row="${i}" class="flex items-center gap-3 border-b bd px-4 py-3 ${i === searchCursor ? "surface-alt" : ""}">
          <span aria-hidden="true" class="text-lg">${SEARCH_ICON[r.kind]}</span>
          <button type="button" data-search-go="${i}" class="min-w-0 flex-1 text-left">
            <span class="block truncate text-sm font-semibold txt">${esc(r.title)}</span>
            <span class="block truncate text-xs txt-muted">${esc(r.subtitle)}</span>
          </button>
          ${r.slug ? `<button type="button" data-search-add="${esc(r.slug)}" class="shrink-0 rounded-lg border ${inBag ? "border-coral-400 accent" : "bd txt-muted"} px-2.5 py-1.5 text-xs font-semibold">${inBag ? "In trip" : "+ Trip"}</button>` : ""}
        </li>`;
      })
      .join("")}</ul>`;
  }

  function openSearch() {
    searchCursor = 0;
    searchEl().hidden = false;
    document.body.style.overflow = "hidden";
    searchInput().value = "";
    renderSearch();
    setTimeout(() => searchInput().focus(), 20);
  }
  function closeSearch() {
    searchEl().hidden = true;
    document.body.style.overflow = "";
  }

  // The app's routes are hashes, so a result href becomes a hash jump.
  function goSearch(i) {
    const hit = searchHits[i];
    if (!hit) return;
    closeSearch();
    location.hash = "#" + hit.href;
  }

  document.getElementById("search-open").addEventListener("click", openSearch);
  document.getElementById("search-close").addEventListener("click", closeSearch);
  document.getElementById("tab-search").addEventListener("click", (e) => {
    e.preventDefault();
    openSearch();
  });
  searchEl().addEventListener("click", (e) => {
    if (e.target === searchEl()) closeSearch();
  });
  searchInput().addEventListener("input", () => {
    searchCursor = 0;
    renderSearch();
  });
  document.getElementById("search-results").addEventListener("click", (e) => {
    const sug = e.target.closest("[data-search-suggest]");
    if (sug) {
      searchInput().value = sug.dataset.searchSuggest;
      renderSearch();
      searchInput().focus();
      return;
    }
    const go = e.target.closest("[data-search-go]");
    if (go) { goSearch(Number(go.dataset.searchGo)); return; }
    const add = e.target.closest("[data-search-add]");
    if (add) {
      const slug = add.dataset.searchAdd;
      const at = cart.indexOf(slug);
      if (at === -1) cart.push(slug); else cart.splice(at, 1);
      save();
      badge();
      renderSearch();
    }
  });

  document.addEventListener("keydown", (e) => {
    const open = !searchEl().hidden;
    if (e.key === "Escape" && open) { e.preventDefault(); closeSearch(); return; }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openSearch(); return; }

    const tag = e.target && e.target.tagName;
    const typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
    if (e.key === "/" && !open && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      openSearch();
      return;
    }
    if (!open || !searchHits.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); searchCursor = (searchCursor + 1) % searchHits.length; renderSearch(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); searchCursor = (searchCursor - 1 + searchHits.length) % searchHits.length; renderSearch(); }
    else if (e.key === "Enter") { e.preventDefault(); goSearch(searchCursor); }
  });

  document.addEventListener("click", (e) => {
    /* ---------- trip starter ---------- */
    const sd = e.target.closest("[data-start-days]");
    if (sd) { starter.days = Number(sd.dataset.startDays); render(false); return; }
    const sm = e.target.closest("[data-start-month]");
    if (sm) { starter.month = Number(sm.dataset.startMonth); render(false); return; }
    const sth = e.target.closest("[data-start-theme]");
    if (sth) {
      const t = sth.dataset.startTheme;
      const at = starter.interests.indexOf(t);
      if (at === -1) starter.interests.push(t); else starter.interests.splice(at, 1);
      render(false);
      return;
    }
    if (e.target.closest("[data-start-run]")) {
      e.preventDefault();
      starter.ran = true;
      starter.result = startTrip({
        days: starter.days,
        month: starter.month,
        interests: starter.interests.slice(),
        pace: profile.pace,
      });
      render(false);
      return;
    }
    if (e.target.closest("[data-start-save]")) {
      e.preventDefault();
      if (!starter.result) return;
      const trip = makeTrip(starter.result.plan.statesCovered.slice(0, 2).join(" to "), starter.result.slugs.slice());
      trip.travelMonth = starter.month;
      trip.daysAvailable = starter.days;
      store.trips.unshift(trip);
      store.activeId = trip.id;
      cart = trip.slugs.slice();
      persistTrips();
      location.hash = "#/trips/" + trip.id;
      return;
    }

    if (e.target.closest("[data-copy-enquiry]")) {
      e.preventDefault();
      const btn = e.target.closest("[data-copy-enquiry]");
      const trip = activeTrip();
      const items = trip ? trip.slugs.map(bySlug).filter(Boolean) : [];
      const plan = items.length ? buildTrip(items, { travelMonth: trip.travelMonth, daysAvailable: trip.daysAvailable }) : null;
      if (plan && navigator.clipboard) {
        navigator.clipboard.writeText(tripEnquiry(plan, trip.startDate));
        btn.textContent = "Copied ✓";
        setTimeout(() => { btn.textContent = "Copy enquiry"; }, 1800);
      }
      return;
    }

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
      return;
    }

    if (e.target.closest("[data-new-trip]")) {
      e.preventDefault();
      const t = makeTrip("New trip", []);
      store.trips.push(t);
      store.activeId = t.id;
      cart = [];
      persistTrips();
      location.hash = "#/destinations";
      return;
    }
    const act = e.target.closest("[data-activate]");
    if (act) {
      e.preventDefault();
      store.activeId = act.dataset.activate;
      const t = activeTrip();
      cart = t ? t.slugs.slice() : [];
      persistTrips();
      render(false);
      return;
    }
    const del = e.target.closest("[data-delete-trip]");
    if (del) {
      e.preventDefault();
      const t = store.trips.find((x) => x.id === del.dataset.deleteTrip);
      if (t && window.confirm(`Delete "${t.name}"? This cannot be undone.`)) {
        store.trips = store.trips.filter((x) => x.id !== t.id);
        if (store.activeId === t.id) {
          store.activeId = store.trips[0] ? store.trips[0].id : null;
          const a = activeTrip();
          cart = a ? a.slugs.slice() : [];
        }
        persistTrips();
        render(false);
      }
      return;
    }
    const delSpend = e.target.closest("[data-del-spend]");
    if (delSpend) {
      e.preventDefault();
      const r = route();
      const all = readKey(SPEND_KEY, {});
      all[r.id] = (all[r.id] || []).filter((x) => x.id !== delSpend.dataset.delSpend);
      writeKey(SPEND_KEY, all);
      render(false);
      return;
    }
    const interest = e.target.closest("[data-interest]");
    if (interest) {
      e.preventDefault();
      const t = interest.dataset.interest;
      const list = profile.interests || [];
      profile.interests = list.indexOf(t) === -1 ? list.concat(t) : list.filter((x) => x !== t);
      writeKey(PROFILE_KEY, profile);
      render(false);
      return;
    }
    const company = e.target.closest("[data-company]");
    if (company) {
      e.preventDefault();
      profile.company = company.dataset.company;
      writeKey(PROFILE_KEY, profile);
      render(false);
      return;
    }
    const stay = e.target.closest("[data-stay]");
    if (stay) {
      e.preventDefault();
      profile.stayStyle = stay.dataset.stay;
      writeKey(PROFILE_KEY, profile);
      render(false);
    }
  });

  document.addEventListener("submit", (e) => {
    if (e.target.id !== "spend-form") return;
    e.preventDefault();
    const r = route();
    const amount = Number(document.getElementById("sp-amt").value);
    if (!isFinite(amount) || amount <= 0) return;
    const label = document.getElementById("sp-label").value.trim();
    const category = document.getElementById("sp-cat").value;
    const all = readKey(SPEND_KEY, {});
    all[r.id] = (all[r.id] || []).concat({
      id: "exp_" + Math.random().toString(36).slice(2, 9),
      category,
      label: label || category,
      amount: Math.round(amount),
    });
    writeKey(SPEND_KEY, all);
    render(false);
  });

  document.addEventListener("input", (e) => {
    if (e.target.id === "f-q") { filters.q = e.target.value; filters.visible = 24; updateGrid(); return; }
    // Saved without re-rendering, or the field would lose focus mid-word.
    if (e.target.dataset && e.target.dataset.walletRef) {
      saveWallet(route().id, e.target.dataset.walletRef, { reference: e.target.value });
      return;
    }
    if (e.target.id === "pf-name") { profile.name = e.target.value; writeKey(PROFILE_KEY, profile); return; }
    if (e.target.id === "pf-home") { profile.homeCity = e.target.value; writeKey(PROFILE_KEY, profile); }
  });

  document.addEventListener("change", (e) => {
    const id = e.target.id;
    const r = route();

    if (e.target.dataset && e.target.dataset.walletBooked) {
      saveWallet(r.id, e.target.dataset.walletBooked, { booked: e.target.checked });
      render(false);
      return;
    }
    if (e.target.dataset && e.target.dataset.check) {
      const all = readKey(CHECK_KEY, {});
      const list = all[r.id] || [];
      const key = e.target.dataset.check;
      all[r.id] = list.indexOf(key) === -1 ? list.concat(key) : list.filter((x) => x !== key);
      writeKey(CHECK_KEY, all);
      render(false);
      return;
    }
    if (e.target.dataset && e.target.dataset.pace) {
      profile.pace = e.target.dataset.pace;
      writeKey(PROFILE_KEY, profile);
      render(false);
      return;
    }
    if (id === "pf-veg") { profile.vegetarian = e.target.checked; writeKey(PROFILE_KEY, profile); return; }
    if (id === "w-status") {
      const t = store.trips.find((x) => x.id === r.id);
      if (t) { t.status = e.target.value; persistTrips(); render(false); }
      return;
    }
    if (id === "w-start") {
      const t = store.trips.find((x) => x.id === r.id);
      if (t) { t.startDate = e.target.value; persistTrips(); render(false); }
      return;
    }
    if (id === "p-month") {
      planner.month = Number(e.target.value);
      const t = r.view === "workspace" ? store.trips.find((x) => x.id === r.id) : null;
      if (t) { t.travelMonth = planner.month || undefined; persistTrips(); }
      render(false);
      return;
    }
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
