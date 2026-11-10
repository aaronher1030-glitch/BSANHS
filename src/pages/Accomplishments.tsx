import { ActivityCard } from "../components/ActivityCard";
import { Band, CtaBar, SectionTitle } from "../components/Band";
import { DocumentRows } from "../components/DocumentList";
import { PageHero } from "../components/Hero";
import { PageMeta } from "../components/PageMeta";
import { ACCOMPLISHMENT_REPORTS_URL } from "../config";
import { ACTIVITIES } from "../content/activities";
import { ALBUM_COVERS, REPORT_FILES } from "../lib/driveSnapshot";

export default function Accomplishments() {
  return (
    <section className="page page--accomplishments">
      <PageMeta
        title="Accomplishments"
        description="Programmes, events and projects of the SSLG and LGCC, with photo albums and accomplishment reports from the public Drive vault."
        path="/accomplishments"
      />
      <PageHero
        title="Accomplishments"
        lead="The programmes, events and projects of the Supreme Secondary Learner Government and the LGCC, with their records in the public Drive vault."
      />
      <Band variant="navy">
        <SectionTitle
          title="Activity record"
          lead="Every activity opens its own record. Photo albums come from the PIO's public Drive vault; accomplishment reports open in the vault."
        />
        <div className="activity-grid" data-reveal-group>
          {ACTIVITIES.map((activity) => (
            <ActivityCard key={activity.slug} activity={activity} albumCovers={ALBUM_COVERS} />
          ))}
        </div>
      </Band>
      <Band variant="deep">
        <SectionTitle
          title="Accomplishment reports"
          lead="The SSLG's accomplishment reports, read from the public Drive folder."
        />
        <DocumentRows
          files={REPORT_FILES}
          fallbackUrl={ACCOMPLISHMENT_REPORTS_URL}
          emptyTitle="No accomplishment reports yet."
          emptyBody="Published reports appear here after the next update."
        />
        <CtaBar href={ACCOMPLISHMENT_REPORTS_URL} external>
          Read more accomplishment reports
        </CtaBar>
      </Band>
    </section>
  );
}
