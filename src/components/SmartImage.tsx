import { useEffect, useRef, useState } from "react";

type Status = "loading" | "ready" | "error";

/**
 * A ratio-locked image with a skeleton while it loads and a ruled plate when
 * it fails, so a Drive thumbnail that never arrives still explains itself
 * instead of leaving an empty box.
 */
export function SmartImage({
  src,
  alt,
  ratio = "4 / 3",
  sizes,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const [status, setStatus] = useState<Status>("loading");
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => setStatus("loading"), [src]);

  // A cached image can finish decoding before React attaches onLoad. A cached
  // failure (complete but zero natural width) must also resolve, or the
  // skeleton would spin forever on a broken thumbnail that never re-fires
  // onError.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) setStatus("ready");
    else if (img?.complete) setStatus("error");
  }, [src]);

  if (status === "error") {
    return (
      <span
        className={`smart-image smart-image--error ${className}`.trim()}
        style={{ aspectRatio: ratio }}
        aria-hidden={alt ? undefined : true}
      >
        {alt ? <span className="smart-image__alt">{alt}</span> : null}
        <span className="smart-image__label">Image unavailable</span>
      </span>
    );
  }

  return (
    <span
      className={`smart-image ${className}`.trim()}
      style={{ aspectRatio: ratio }}
      data-status={status}
    >
      {status === "loading" ? <span className="smart-image__skeleton" aria-hidden="true" /> : null}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setStatus("ready")}
        onError={() => setStatus("error")}
      />
    </span>
  );
}
