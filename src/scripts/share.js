(() => {
  const url = location.href.split("#")[0];
  const msg = document.querySelector(".share-msg");
  document.querySelector("[data-copy]")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(url);
      msg.textContent = "Link copied.";
    } catch {
      msg.textContent = url;
    }
  });
  const s = document.querySelector("[data-share]");
  if (s && navigator.share) {
    s.hidden = false;
    s.addEventListener("click", () => navigator.share({ title: document.title, url }).catch(() => {}));
  }
})();
