import { useEffect, useId, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { FACEBOOK_URL } from "../config";

const NAV = [
  ["/", "Home"],
  ["/finance", "Finance"],
  ["/accomplishments", "Accomplishments"],
  ["/transparency", "Transparency"],
  ["/about-us", "About us"],
  ["/feedback", "Feedback"],
] as const;

export function SiteLayout() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstRender = useRef(true);
  const { pathname, hash } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const first = firstRender.current;
    firstRender.current = false;
    const target = hash ? document.getElementById(hash.slice(1)) : null;
    if (target) {
      // Only move focus on a real navigation, never on first paint (the skip
      // link must stay the first stop). A hash target is made programmatically
      // focusable so the jump announces where it landed.
      if (!first) {
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
      const reduce = typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
      return;
    }
    if (first) return;
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [pathname, hash]);

  useEffect(() => {
    // Reveal-on-scroll. The CSS only hides a group's children while
    // html.reveal-armed is present (set by main.tsx before first paint), so
    // reduced motion, a missing observer, or a missing script still shows
    // everything. This effect runs before the masthead observer below, which
    // keeps the sentinel the last observer registered.
    const root = document.documentElement;
    if (!root.classList.contains("reveal-armed")) return;
    if (typeof IntersectionObserver === "undefined") {
      root.classList.remove("reveal-armed");
      return;
    }
    const groups = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal-group]"));
    if (groups.length === 0) return;

    const reveal = (target: Element) => target.classList.add("is-revealed");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 },
    );

    // Async panels (documents, albums, error states) replace their band
    // child after mount, so each group is watched for inserted children;
    // otherwise the replacement node would never be observed and would
    // stay at the hidden reveal state.
    const watch = (group: Element) => {
      const children = Array.from(group.children) as HTMLElement[];
      children.forEach((child) => {
        if (child.classList.contains("album-panel-host")) return;
        const order = children.indexOf(child);
        child.style.setProperty("--reveal-delay", `${Math.min(order, 4) * 70}ms`);
        observer.observe(child);
      });
    };
    groups.forEach(watch);

    const mutations = new MutationObserver((records) => {
      const touched = new Set<Element>();
      for (const record of records) {
        for (const node of Array.from(record.addedNodes)) {
          const parent = node.parentElement;
          if (parent?.hasAttribute("data-reveal-group")) touched.add(parent);
        }
      }
      touched.forEach(watch);
    });
    groups.forEach((group) => mutations.observe(group, { childList: true }));

    // Fail-open: a blocked observer must never leave the page invisible.
    // Anything at or above the fold is released even if no entry arrives.
    const guard = window.setTimeout(() => {
      for (const group of groups) {
        for (const child of Array.from(group.children)) {
          if (!(child instanceof HTMLElement)) continue;
          if (child.classList.contains("album-panel-host")) continue;
          if (child.getBoundingClientRect().top < window.innerHeight) reveal(child);
        }
      }
    }, 900);

    return () => {
      window.clearTimeout(guard);
      mutations.disconnect();
      observer.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    // Without IntersectionObserver the masthead would never leave its
    // transparent state; fall back to the scrolled styling rather than a
    // transparent bar over page content.
    if (typeof IntersectionObserver === "undefined") {
      setScrolled(true);
      return;
    }
    const sentinel = document.getElementById("top-sentinel");
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), { threshold: 0 });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="site">
      <a className="skip-link" href="#main">Skip to content</a>
      <div id="top-sentinel" aria-hidden="true" />
      <header className="masthead" data-scrolled={scrolled}>
        <div className="masthead__inner">
          <NavLink to="/" className="brand" aria-label="BSANHS SSLG, home">
            <img src="/brand/seal-sslg.png" alt="" width="40" height="40" />
            <span className="brand__name">BSANHS</span>
          </NavLink>
          {/* The toggle precedes the nav so forward Tab from the trigger enters
              the opened panel. It is display:none above the breakpoint. */}
          <button
            ref={buttonRef}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true">{open ? "×" : "☰"}</span>
          </button>
          <nav className="site-nav" aria-label="Primary" data-open={open} id={menuId}>
            {NAV.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === "/"}>{label}</NavLink>
            ))}
          </nav>
        </div>
        <span className="scroll-progress" aria-hidden="true" />
      </header>
      <main id="main" className="site-main" tabIndex={-1}><Outlet /></main>
      <footer className="site-footer">
        <span className="site-footer__watermark" aria-hidden="true">SSLG</span>
        <div className="site-footer__inner">
          <p className="site-footer__name">
            <img src="/brand/seal-sslg.png" alt="" width="48" height="48" />
            <span>Benigno S. Aquino National High School Supreme Secondary Learner Government</span>
          </p>
          <a className="cta-bar site-footer__fb" href={FACEBOOK_URL} target="_blank" rel="noreferrer">
            <span>facebook.com/SSLGBSANHS</span>
          </a>
          <p className="site-footer__note">S.Y. 2026–2027 · Official website</p>
        </div>
      </footer>
    </div>
  );
}
