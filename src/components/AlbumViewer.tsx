import { useEffect, useRef } from "react";
import type { Photo } from "../../shared/drive";
import { EmptyState } from "./EmptyState";
import { PhotoGrid } from "./PhotoGrid";

const folderUrl = (albumId: string) => `https://drive.google.com/drive/folders/${albumId}`;

/**
 * The inline panel that an album card discloses. Not a dialog: it sits in
 * the page flow, keeps the album grid visible and returns focus to the card
 * that opened it when it closes.
 *
 * Photographs come from the committed Drive snapshot, so the panel has no
 * loading or error state: it either has photos to show or says it does not.
 */
export function AlbumViewer({
  albumId,
  name,
  photos,
  onClose,
  focusOnMount = false,
}: {
  albumId: string;
  name: string;
  photos: Photo[];
  onClose: () => void;
  /** True only when the panel opens as a disclosure: focus moves in.
   *  False when it is page content (an activity detail), so the initial load
   *  keeps focus at the top and the skip link stays the first stop. */
  focusOnMount?: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // A disclosure moves keyboard focus into the panel it just opened; page
  // content must not steal focus from the top of the document on load.
  useEffect(() => {
    if (focusOnMount) closeRef.current?.focus({ preventScroll: true });
  }, [focusOnMount]);

  // Escape belongs to the disclosure only: page content (an activity detail)
  // must not treat Escape anywhere on the page as "leave". Listening on the
  // document covers focus that moved between panel controls, while requiring
  // focus inside keeps Escape from closing a stacked mobile menu *and* this
  // panel in one keypress. The nested lightbox handles Escape in the capture
  // phase and stops propagation, so this bubble-phase listener never sees it.
  useEffect(() => {
    if (!focusOnMount) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      const panel = panelRef.current;
      if (!panel || !panel.contains(document.activeElement)) return;
      onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [focusOnMount, onClose]);

  const driveUrl = folderUrl(albumId);

  return (
    <div className="album-panel" role="region" aria-label={`${name} album`} ref={panelRef}>
      <div className="album-panel__bar">
        <p className="album-panel__name">{name}</p>
        <button ref={closeRef} type="button" className="album-panel__close" onClick={onClose}>
          Close
        </button>
      </div>

      {photos.length === 0 ? (
        <EmptyState
          title="This album has no photos yet."
          body="The folder exists in Drive, but the PIO has not added photographs to it."
          action={{ href: driveUrl, label: "Open in Drive", external: true }}
        />
      ) : (
        <PhotoGrid photos={photos} label={`${name} photos`} />
      )}
    </div>
  );
}
