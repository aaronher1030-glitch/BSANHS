import { useEffect, useId, useRef, useState } from "react";
import type { Photo } from "../../shared/drive";
import { SmartImage } from "./SmartImage";

/** "IMG_0012.JPG" reads as "IMG 0012" to a screen reader. */
export function cleanPhotoName(name: string) {
  return name
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * A thumbnail grid that opens a modal viewer. The viewer is the only dialog
 * on the page: it traps Tab among its three controls, steps with the arrow
 * keys, closes on Escape and hands focus back to the thumbnail that opened it.
 */
export function PhotoGrid({ photos, label }: { photos: Photo[]; label?: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const step = (delta: number) =>
    setIndex((current) =>
      current === null ? current : (current + delta + photos.length) % photos.length,
    );

  const close = () => {
    setIndex(null);
    triggerRef.current?.focus();
  };

  return (
    <>
      <ul className="photo-grid" aria-label={label}>
        {photos.map((photo, position) => (
          <li key={photo.id}>
            <button
              type="button"
              className="photo-grid__button"
              aria-haspopup="dialog"
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setIndex(position);
              }}
            >
              <SmartImage
                src={photo.thumb}
                alt=""
                ratio="1 / 1"
                sizes="(min-width: 896px) 220px, (min-width: 560px) 30vw, 45vw"
              />
              <span className="sr-only">{cleanPhotoName(photo.name)}</span>
            </button>
          </li>
        ))}
      </ul>
      {index !== null && photos[index] ? (
        <Lightbox
          photos={photos}
          index={index}
          onStep={step}
          onClose={close}
        />
      ) : null}
    </>
  );
}

function Lightbox({
  photos,
  index,
  onStep,
  onClose,
}: {
  photos: Photo[];
  index: number;
  onStep: (delta: number) => void;
  onClose: () => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const photo = photos[index];
  const name = cleanPhotoName(photo.name);
  const many = photos.length > 1;

  // Opening moves focus into the dialog exactly once; stepping does not.
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // The page behind the overlay must not scroll under it.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Capture phase + stopPropagation: the lightbox sits inside the album
  // panel, whose own Escape handler must not also fire and collapse both
  // layers. Handling the key here keeps it from reaching the panel at all.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        event.stopPropagation();
        onStep(1);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        event.stopPropagation();
        onStep(-1);
        return;
      }
      if (event.key !== "Tab") return;
      const controls = [closeRef.current, prevRef.current, nextRef.current].filter(
        (node): node is HTMLButtonElement => Boolean(node) && !node?.disabled,
      );
      if (controls.length === 0) return;
      const active = document.activeElement as HTMLButtonElement | null;
      const at = active ? controls.indexOf(active) : -1;
      const next = (at + (event.shiftKey ? -1 : 1) + controls.length) % controls.length;
      event.preventDefault();
      event.stopPropagation();
      controls[at === -1 ? (event.shiftKey ? controls.length - 1 : 0) : next].focus();
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [onClose, onStep]);

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="lightbox__dialog">
        <div className="lightbox__bar">
          <h2 id={titleId} className="lightbox__name">{name}</h2>
          <button
            ref={closeRef}
            type="button"
            className="lightbox__control"
            aria-label="Close photo viewer"
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
              <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="lightbox__stage">
          <img
            className="lightbox__image"
            src={photo.full}
            alt={name}
            width={photo.width}
            height={photo.height}
            decoding="async"
          />
        </div>
        <div className="lightbox__controls">
          {many ? (
            <button
              ref={prevRef}
              type="button"
              className="lightbox__control"
              aria-label="Previous photo"
              onClick={() => onStep(-1)}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
                <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : null}
          <p className="lightbox__counter" aria-live="polite">
            {index + 1} / {photos.length}
          </p>
          {many ? (
            <button
              ref={nextRef}
              type="button"
              className="lightbox__control"
              aria-label="Next photo"
              onClick={() => onStep(1)}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
                <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
