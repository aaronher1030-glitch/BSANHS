import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { docThumb } from "../../shared/drive";
import type { Activity } from "../content/types";
import { SmartImage } from "./SmartImage";

/**
 * Presentational card for one activity. The album-cover lookup comes from the
 * committed Drive snapshot; an album with no photographs has no cover, so the
 * card falls back to its initials plate.
 */

const STOP_WORDS = new Set([
  "a", "an", "and", "at", "for", "in", "of", "on", "or", "the", "to", "with",
]);

function initialsOf(title: string): string {
  return (
    title
      .split(/\s+/)
      .filter((word) => /[A-Za-z0-9]/.test(word) && !STOP_WORDS.has(word.toLowerCase()))
      .map((word) => word[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

/** Decorative: the activity title is real text directly below the plate. */
function Plate({ text }: { text: string }) {
  return (
    <span className="album-plate" aria-hidden="true">
      <span className="album-plate__initials">{text}</span>
    </span>
  );
}

const COVER_SIZES = "(min-width: 1000px) 340px, (min-width: 680px) 45vw, 92vw";

export function ActivityCard({
  activity,
  albumCovers,
}: {
  activity: Activity;
  albumCovers: ReadonlyMap<string, string | null>;
}) {
  const plateText =
    activity.slug === "project-tinig" ? "TINIG" : initialsOf(activity.title);

  let cover: ReactNode;
  switch (activity.cover.kind) {
    case "image":
      cover = (
        <SmartImage
          src={activity.cover.src}
          alt={activity.cover.alt ?? activity.title}
          sizes={COVER_SIZES}
        />
      );
      break;
    case "album": {
      const src = albumCovers.get(activity.cover.album);
      cover = src ? (
        <SmartImage src={src} alt="" sizes={COVER_SIZES} />
      ) : (
        <Plate text={plateText} />
      );
      break;
    }
    case "doc":
      cover = <SmartImage src={docThumb(activity.cover.fileId)} alt="" sizes={COVER_SIZES} />;
      break;
    case "none":
      cover = <Plate text={plateText} />;
      break;
  }

  return (
    <article className="activity-card">
      <div className="activity-card__media">{cover}</div>
      <div className="activity-card__body">
        <h3><Link to={`/accomplishments/${activity.slug}`}>{activity.title}</Link></h3>
        <p>{activity.caption}</p>
      </div>
      {activity.reportUrl && (
        <a className="activity-card__report" href={activity.reportUrl} target="_blank" rel="noreferrer">
          Read the report<span className="sr-only"> for {activity.title}</span>
        </a>
      )}
    </article>
  );
}
