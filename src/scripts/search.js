(() => {
  const docs = JSON.parse(document.getElementById("search-index").textContent);
  const norm = (s) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/['’]/g, "")
      .toLowerCase();
  for (const d of docs) {
    d.nt = norm(d.t);
    d.ns = norm(d.s);
    d.nb = norm(d.b);
  }
  const q = document.getElementById("q"),
    out = document.getElementById("results"),
    count = document.getElementById("count");
  const kindName = { event: "event", character: "person", faction: "power" };
  let kind = "";
  const esc = (s) =>
    s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const mark = (text, terms) => {
    let h = esc(text);
    for (const t of terms) {
      if (t.length < 2) continue;
      h = h.replace(
        new RegExp("(" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi"),
        "<mark>$1</mark>",
      );
    }
    return h;
  };
  const snippet = (d, terms) => {
    const i = Math.max(
      0,
      ...terms
        .map((t) => d.nb.indexOf(t))
        .filter((i) => i >= 0)
        .slice(0, 1),
    );
    let start = Math.max(0, i - 60);
    if (start > 0) {
      const sp = d.b.indexOf(" ", start);
      if (sp > -1 && sp < i) start = sp + 1;
    }
    const cut = d.b.slice(start, start + 190);
    return (start > 0 ? "…" : "") + cut + (start + 190 < d.b.length ? "…" : "");
  };
  const wordStart = (hay, t) => hay.startsWith(t) || hay.includes(" " + t);
  const run = () => {
    const raw = q.value.trim();
    const terms = norm(raw).split(/\s+/).filter(Boolean);
    const url = new URL(location.href);
    if (raw) url.searchParams.set("q", raw);
    else url.searchParams.delete("q");
    history.replaceState(null, "", url);
    if (!terms.length) {
      out.innerHTML = "";
      count.textContent = "";
      return;
    }
    const hits = [];
    for (const d of docs) {
      if (kind && d.k !== kind) continue;
      let score = 0,
        ok = true;
      for (const t of terms) {
        const inT = d.nt.includes(t),
          inS = d.ns.includes(t),
          inB = d.nb.includes(t);
        if (!inT && !inS && !inB) {
          ok = false;
          break;
        }
        score += (inT ? 10 : 0) + (inS ? 4 : 0) + (inB ? 1 : 0) + (wordStart(d.nt, t) ? 5 : 0);
      }
      if (ok) hits.push([score, d]);
    }
    hits.sort((a, b) => b[0] - a[0]);
    const words = raw.split(/\s+/).filter(Boolean);
    count.textContent = hits.length
      ? `${hits.length} ${hits.length === 1 ? "record" : "records"}`
      : "Nothing in the record. The archive is not the whole universe.";
    out.innerHTML = hits
      .slice(0, 60)
      .map(
        ([, d]) =>
          `<li${d.p ? ` data-sp="${d.p}" data-spl="${esc(d.pl)}"` : ""}><a class="pxbox" href="${esc(d.u)}"><span class="r-kind k-${d.k}">${kindName[d.k]}</span>` +
          `<b>${mark(d.t, words)}${d.s ? `<small>${esc(d.s)}</small>` : ""}</b>` +
          `<p>${mark(snippet(d, terms), words)}</p></a></li>`,
      )
      .join("");
    window.spoilRefresh?.(out);
  };
  document.querySelectorAll(".search-filters button").forEach((b) =>
    b.addEventListener("click", () => {
      kind = b.dataset.k;
      document
        .querySelectorAll(".search-filters button")
        .forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      run();
    }),
  );
  q.addEventListener("input", run);
  q.value = new URLSearchParams(location.search).get("q") ?? "";
  run();
})();
