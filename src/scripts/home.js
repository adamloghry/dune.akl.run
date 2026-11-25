(() => {
  const out = document.querySelector(".era-now");
  if (!out || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(
    (es) => {
      for (const e of es)
        if (e.isIntersecting) out.textContent = "▸ " + e.target.querySelector("h2").textContent;
    },
    { rootMargin: "-40% 0px -55% 0px" },
  );
  document.querySelectorAll(".era").forEach((s) => io.observe(s));
})();
