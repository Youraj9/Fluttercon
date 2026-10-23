const flutterModules = [
  ["Quick review: Flutter fundamentals", "Widgets, state, context, keys, the three trees, layouts, and theming—sharpen the mental model.", "◈"],
  ["Dart in depth", "Null safety, async/await, streams, isolates, generics, extensions, records, and sealed classes.", "⌁"],
  ["State management", "Compare setState, Provider, Riverpod, and Bloc; choose by state scope and app needs.", "▤"],
  ["Navigation", "GoRouter, nested routes, deep links, redirects, and auth guards.", "↗"],
  ["Architecture", "Feature-first structure, clean architecture, repositories, and get_it dependency injection.", "⌘"],
  ["Networking", "Dio, interceptors, typed errors, retry strategy, freezed, and JSON serialization.", "⌁"],
  ["Local storage & offline-first", "Preferences, secure storage, Drift/SQLite, Hive/Isar, caching, and sync foundations.", "▣"],
  ["Forms, responsive UI & animation", "Validation, adaptive layouts, accessible forms, and purposeful motion.", "◌"],
  ["Performance", "Rebuild control, const widgets, efficient lists, DevTools profiling, and leak prevention.", "↗"],
  ["Testing", "Unit, widget, integration, golden tests, and maintainable mocks.", "✓"],
  ["Platform & Firebase", "Permissions, platform channels, push notifications, and Firebase basics.", "▧"],
  ["Mobile security", "Secure token storage, certificate pinning, and release obfuscation.", "◉"],
  ["Release & CI/CD", "Flavors, environments, GitHub Actions, and Play Store/App Store publishing.", "⌁"],
  ["Polish & operations", "Accessibility, localization, Crashlytics/Sentry, and production error reporting.", "✳"],
];

const backendModules = [
  ["Flutter ↔ API foundations", "REST, JSON, status codes, API contracts, and OpenAPI. Build the transaction endpoints.", "⌘"],
  ["Mobile-friendly API design", "Pagination, versioning, partial responses, consistent errors, and mobile network realities.", "▤"],
  ["Authentication end to end", "Signup, login, JWT + refresh tokens, Flutter secure storage, Dio auto-refresh, and social login.", "◉"],
  ["Files & cloud storage", "Multipart uploads, secure image/file downloads, object storage, and signed URLs.", "▧"],
  ["Push notifications", "Register device tokens and trigger FCM messages safely from the backend.", "♧"],
  ["Real-time updates", "WebSockets/Socket.IO, event delivery, reconnects, and Flutter subscriptions.", "⌁"],
  ["Offline sync & conflicts", "Queue local changes, synchronize later, and define conflict-resolution rules.", "⟳"],
  ["API security & limits", "Rate limiting, server-side validation, authorization, and mobile-client threat boundaries.", "◈"],
  ["Choose your backend", "When custom Node.js/PostgreSQL, Firebase, or Supabase makes the most sense.", "⇄"],
  ["Environments & deployment", "Dev/staging/prod, API versioning for old apps, deployments, and forced updates.", "↗"],
  ["Test the integration", "API unit/integration tests and Flutter fakes, mocks, and contract verification.", "✓"],
  ["Operate & observe", "Structured logs, monitoring, analytics, and cross-service error reporting.", "◎"],
];

function makeModuleCard(item, index, track) {
  const article = document.createElement("article");
  article.className = "module-card searchable";
  article.dataset.search = `${track} ${item.join(" ")}`.toLowerCase();
  article.innerHTML = `<div class="module-card-top"><span>MODULE ${String(index + 1).padStart(2, "0")}</span><span class="module-icon" aria-hidden="true">${item[2]}</span></div><h3>${item[0]}</h3><p>${item[1]}</p>`;
  return article;
}

document.querySelector("#flutter-modules").replaceChildren(
  ...flutterModules.map((module, index) => makeModuleCard(module, index, "flutter")),
);
document.querySelector("#backend-modules").replaceChildren(
  ...backendModules.map((module, index) => makeModuleCard(module, index, "backend")),
);

const themeButtons = [...document.querySelectorAll("[data-theme-choice]")];
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("build-ship-theme", theme);
  themeButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.themeChoice === theme));
  });
  updateThemeColor(theme);
}
function updateThemeColor(theme) {
  const dark = theme === "dark"
    || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.querySelector('meta[name="theme-color"]').content = dark ? "#171a17" : "#f8f8f4";
}
setTheme(localStorage.getItem("build-ship-theme") || "system");
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (document.documentElement.dataset.theme === "system") updateThemeColor("system");
});
themeButtons.forEach((button) => {
  button.addEventListener("click", () => setTheme(button.dataset.themeChoice));
});

document.querySelectorAll(".lesson-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".lesson-card");
    const collapsed = card.classList.toggle("is-collapsed");
    button.setAttribute("aria-expanded", String(!collapsed));
    button.setAttribute("aria-label", `${collapsed ? "Expand" : "Collapse"} ${card.querySelector("h3").textContent}`);
    button.textContent = collapsed ? "+" : "−";
  });
});

const menuToggle = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");
menuToggle.addEventListener("click", () => {
  const open = sidebar.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});
sidebar.querySelectorAll(".side-link").forEach((link) => {
  link.addEventListener("click", () => {
    sidebar.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    document.querySelectorAll(".side-link").forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});

const searchInput = document.querySelector("#site-search");
const searchEmpty = document.querySelector("#search-empty");
const searchableSections = [...document.querySelectorAll(
  ".hero, .stats-row, .path-section, .backend-section, .first-module, .quick-section, .checklist-section, .footer",
)];
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  let matches = 0;
  searchableSections.forEach((section) => {
    const ownText = section.innerText.toLowerCase().includes(query);
    const cards = [...section.querySelectorAll(".searchable")];
    if (cards.length) {
      let sectionMatches = 0;
      cards.forEach((card) => {
        const visible = !query || card.dataset.search.includes(query);
        card.classList.toggle("search-hidden", !visible);
        if (visible) sectionMatches += 1;
      });
      section.classList.toggle("search-hidden", Boolean(query) && sectionMatches === 0 && !ownText);
      matches += sectionMatches;
    } else {
      const visible = !query || ownText;
      section.classList.toggle("search-hidden", !visible);
      if (visible) matches += 1;
    }
  });
  searchEmpty.hidden = !query || matches > 0;
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape" && document.activeElement === searchInput) {
    searchInput.value = "";
    searchInput.dispatchEvent(new Event("input"));
    searchInput.blur();
  }
});
