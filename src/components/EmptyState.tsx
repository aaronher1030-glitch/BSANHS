/**
 * The three Drive states that are not a grid: waiting, nothing there, and
 * something went wrong. The link is always offered because the source of
 * truth is the public Drive folder.
 */
export function EmptyState({
  title,
  body,
  action,
  onRetry,
  retryLabel = "Try again",
  role,
}: {
  title: string;
  body?: string;
  action?: { href: string; label: string; external?: boolean };
  onRetry?: () => void;
  retryLabel?: string;
  /** Overrides the default: an error offers Retry (alert), an empty state
   *  does not (status). Pass "alert" for an error with no recovery button. */
  role?: "status" | "alert";
}) {
  return (
    // A live region so the state is announced when it replaces a loading
    // block.
    <div className="empty-state" role={role ?? (onRetry ? "alert" : "status")}>
      <p className="empty-state__title">{title}</p>
      {body ? <p className="empty-state__body">{body}</p> : null}
      {action || onRetry ? (
        <div className="empty-state__actions">
          {onRetry ? (
            <button type="button" className="empty-state__button" onClick={onRetry}>
              {retryLabel}
            </button>
          ) : null}
          {action ? (
            <a
              className="cta-bar empty-state__link"
              href={action.href}
              {...(action.external ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              <span>{action.label}</span>
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/** Eight dots around an empty centre: a status cue, not decoration. */
export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="loading" role="status">
      <span className="loading__dots" aria-hidden="true">
        {Array.from({ length: 9 }, (_, index) => (
          <span key={index} className="loading__dot" />
        ))}
      </span>
      <span className="loading__label">{label}</span>
    </div>
  );
}
