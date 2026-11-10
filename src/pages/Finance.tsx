import { Band, CtaBar, SectionTitle } from "../components/Band";
import { DocumentList } from "../components/DocumentList";
import { DocumentPlate } from "../components/DocumentPlate";
import { PageHero } from "../components/Hero";
import { PageMeta } from "../components/PageMeta";
import { Stat } from "../components/Stat";
import { FINANCE_REPORT, FINANCE_STATS } from "../content/finance";
import { previewFor } from "../lib/driveSnapshot";

/**
 * The published financial record. The report line and byline quote the
 * content layer verbatim — the byline is the name printed on the report
 * itself ("Samantha C. De Venecia"), not the About roster spelling.
 */
export default function Finance() {
  return (
    <section className="page page--finance">
      <PageMeta
        title="Finance"
        description="The SSLG's published financial reports, current funds and proposed PPAs, prepared by the Treasurer and open to every learner."
        path="/finance"
      />
      <PageHero
        title="Finance"
        lead="The government's funds and financial reports, prepared by the Treasurer and published for the whole school to read."
      />

      <Band variant="mint">
        <div className="finance-feature">
          <DocumentPlate
            label="Financial Report"
            readHere
            preview={previewFor("finance")}
            className="finance-feature__plate"
          />
          <div className="finance-feature__body">
            <h2>Latest Financial Reports</h2>
            <p className="finance-feature__report">
              {FINANCE_REPORT.title} ({FINANCE_REPORT.date})
            </p>
            <CtaBar href={FINANCE_REPORT.folderUrl} external>Open the November 8 finance folder</CtaBar>
            <p className="finance-feature__byline">
              Prepared by {FINANCE_REPORT.preparedBy} ({FINANCE_REPORT.preparedRole})
            </p>
          </div>
        </div>
      </Band>

      <Band variant="mint" className="finance-stats-band">
        <div className="finance-stats" data-reveal-group>
          {FINANCE_STATS.map((stat) => (
            <Stat key={stat.key} value={stat.value} label={stat.label} note={stat.note} />
          ))}
        </div>
      </Band>

      <Band variant="deep">
        <SectionTitle
          title="Financial reports"
          lead="Every report the Treasurer publishes, read straight from the public Drive folder."
        />
        <DocumentList folder="finance" fallbackUrl={FINANCE_REPORT.folderUrl} />
      </Band>
    </section>
  );
}
