import type { ReactNode } from "react";
import { Link, useInRouterContext } from "react-router-dom";

type Variant = "navy" | "mint" | "deep" | "paper";

export function Band({
  variant = "navy",
  className = "",
  id,
  children,
}: {
  variant?: Variant;
  className?: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`band band--${variant} ${className}`.trim()}>
      <div className="band__inner" data-reveal-group>{children}</div>
    </section>
  );
}

export function SectionTitle({
  title,
  lead,
  as: Heading = "h2",
}: {
  title: string;
  lead?: string;
  as?: "h2" | "h3";
}) {
  return (
    <header className="section-title">
      <Heading>{title}</Heading>
      {lead ? <p>{lead}</p> : null}
    </header>
  );
}

export function CtaBar({
  href,
  children,
  external = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  // An internal href is a route change, so it goes through the router: a full
  // document load would drop focus (a new page starts at the skip link) and
  // reload the app. `useInRouterContext` keeps the component renderable
  // outside a router (the design tests) by falling back to a plain anchor.
  const inRouter = useInRouterContext();
  // Decorative: the label alone names the link. The arrow slides on hover so
  // the bar reads as a destination rather than a painted rectangle.
  const arrow = (
    <span className="cta-bar__arrow" aria-hidden="true">
      <svg viewBox="0 0 16 16" width="16" height="16" focusable="false">
        <path d="M2.5 8h10M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
  if (external) {
    return (
      <a className="cta-bar" href={href} target="_blank" rel="noreferrer">
        <span>{children}</span>
        {arrow}
      </a>
    );
  }
  if (inRouter) {
    return (
      <Link className="cta-bar" to={href}>
        <span>{children}</span>
        {arrow}
      </Link>
    );
  }
  return (
    <a className="cta-bar" href={href}>
      <span>{children}</span>
      {arrow}
    </a>
  );
}
