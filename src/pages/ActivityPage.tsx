import { Link, useNavigate, useParams } from "react-router-dom";
import { AlbumViewer } from "../components/AlbumViewer";
import { Band, CtaBar } from "../components/Band";
import { PageHero } from "../components/Hero";
import { PageMeta } from "../components/PageMeta";
import { SmartImage } from "../components/SmartImage";
import { ACTIVITIES } from "../content/activities";
import type { Activity } from "../content/types";
import { albumFor } from "../lib/driveSnapshot";
import NotFound from "./NotFound";

export default function ActivityPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  // Widen to the interface: the content literal's union has no `date` member
  // yet, but the field is part of the contract and renders when documented.
  const activity: Activity | undefined = ACTIVITIES.find((entry) => entry.slug === slug);
  const album = activity?.album ? albumFor(activity.album) : undefined;

  if (!activity) return <NotFound />;

  return (
    <section className="page page--activity">
      <PageMeta
        title={activity.title}
        description={activity.caption}
        path={`/accomplishments/${activity.slug}`}
      />
      <PageHero title={activity.title} lead={activity.caption} />
      <Band variant="mint" className="activity-detail">
        {activity.date ? (
          <p className="activity-detail__date">
            Held on{" "}
            <time dateTime={activity.date}>
              {new Date(activity.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "UTC",
              })}
            </time>
          </p>
        ) : null}
        {/* An activity without an album still shows its own cover art, so a
            poster-led record is not an empty band. Activities with an album
            show the viewer instead (the album is the richer record). */}
        {!activity.album && activity.cover.kind === "image" ? (
          <figure className="activity-detail__cover">
            <SmartImage
              src={activity.cover.src}
              alt={activity.cover.alt ?? activity.title}
              sizes="(min-width: 768px) 720px, 92vw"
              priority
            />
            <figcaption>{activity.cover.alt ?? activity.title}</figcaption>
          </figure>
        ) : null}
        {/* The album viewer follows the top-level album field, not the cover
            kind: an activity can carry a poster cover AND a photo album. The
            album is the detail content, so closing it returns to the index. */}
        {activity.album ? (
          <AlbumViewer
            albumId={activity.album}
            name={activity.title}
            photos={album?.photos ?? []}
            onClose={() => navigate("/accomplishments")}
          />
        ) : null}
        {activity.reportUrl ? (
          <CtaBar href={activity.reportUrl} external>
            Read the accomplishment report
          </CtaBar>
        ) : null}
        <p className="activity-detail__back">
          <Link to="/accomplishments">All accomplishments</Link>
        </p>
      </Band>
    </section>
  );
}
