import { always } from "@antithesishq/bombadil";
import { actions, extract, registerCustomAction } from "@antithesishq/bombadil/browser";

export {
  defaultActions,
  noConsoleErrors,
  noUncaughtExceptions,
  noUnhandledPromiseRejections,
} from "@antithesishq/bombadil/browser/defaults";

// Bombadil clicks, types and resizes its way around the built site; these must hold on every page.
const page = extract(({ document, window }) => {
  const root = document.documentElement;
  const look = document.querySelector(".look-btn");
  const shield = document.querySelector(".shield");
  return {
    width: window.innerWidth,
    scrollWidth: root.scrollWidth,
    theme: root.dataset.theme ?? null,
    film: root.dataset.look === "film",
    lookPressed: look?.getAttribute("aria-pressed") ?? null,
    spoil: root.dataset.spoil ?? null,
    shieldOn: shield?.classList.contains("on") ?? null,
    hasTopbar: !!document.querySelector("header.topbar"),
    // Pictures drawn at a different shape from their source (squashed or stretched).
    distorted: [...document.querySelectorAll("img")].filter((im) => {
      const b = im.getBoundingClientRect();
      if (!im.complete || !im.naturalWidth || !b.width || !b.height) return false;
      const fit = window.getComputedStyle(im).objectFit;
      if (fit === "cover" || fit === "contain") return false;
      return Math.abs(b.width / b.height / (im.naturalWidth / im.naturalHeight) - 1) > 0.03;
    }).length,
  };
});

// No page scrolls sideways, at any viewport (wide trees and maps scroll inside their own boxes).
export const noHorizontalOverflow = always(() => page.current.scrollWidth <= page.current.width + 1);
// Every picture keeps its own shape: portraits and art are never squashed or stretched.
export const picturesKeepShape = always(() => page.current.distorted === 0);
// boot.js always sets a theme before first paint.
export const themeIsSet = always(
  () => !page.current.hasTopbar || page.current.theme === "light" || page.current.theme === "dark",
);
// The BOOK/FILM switch shows the art style the page is actually using.
export const lookSwitchAgrees = always(
  () => page.current.lookPressed === null || page.current.lookPressed === String(page.current.film),
);
// The spoiler shield's badge is lit exactly when a spoiler level is set.
export const shieldBadgeAgrees = always(
  () => page.current.shieldOn === null || page.current.shieldOn === (page.current.spoil !== null),
);

const key = registerCustomAction("key", async (document, _window, k: string) => {
  document.body.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true }));
});
export const shortcuts = actions(() => [key("/"), key("Escape")]);

export const viewportChanges = actions(() => [
  { SetViewport: { width: 360, height: 640 } },
  { SetViewport: { width: 800, height: 900 } },
  { SetViewport: { width: 1440, height: 900 } },
]);
