import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Band, CtaBar, SectionTitle } from "../components/Band";
import { DocumentList } from "../components/DocumentList";
import { DocumentPlate } from "../components/DocumentPlate";
import { PageHero } from "../components/Hero";
import { PageMeta } from "../components/PageMeta";
import { RECORDS_ROOT_URL } from "../config";
import { DOCUMENT_GROUPS } from "../content/documents";
import { GPOA, LEGAL_BASES } from "../content/site";
import { GPOA_FILE, GPOA_PREVIEW, previewFor } from "../lib/driveSnapshot";

const PANEL_ID = "doc-tabpanel";
const tabId = (key: string) => `doc-tab-${key}`;

/**
 * The public records, browsed in place. The six folder cards form an APG
 * tabs pattern: roving tabindex, Arrow/Home/End move selection AND focus,
 * and one panel below renders the selected folder's documents. The card's
 * aria-label keeps its accessible name exact; the "Viewing" badge is a
 * visual, non-colour cue only (aria-hidden — aria-selected carries state).
 */
export default function Transparency() {
  // Default tab: minutes, the first group.
  const [selected, setSelected] = useState(0);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const group = DOCUMENT_GROUPS[selected];

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const count = DOCUMENT_GROUPS.length;
    let next: number | null = null;
    if (event.key === "ArrowRight") next = (index + 1) % count;
    else if (event.key === "ArrowLeft") next = (index - 1 + count) % count;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = count - 1;
    if (next === null) return;
    event.preventDefault();
    setSelected(next);
    tabsRef.current[next]?.focus();
  };

  return (
    <section className="page page--transparency">
      <PageMeta
        title="Transparency"
        description="The SSLG's public records: the General Plan of Action, minutes, notices, elections, project proposals, memorandums and financial reports, read straight from the Drive vault."
        path="/transparency"
      />
      <PageHero
        title="Transparency"
        lead="Every plan, meeting record and issuance the SSLG publishes, open to the whole school community."
      />

      <Band variant="navy">
        <div className="gpoa-feature">
          <DocumentPlate
            label={GPOA.title}
            readHere
            preview={GPOA_PREVIEW}
            className="gpoa-feature__plate"
          />
          <div className="gpoa-feature__body">
            <h2>{GPOA.title}</h2>
            <p>{GPOA.body}</p>
            <CtaBar href={GPOA_FILE?.view ?? GPOA.folderUrl} external>Open the plan</CtaBar>
          </div>
        </div>
      </Band>

      <Band variant="deep">
        <SectionTitle
          title="Browse the records"
          lead="Six folders from the public Drive vault. Pick a card to read its documents here — arrow keys move between folders, Home and End jump to the first and last."
        />
        <div role="tablist" aria-label="Document folders" className="doc-tabs" data-reveal-group>
          {DOCUMENT_GROUPS.map((item, index) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              id={tabId(item.key)}
              className="doc-tab"
              aria-label={item.label}
              aria-selected={index === selected}
              aria-controls={PANEL_ID}
              tabIndex={index === selected ? 0 : -1}
              ref={(node) => { tabsRef.current[index] = node; }}
              onClick={() => setSelected(index)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
            >
              <DocumentPlate
                label={item.label}
                preview={previewFor(item.key)}
                order={index}
              />
              <span className="doc-tab__label">{item.label}</span>
              <span className="doc-tab__viewing" aria-hidden="true">Viewing</span>
            </button>
          ))}
        </div>
        <div
          role="tabpanel"
          id={PANEL_ID}
          className="doc-panel"
          aria-labelledby={tabId(group.key)}
        >
          <h2>{group.label}</h2>
          <p className="doc-panel__blurb">{group.blurb}</p>
          <DocumentList key={group.key} folder={group.key} fallbackUrl={group.folderUrl} />
        </div>
      </Band>

      <Band variant="mint">
        <div className="legal-bases">
          <h2>{LEGAL_BASES.heading}</h2>
          <p className="legal-bases__issuance">{LEGAL_BASES.issuance}</p>
          <a className="legal-bases__link" href={LEGAL_BASES.url} target="_blank" rel="noreferrer">
            {LEGAL_BASES.title}
          </a>
        </div>
      </Band>

      <Band variant="deep">
        <CtaBar href={RECORDS_ROOT_URL} external>Read more documents here</CtaBar>
      </Band>
    </section>
  );
}
