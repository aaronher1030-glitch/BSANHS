import type { CSSProperties, ReactNode } from "react";

const WORDMARK = ["Supreme", "Secondary", "Learner", "Government"] as const;

export function Beams() {
  return (
    <div className="beams" aria-hidden="true">
      <span className="beam beam--a" />
      <span className="beam beam--b" />
      <span className="beam-glow beam-glow--a" />
      <span className="beam-glow beam-glow--b" />
    </div>
  );
}

/* The continuous layer on the home field: two rings, a slow scan line and
 * paper slips that float as if the field had lost its gravity. Decorative
 * only; the CSS stops every piece under reduced motion. */
function HeroAmbient() {
  return (
    <div className="hero-ambient" aria-hidden="true">
      <span className="hero-ambient__halo" />
      <span className="hero-ambient__halo hero-ambient__halo--inner" />
      <span className="hero-ambient__scan" />
      <span className="hero-ambient__figure">
        <img src="/media/aquinaldo-gold.webp" alt="" width="505" height="618" decoding="async" />
      </span>
      {[1, 2, 3, 4].map((n) => (
        <span key={n} className={`hero-ambient__sheet hero-ambient__sheet--${n}`} />
      ))}
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <span key={n} className={`hero-ambient__mote hero-ambient__mote--${n}`} />
      ))}
    </div>
  );
}

export function HomeHero() {
  return (
    <section className="hero hero--home" aria-labelledby="hero-title">
      <Beams />
      <HeroAmbient />
      <div className="hero__lockup">
        <div className="hero__seals">
          <span className="hero__seal">
            <img src="/brand/seal-school.png" alt="" width="84" height="87" />
          </span>
          <span className="hero__seal">
            <img src="/brand/seal-sslg.png" alt="" width="84" height="84" />
          </span>
        </div>
        <span className="hero__rule" aria-hidden="true" />
        <div className="hero__type">
          <p className="hero__school">Benigno S. Aquino National High School</p>
          <h1 id="hero-title" className="hero__wordmark" aria-label="Supreme Secondary Learner Government">
            {WORDMARK.map((word, index) => (
              <span className="hero__line" key={word}>
                <span className="hero__word" style={{ "--i": index } as CSSProperties}>
                  {word}
                  {index === WORDMARK.length - 1 ? (
                    <span className="hero__dot" aria-hidden="true">.</span>
                  ) : null}
                </span>
              </span>
            ))}
          </h1>
          <p className="hero__year">School Year 2026–2027</p>
        </div>
      </div>
      <a className="hero__scroll" href="#latest" aria-label="Skip to the latest news">
        <span className="hero__scroll-label" aria-hidden="true">Scroll</span>
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}

export function PageHero({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <section className="hero hero--page" aria-labelledby="page-title">
      <Beams />
      <div className="hero__page-inner">
        <span className="hero__page-rule" aria-hidden="true" />
        <h1 id="page-title">{title}</h1>
        {lead ? <p className="hero__lead">{lead}</p> : null}
        {children}
      </div>
    </section>
  );
}
