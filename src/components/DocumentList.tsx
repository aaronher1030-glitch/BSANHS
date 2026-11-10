import { useState } from "react";
import type { DocFile, FolderKey } from "../../shared/drive";
import { DRIVE_SNAPSHOT, documentsFor } from "../lib/driveSnapshot";
import { DocumentPlate } from "./DocumentPlate";
import { EmptyState } from "./EmptyState";

/** en-PH with day/month/year components renders month-first: "November 8, 2026". */
const modifiedFormat = new Intl.DateTimeFormat("en-PH", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/**
 * The extension is the type tag. Native Drive files carry no extension, so
 * the mime supplies the familiar office tag instead; anything else is FILE.
 */
function typeTag(file: DocFile): string {
  const dot = file.name.lastIndexOf(".");
  if (dot > 0 && dot < file.name.length - 1) {
    return file.name.slice(dot + 1).toUpperCase();
  }
  if (file.mime === "application/pdf") return "PDF";
  if (file.mime === "application/vnd.google-apps.document") return "DOC";
  if (file.mime === "application/vnd.google-apps.spreadsheet") return "XLS";
  if (file.mime === "application/vnd.google-apps.presentation") return "PPT";
  return "FILE";
}

/** Only when the listing documented a modified time — never invent a date. */
function modifiedLabel(modified: string | null): string | null {
  if (!modified) return null;
  const date = new Date(modified);
  return Number.isNaN(date.getTime()) ? null : modifiedFormat.format(date);
}

/** Opens-in-new-tab affordance; decorative, the row text carries the name. */
function RowArrow() {
  return (
    <svg className="doc-row__arrow" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The snapshot already carries a thumbnail URL; use it. A broken thumbnail
 * (Drive refuses previews for some types) falls back to the plate.
 */
function RowThumb({ file }: { file: DocFile }) {
  const [failed, setFailed] = useState(false);
  if (!file.thumb || failed) {
    return <DocumentPlate label={typeTag(file)} className="doc-plate--thumb" />;
  }
  return (
    <img
      className="doc-row__image"
      src={file.thumb}
      alt=""
      width={56}
      height={70}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

function FileRow({ file }: { file: DocFile }) {
  const modified = modifiedLabel(file.modified);
  return (
    <li>
      <a className="doc-row" href={file.view} target="_blank" rel="noreferrer">
        <span className="doc-row__thumb"><RowThumb file={file} /></span>
        <span className="doc-row__body">
          <span className="doc-row__name">{file.name}</span>
          <span className="doc-row__meta">
            <span className="doc-row__tag">{typeTag(file)}</span>
            {modified ? (
              <time className="doc-row__date" dateTime={file.modified ?? undefined}>{modified}</time>
            ) : null}
          </span>
        </span>
        <RowArrow />
      </a>
    </li>
  );
}

/** Manila time, so the stamp matches the school's clock. */
const updatedFormat = new Intl.DateTimeFormat("en-PH", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "Asia/Manila",
});

function SyncedNote() {
  const date = new Date(DRIVE_SNAPSHOT.generatedAt);
  if (Number.isNaN(date.getTime())) return null;
  return (
    <p className="doc-snapshot">
      Pre-v1.0 · Updated {updatedFormat.format(date)}
    </p>
  );
}

/**
 * Rows for any list of Drive files. The files come from the committed
 * snapshot, so the list renders immediately and never depends on a live API.
 * The public folder link stays available because Drive is the source of truth.
 */
export function DocumentRows({
  files,
  fallbackUrl,
  emptyTitle = "No documents in this folder yet.",
  emptyBody = "Published documents appear here after the next update.",
}: {
  files: DocFile[];
  fallbackUrl: string;
  emptyTitle?: string;
  emptyBody?: string;
}) {
  if (files.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        body={emptyBody}
        action={{ href: fallbackUrl, label: "Open the Drive folder", external: true }}
      />
    );
  }

  return (
    <>
      <ul className="doc-list">
        {files.map((file) => <FileRow key={file.id} file={file} />)}
      </ul>
      <SyncedNote />
    </>
  );
}

/** One document group, read from the snapshot by its folder key. */
export function DocumentList({
  folder,
  fallbackUrl,
}: {
  folder: FolderKey;
  fallbackUrl: string;
}) {
  return <DocumentRows files={documentsFor(folder)} fallbackUrl={fallbackUrl} />;
}
