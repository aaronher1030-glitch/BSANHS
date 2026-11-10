import { Band, SectionTitle } from "../components/Band";
import { PageHero } from "../components/Hero";
import { PageMeta } from "../components/PageMeta";
import { OFFICERS } from "../content/officers";
import { ABOUT_INTRO, DUTIES, MANDATE, OBJECTIVES } from "../content/site";
import type { Officer } from "../content/types";

/**
 * The published roster, in listed order. Each band filters OFFICERS on its
 * group without sorting, so the President leads the page and the last
 * Co-Adviser closes it, exactly as the content layer commits them.
 */
const ROSTER_BANDS = [
  { index: "01", title: "Executive Officers", group: "executive", variant: "navy", grid: "officer-grid--executive" },
  { index: "02", title: "Grade-Level Representatives", group: "grade", variant: "deep", grid: "officer-grid--grade" },
  { index: "03", title: "School Leadership", group: "school", variant: "navy", grid: "officer-grid--school" },
] as const;

function OfficerCard({ officer }: { officer: Officer }) {
  return (
    <figure className="officer">
      <span className="officer__frame">
        <img src={officer.photo} alt={`Portrait of ${officer.name}`} width="720" height="720" loading="lazy" decoding="async" />
      </span>
      <figcaption>
        <span className="officer__name">{officer.name}</span>
        <span className="officer__role">{officer.role}</span>
      </figcaption>
    </figure>
  );
}

export default function About() {
  return (
    <section className="page page--about">
      <PageMeta
        title="About us"
        description={ABOUT_INTRO}
        path="/about-us"
      />
      <PageHero title="About us" lead={ABOUT_INTRO} />

      {ROSTER_BANDS.map((band) => (
        <Band key={band.group} variant={band.variant} className="band--roster">
          <span className="roster-index" aria-hidden="true">{band.index}</span>
          <SectionTitle title={band.title} />
          <div className={`officer-grid ${band.grid}`} data-reveal-group>
            {OFFICERS.filter((officer) => officer.group === band.group).map((officer) => (
              <OfficerCard key={officer.photo} officer={officer} />
            ))}
          </div>
        </Band>
      ))}

      <Band variant="mint" id="mandate">
        <div className="mandate">
          <h2>Duties, Responsibilities, and Obligations of the Supreme Secondary Learner Government</h2>
          <div className="mandate__lists" data-reveal-group>
            <section className="mandate__list" aria-labelledby="mandate-objectives">
              <h3 id="mandate-objectives">Objectives of the SSLG</h3>
              <ol>
                {OBJECTIVES.map((objective) => (
                  <li key={objective}>{objective}</li>
                ))}
              </ol>
            </section>
            <section className="mandate__list" aria-labelledby="mandate-duties">
              <h3 id="mandate-duties">Duties and Obligations of the SSLG</h3>
              <ul>
                {DUTIES.map((duty) => (
                  <li key={duty}>{duty}</li>
                ))}
              </ul>
            </section>
          </div>
          <aside className="mandate__quote">
            <p>{MANDATE}</p>
          </aside>
        </div>
      </Band>
    </section>
  );
}
