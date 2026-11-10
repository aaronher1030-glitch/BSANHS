import { Band, CtaBar } from "../components/Band";
import { PageHero } from "../components/Hero";
import { PageMeta } from "../components/PageMeta";

/**
 * Shared 404 surface, used for unknown activity slugs now and for the
 * catch-all route later. PageMeta carries no `path`, so unknown URLs stay
 * noindex and no canonical is emitted.
 */
export default function NotFound() {
  return (
    <section className="page page--not-found">
      <PageMeta
        title="Page not found"
        description="That page is not part of the SSLG record."
      />
      <PageHero
        title="Page not found"
        lead="That page is not part of the SSLG record."
      />
      <Band variant="deep">
        <div className="not-found">
          <p className="not-found__code" aria-hidden="true">404</p>
          <div className="not-found__links">
            <CtaBar href="/">Back to Home</CtaBar>
            <CtaBar href="/accomplishments">Browse accomplishments</CtaBar>
          </div>
        </div>
      </Band>
    </section>
  );
}
