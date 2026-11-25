(() => {
  // Art style: book (hi-bit, default) or film (cinematic). Only the pictures change.
  const b = document.querySelector(".look-btn"),
    d = document.documentElement;
  const sync = () => {
    const film = d.dataset.look === "film";
    b?.setAttribute("aria-pressed", String(film));
    b?.setAttribute(
      "aria-label",
      film ? "Art style: film. Switch to book style" : "Art style: book. Switch to film style",
    );
  };
  sync();
  b?.addEventListener("click", () => {
    if (d.dataset.look === "film") delete d.dataset.look;
    else d.dataset.look = "film";
    try {
      d.dataset.look ? localStorage.setItem("look", "film") : localStorage.removeItem("look");
    } catch {}
    sync();
  });
})();
// Forms on this site never submit anywhere; keep Enter from reloading the page.
document
  .querySelectorAll("form.shield-panel, form.search-box")
  .forEach((f) => f.addEventListener("submit", (e) => e.preventDefault()));
document.querySelector(".theme-btn")?.addEventListener("click", () => {
  const d = document.documentElement;
  d.dataset.theme = d.dataset.theme === "light" ? "dark" : "light";
  try {
    localStorage.setItem("theme", d.dataset.theme);
  } catch {}
});
(() => {
  // Spoiler shield: veil anything marked later than the chosen point; tap to reveal one item.
  const d = document.documentElement,
    shield = document.querySelector(".shield");
  const short = Object.fromEntries(
    [...document.querySelectorAll(".shield-panel input")].map((i) => [
      i.value,
      i.parentElement.textContent.trim(),
    ]),
  );
  const level = () => +(d.dataset.spoil || 7);
  const veiled = (el) => +el.dataset.sp > level() && !el.classList.contains("sp-open");
  const mark = (el) => {
    const v = veiled(el);
    if (v) {
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      el.setAttribute("aria-label", `Spoiler for ${el.dataset.spl}. Press to show.`);
    } else if (el.hasAttribute("aria-label") && el.getAttribute("role") === "button") {
      el.removeAttribute("tabindex");
      el.removeAttribute("role");
      el.removeAttribute("aria-label");
    }
    for (const c of el.children) c.inert = v;
  };
  const refresh = (root = document) => {
    root.querySelectorAll("[data-sp]").forEach(mark);
    const L = level(),
      tag = shield?.querySelector(".shield-tag");
    if (tag) tag.textContent = ["", "PT 1", "DUNE", "MESS", "KIDS", "GOD", "HERE", ""][L] ?? "";
    shield?.classList.toggle("on", L < 7);
    document.querySelectorAll(".shield-panel input").forEach((i) => {
      i.checked = +i.value === L;
    });
    document.querySelectorAll(".shield-now").forEach((n) => {
      n.textContent = L < 7 ? `on: up to ${short[L]}` : "off";
    });
  };
  window.spoilRefresh = refresh;
  document.querySelector(".shield-panel")?.addEventListener("change", (e) => {
    const L = +e.target.value;
    if (L < 7) d.dataset.spoil = String(L);
    else delete d.dataset.spoil;
    try {
      L < 7 ? localStorage.setItem("spoil", String(L)) : localStorage.removeItem("spoil");
    } catch {}
    document.querySelectorAll(".sp-open").forEach((x) => x.classList.remove("sp-open"));
    refresh();
  });
  const reveal = (e) => {
    const el = e.target.closest?.("[data-sp]");
    if (!el || !veiled(el)) return;
    if (e.type === "keydown" && e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    e.stopPropagation();
    el.classList.add("sp-open");
    mark(el);
    el.querySelectorAll("[data-sp]").forEach((x) => {
      if (+x.dataset.sp <= +el.dataset.sp) {
        x.classList.add("sp-open");
        mark(x);
      }
    });
  };
  document.addEventListener("click", reveal, true);
  document.addEventListener("keydown", reveal, true);
  document.addEventListener("click", (e) => {
    if (shield?.open && !shield.contains(e.target)) shield.open = false;
  });
  document.querySelectorAll("[data-open-shield]").forEach((b) =>
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      if (shield) {
        shield.open = true;
        shield.querySelector("input:checked, input")?.focus();
      }
    }),
  );
  refresh();
})();
const nav = document.querySelector(".nav"),
  cur = nav?.querySelector('[aria-current="page"]');
if (nav && cur && nav.scrollWidth > nav.clientWidth)
  nav.scrollLeft = cur.offsetLeft - nav.clientWidth / 2 + cur.offsetWidth / 2;
document.addEventListener("keydown", (e) => {
  if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
  const t = e.target;
  if (t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)))
    return;
  const q = document.getElementById("q");
  e.preventDefault();
  if (q) q.focus();
  else location.href = document.querySelector(".search-btn").href;
});
