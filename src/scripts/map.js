(() => {
  const box = document.querySelector(".map-box"),
    dune = document.getElementById("pl-arrakis");
  if (!box || !dune || box.scrollWidth <= box.clientWidth) return;
  const b = box.getBoundingClientRect(),
    d = dune.getBoundingClientRect();
  box.scrollLeft = d.left - b.left - box.clientWidth / 2 + d.width / 2;
})();
