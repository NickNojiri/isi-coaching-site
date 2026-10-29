// Page animations and video players. The quiz lives in quiz.js.

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Headline: wrap every word so the words can slide up one after another.
document.querySelectorAll("[data-split]").forEach((heading) => {
  heading.setAttribute("aria-label", heading.textContent.replace(/\s+/g, " ").trim());
  let i = 0;
  const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach((node) => {
    const frag = document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        frag.append(" ");
        return;
      }
      const outer = document.createElement("span");
      const inner = document.createElement("span");
      outer.className = "word";
      outer.setAttribute("aria-hidden", "true");
      inner.textContent = part;
      inner.style.setProperty("--i", i++);
      outer.append(inner);
      frag.append(outer);
    });
    node.replaceWith(frag);
  });
});

// Fade sections in as they scroll into view.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-in");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll("[data-reveal]").forEach((el) => revealObserver.observe(el));

// Numbers count up from 0 the first time they're seen.
function countUp(el) {
  const target = Number(el.dataset.count);
  if (reduceMotion) return;
  const duration = 1400;
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(target * eased);
    if (t < 1) requestAnimationFrame(tick);
  };
  el.textContent = "0";
  requestAnimationFrame(tick);
}
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    countUp(entry.target);
    countObserver.unobserve(entry.target);
  });
}, { threshold: 0.6 });
document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));

// Video players: big red play button first, normal controls once playing.
const players = [...document.querySelectorAll(".player")];

function play(player) {
  const video = player.querySelector("video");
  players.forEach((other) => {
    if (other !== player) other.querySelector("video").pause();
  });
  video.controls = true;
  player.classList.add("is-playing");
  video.play();
}

players.forEach((player) => {
  const video = player.querySelector("video");
  video.controls = false;
  player.querySelector(".player__play").addEventListener("click", () => play(player));
  video.addEventListener("play", () => player.classList.add("is-playing"));
});

document.querySelectorAll("[data-play]").forEach((btn) => {
  btn.addEventListener("click", () => play(document.getElementById(btn.dataset.play)));
});

// Top bar gets a dark background once you scroll.
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 20);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Phone-only sticky button: shows after the top button scrolls away and
// hides again when the big red section at the bottom is on screen.
const sticky = document.getElementById("sticky-cta");
const heroCta = document.getElementById("hero-cta");
const finalCta = document.getElementById("final-cta");
let heroGone = false;
let finalShowing = false;
const updateSticky = () => sticky.classList.toggle("is-visible", heroGone && !finalShowing);
new IntersectionObserver(([entry]) => {
  heroGone = !entry.isIntersecting && entry.boundingClientRect.top < 0;
  updateSticky();
}).observe(heroCta);
new IntersectionObserver(([entry]) => {
  finalShowing = entry.isIntersecting;
  updateSticky();
}).observe(finalCta);
