import { Band, CtaBar, SectionTitle } from "../components/Band";
import { HomeHero } from "../components/Hero";
import { PageMeta } from "../components/PageMeta";
import { SmartImage } from "../components/SmartImage";
import { ACTIVITIES } from "../content/activities";
import { ABOUT_INTRO, MANDATE, MOTTO } from "../content/site";

/* The three doorways on the closing navy band. The Aguinaldo figure behind
 * them is the same silhouette the school prints on its letterhead; the
 * cards themselves stay typographic so the two never compete. */
const DESTINATIONS = [
  {
    href: "/accomplishments",
    index: "01",
    label: "Accomplishments",
    note: "Events, programs and projects",
    cta: "View the record",
  },
  {
    href: "/transparency",
    index: "02",
    label: "Transparency",
    note: "Governance documents and records",
    cta: "Open the documents",
  },
  {
    href: "/finance",
    index: "03",
    label: "Financial Reports",
    note: "Funds, budget and statements",
    cta: "View the reports",
  },
] as const;

/* The school motto, set as a slow ticker between the news and the roster.
 * The first copy is the readable one; the rest only close the loop. */
function MottoRibbon() {
  return (
    <aside className="motto-ribbon" aria-label="School motto">
      <div className="motto-ribbon__track">
        {[0, 1, 2, 3].map((n) => (
          <span key={n} className="motto-ribbon__item" aria-hidden={n > 0 || undefined}>
            <span className="motto-ribbon__dot" aria-hidden="true" />
            {MOTTO}
          </span>
        ))}
      </div>
    </aside>
  );
}

export default function Home() {
  const featured = ACTIVITIES.find((activity) => activity.featured) ?? ACTIVITIES[0];

  return (
    <section className="page page--home">
      <PageMeta
        title="Home"
        description="Official website of the Supreme Secondary Learner Government of Benigno S. Aquino National High School."
        path="/"
      />
      <HomeHero />
      <Band variant="deep" id="latest">
        <SectionTitle title="Latest" lead="Stay Updated with Current SSLG Affairs Here" />
        <div className="home-latest" data-reveal-group>
          {featured.cover.kind === "image" ? (
            <SmartImage
              className="home-latest__media"
              ratio="16 / 9"
              src={featured.cover.src}
              alt={featured.cover.alt ?? featured.title}
              priority
            />
          ) : null}
          <div>
            <h2>{featured.title}</h2>
            <p>{featured.caption}</p>
            <CtaBar href={`/accomplishments/${featured.slug}`}>Read more</CtaBar>
          </div>
        </div>
      </Band>
      <MottoRibbon />
      <Band variant="mint" className="band--home-about">
        <SectionTitle title="About us" lead="Get to know your student leaders here" />
        <div className="home-about" data-reveal-group>
          <figure className="home-about__figure">
            <span className="home-about__mask">
              <img
                src="/media/officers-induction.webp"
                alt="SSLG officers at the Onto the Next Leaders induction ceremony"
                decoding="async"
              />
            </span>
            <figcaption>
              <span className="home-about__label">From the record</span>
              Onto the Next Leaders Induction Ceremony
            </figcaption>
          </figure>
          <div>
            <h3>The Supreme Secondary Learner Government</h3>
            <p>{ABOUT_INTRO}</p>
            <CtaBar href="/about-us">Read more</CtaBar>
          </div>
          <div>
            <h3>Our Mandate</h3>
            <p>{MANDATE}</p>
            <CtaBar href="/about-us#mandate">Read more</CtaBar>
          </div>
        </div>
      </Band>
      <Band variant="navy" className="band--destinations">
        <div className="destinations">
          <div className="home-destinations" data-reveal-group>
            {DESTINATIONS.map((destination) => (
              <article className="destination" key={destination.href}>
                <span className="destination__index" aria-hidden="true">{destination.index}</span>
                <div className="destination__body">
                  <h3>{destination.label}</h3>
                  <p>{destination.note}</p>
                </div>
                <CtaBar href={destination.href}>{destination.cta}</CtaBar>
              </article>
            ))}
          </div>
        </div>
      </Band>
    </section>
  );
}
