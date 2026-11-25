(() => {
  const box = document.querySelector(".tree-box"),
    paul = document.querySelector('.t-card[href*="/paul"], .t-card[href*="characters-paul"]');
  if (box && paul && box.scrollWidth > box.clientWidth)
    box.scrollLeft = paul.offsetLeft - box.clientWidth / 2 + paul.offsetWidth / 2;
})();
