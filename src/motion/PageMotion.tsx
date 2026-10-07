"use client";

import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText, registerGsap } from "@/motion/gsap";

/**
 * One motion system for every page. Components mark a few things with data
 * attributes; everything else in <main> is found by selector, so a new page
 * picks the motion up without extra code.
 *
 *   data-motion="header"        site header: drops in, hides on scroll down
 *   data-motion="hero-visual"   first-screen visual: rises in, floats, parallax
 *   data-motion="cta"           closing panel: scales up as it scrolls in
 *   data-motion="progress"      scroll progress bar
 *   data-count                  number counts up when it scrolls into view
 *   data-magnetic               button follows the pointer a little (mouse only)
 *   data-motion-container       reveal this element's children, not itself
 *   data-motion-skip            leave this subtree alone (games, live canvases)
 *
 * The page stays hidden by the html.motion-wait class (set before paint in
 * the root layout) until the starting states below are in place, so nothing
 * flashes. Reduced motion skips all of it.
 */

const EASE = "expo.out";

// Blocks that reveal as they scroll in. Only the outermost match animates,
// so a card moves as one piece rather than every line inside it.
const BLOCKS = [
  "h3",
  "p",
  "li",
  "dt",
  "dd",
  "tr",
  "pre",
  "details",
  "figure",
  ".glass",
  ".glass-strong",
  ".lift",
  "a.inline-flex",
  "[data-reveal]",
].join(",");

function isSkipped(el: Element) {
  return Boolean(
    el.closest("[data-motion-skip], svg") ||
    el.parentElement?.closest("h1, h2, h3"),
  );
}

function outermost(els: Element[]) {
  const set = new Set(els);
  return els.filter((el) => {
    for (let p = el.parentElement; p; p = p.parentElement)
      if (set.has(p)) return false;
    return true;
  });
}

// "4.9/5" -> 4.9 with "/5" kept; "500+" -> 500 with "+"; "201" -> 201.
function parseCount(text: string) {
  const m = text.trim().match(/^([\d.,]+)(.*)$/);
  if (!m) return null;
  const raw = m[1].replace(/,/g, "");
  const value = Number(raw);
  if (!Number.isFinite(value)) return null;
  const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
  return { value, decimals, suffix: m[2] };
}

export function PageMotion() {
  useGSAP(() => {
    registerGsap();
    const html = document.documentElement;
    const release = () => html.classList.remove("motion-wait");
    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduce: "(prefers-reduced-motion: reduce)",
        fine: "(pointer: fine) and (min-width: 768px)",
      },
      (ctx) => {
        const { reduce, fine } = ctx.conditions as {
          reduce: boolean;
          fine: boolean;
        };
        if (reduce) {
          release();
          return;
        }

        const main = document.querySelector("main");
        if (!main) {
          release();
          return;
        }
        // Blur is the expensive part of a reveal; phones get fade and rise only.
        const blur = fine ? "blur(8px)" : "blur(0px)";
        const title = main.querySelector("h1");

        // ---- Scroll progress ------------------------------------------------
        const bar = document.querySelector("[data-motion='progress']");
        if (bar) {
          gsap.fromTo(
            bar,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: { start: 0, end: "max", scrub: 0.4 },
            },
          );
        }

        // ---- Header: drop in, then hide while scrolling down ---------------
        const header = document.querySelector<HTMLElement>(
          "[data-motion='header']",
        );
        if (header) {
          gsap.from(header, {
            yPercent: -100,
            opacity: 0,
            duration: 1,
            ease: EASE,
          });
          const show = gsap.quickTo(header, "yPercent", {
            duration: 0.45,
            ease: "power3.out",
          });
          ScrollTrigger.create({
            start: 0,
            end: "max",
            onUpdate: (self) => {
              if (self.scroll() < 120 || self.direction < 0) show(0);
              else show(-100);
            },
          });
        }

        // ---- Opening screen -------------------------------------------------
        const splitLines = (el: HTMLElement, trigger: boolean, delay = 0) =>
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            linesClass: "split-line",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 115,
                rotate: 2,
                transformOrigin: "0% 100%",
                duration: 1.25,
                stagger: 0.09,
                ease: EASE,
                delay,
                ...(trigger
                  ? {
                      scrollTrigger: {
                        trigger: el,
                        start: "top 88%",
                        once: true,
                      },
                    }
                  : {}),
              }),
          });

        if (title) {
          splitLines(title, false, 0.15);
          const around = Array.from(title.parentElement?.children ?? []).filter(
            (el) => el !== title,
          );
          const before = around.filter(
            (el) =>
              el.compareDocumentPosition(title) &
              Node.DOCUMENT_POSITION_FOLLOWING,
          );
          const after = around.filter((el) => !before.includes(el));
          gsap.from(before, {
            y: 14,
            opacity: 0,
            duration: 0.9,
            ease: EASE,
            delay: 0.05,
          });
          gsap.from(after, {
            y: 26,
            opacity: 0,
            filter: blur,
            duration: 1.2,
            stagger: 0.1,
            ease: EASE,
            delay: 0.45,
            clearProps: "filter",
          });
        }

        const visual = main.querySelector<HTMLElement>(
          "[data-motion='hero-visual']",
        );
        if (visual) {
          gsap.from(visual, {
            y: 60,
            opacity: 0,
            scale: 0.96,
            duration: 1.6,
            ease: EASE,
            delay: 0.3,
          });
          // A slow idle float, and a little parallax against the scroll.
          gsap.to(visual, {
            y: -8,
            duration: 3.2,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: 1.9,
          });
          gsap.to(visual, {
            yPercent: fine ? -10 : -5,
            ease: "none",
            scrollTrigger: {
              trigger: visual,
              start: "top top+=80",
              end: "bottom top",
              scrub: true,
            },
          });
        }

        // ---- Headings below the fold: masked line reveal -------------------
        main.querySelectorAll<HTMLElement>("h2").forEach((h) => {
          if (
            h.closest("[data-motion-skip]") ||
            title?.parentElement?.contains(h)
          )
            return;
          splitLines(h, true);
        });

        // ---- Images: wipe up from a clip, settle from a light zoom ---------
        const images = Array.from(
          main.querySelectorAll<HTMLElement>("img"),
        ).filter((el) => !isSkipped(el));
        images.forEach((img) => {
          gsap.fromTo(
            img,
            { clipPath: "inset(100% 0% 0% 0% round 14px)", scale: 1.12 },
            {
              clipPath: "inset(0% 0% 0% 0% round 14px)",
              scale: 1,
              duration: 1.6,
              ease: EASE,
              scrollTrigger: { trigger: img, start: "top 90%", once: true },
            },
          );
        });

        // ---- Closing panels: grow into place --------------------------------
        main
          .querySelectorAll<HTMLElement>("[data-motion='cta']")
          .forEach((cta) => {
            gsap.fromTo(
              cta,
              { scale: 0.92, opacity: 0.35, y: 40 },
              {
                scale: 1,
                opacity: 1,
                y: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: cta,
                  start: "top bottom",
                  end: "top 55%",
                  scrub: 0.6,
                },
              },
            );
          });

        // ---- Blocks: batched fade, rise and focus ---------------------------
        const scope = [main, ...document.querySelectorAll("footer")];
        const candidates = scope.flatMap((root) =>
          Array.from(root.querySelectorAll(BLOCKS)).filter(
            (el) =>
              !isSkipped(el) &&
              !el.matches("[data-motion-container]") &&
              !(title && title.parentElement?.contains(el)) &&
              !(visual && visual.contains(el)) &&
              !el.querySelector("img"),
          ),
        );
        const blocks = outermost(candidates);
        gsap.set(blocks, { opacity: 0, y: 32, filter: blur });
        const shown = new Set<Element>();
        const reveal = (batch: Element[]) => {
          batch.forEach((el) => shown.add(el));
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.15,
            ease: EASE,
            stagger: { amount: Math.min(0.6, batch.length * 0.07) },
            overwrite: true,
            clearProps: "filter",
          });
          // Tick marks and list icons draw themselves in.
          batch.forEach((el) => {
            const strokes = el.querySelectorAll("svg[aria-hidden='true'] path");
            if (strokes.length) {
              gsap.from(strokes, {
                drawSVG: "0%",
                duration: 0.9,
                ease: "power2.inOut",
                delay: 0.25,
              });
            }
          });
        };
        ScrollTrigger.batch(blocks, {
          start: "top 92%",
          once: true,
          onEnter: reveal,
        });
        // The last lines of a page can never scroll up to the start line; show
        // whatever is left when the page bottoms out, or at once if the page
        // is too short to scroll.
        const revealRest = () => reveal(blocks.filter((el) => !shown.has(el)));
        if (ScrollTrigger.maxScroll(window) < 4)
          gsap.delayedCall(0.6, revealRest);
        else
          ScrollTrigger.create({
            start: () => ScrollTrigger.maxScroll(window) - 4,
            end: "max",
            once: true,
            onEnter: revealRest,
          });

        // ---- Numbers: count up ----------------------------------------------
        main.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
          const parsed = parseCount(el.textContent ?? "");
          if (!parsed) return;
          const final = el.textContent ?? "";
          el.setAttribute("aria-label", final);
          const counter = { v: 0 };
          const render = () => {
            el.textContent = `${counter.v.toFixed(parsed.decimals)}${parsed.suffix}`;
          };
          render();
          gsap.to(counter, {
            v: parsed.value,
            duration: 2,
            ease: "power3.out",
            onUpdate: render,
            onComplete: () => {
              el.textContent = final;
            },
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });

        // ---- Backdrop drifts slower than the page ---------------------------
        const backdrop = document.querySelector(".page-backdrop");
        if (backdrop) {
          gsap.to(backdrop, {
            y: 180,
            ease: "none",
            scrollTrigger: { start: 0, end: "+=900", scrub: true },
          });
        }

        // ---- Pointer details (mouse and trackpad only) ----------------------
        const cleanups: (() => void)[] = [];
        if (fine) {
          document
            .querySelectorAll<HTMLElement>("[data-magnetic]")
            .forEach((btn) => {
              const x = gsap.quickTo(btn, "x", {
                duration: 0.5,
                ease: "power3.out",
              });
              const y = gsap.quickTo(btn, "y", {
                duration: 0.5,
                ease: "power3.out",
              });
              const move = (e: PointerEvent) => {
                const r = btn.getBoundingClientRect();
                x((e.clientX - (r.left + r.width / 2)) * 0.25);
                y((e.clientY - (r.top + r.height / 2)) * 0.35);
              };
              const leave = () => {
                gsap.to(btn, {
                  x: 0,
                  y: 0,
                  duration: 0.9,
                  ease: "elastic.out(1, 0.4)",
                });
              };
              btn.addEventListener("pointermove", move);
              btn.addEventListener("pointerleave", leave);
              cleanups.push(() => {
                btn.removeEventListener("pointermove", move);
                btn.removeEventListener("pointerleave", leave);
              });
            });

          // Linked cards tilt toward the pointer.
          main.querySelectorAll<HTMLElement>(".lift").forEach((card) => {
            gsap.set(card, { transformPerspective: 900 });
            const rx = gsap.quickTo(card, "rotationX", {
              duration: 0.6,
              ease: "power3.out",
            });
            const ry = gsap.quickTo(card, "rotationY", {
              duration: 0.6,
              ease: "power3.out",
            });
            const move = (e: PointerEvent) => {
              const r = card.getBoundingClientRect();
              ry(((e.clientX - r.left) / r.width - 0.5) * 6);
              rx(-((e.clientY - r.top) / r.height - 0.5) * 6);
            };
            const leave = () => {
              rx(0);
              ry(0);
            };
            card.addEventListener("pointermove", move);
            card.addEventListener("pointerleave", leave);
            cleanups.push(() => {
              card.removeEventListener("pointermove", move);
              card.removeEventListener("pointerleave", leave);
            });
          });
        }

        // ---- FAQ and roadmap answers ease open -------------------------------
        main.querySelectorAll<HTMLDetailsElement>("details").forEach((d) => {
          const onToggle = () => {
            if (!d.open) return;
            const body = Array.from(d.children).filter(
              (c) => c.tagName !== "SUMMARY",
            );
            gsap.fromTo(
              body,
              { opacity: 0, y: -8 },
              { opacity: 1, y: 0, duration: 0.6, ease: EASE, stagger: 0.04 },
            );
          };
          d.addEventListener("toggle", onToggle);
          cleanups.push(() => d.removeEventListener("toggle", onToggle));
        });

        // ---- Leaving the page: fade out, then follow the link ---------------
        const onClick = (e: MouseEvent) => {
          if (
            e.defaultPrevented ||
            e.button !== 0 ||
            e.metaKey ||
            e.ctrlKey ||
            e.shiftKey ||
            e.altKey
          )
            return;
          const a = (e.target as Element).closest("a");
          if (!a || a.target || a.hasAttribute("download")) return;
          const url = new URL(a.href, location.href);
          if (url.origin !== location.origin || url.pathname.startsWith("/api"))
            return;
          if (
            url.pathname === location.pathname &&
            url.search === location.search
          )
            return;
          e.preventDefault();
          gsap.to(main, {
            opacity: 0,
            y: -12,
            duration: 0.35,
            ease: "power2.in",
            onComplete: () => location.assign(url.href),
          });
        };
        // Back/forward can restore this page from cache mid-fade.
        const onShow = (e: PageTransitionEvent) => {
          if (e.persisted) gsap.set(main, { opacity: 1, y: 0 });
        };
        document.addEventListener("click", onClick);
        window.addEventListener("pageshow", onShow);
        cleanups.push(() => {
          document.removeEventListener("click", onClick);
          window.removeEventListener("pageshow", onShow);
        });

        // Starting states are set; show the page.
        release();
        document.fonts?.ready.then(() => ScrollTrigger.refresh());

        return () => cleanups.forEach((fn) => fn());
      },
    );

    return () => {
      mm.revert();
      release();
    };
  });

  return null;
}
