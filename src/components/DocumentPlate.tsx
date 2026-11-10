import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { DocPreview } from "../../shared/drive";

/**
 * A pure-CSS document sheet: 4:5 white card, a gold file tab, a 13px caps
 * label and an optional navy "Read here" pill. When a preview is supplied it
 * also shows a real page from that folder's newest public document — the
 * filename and its opening lines, typed in like a document being written,
 * then stamped with the SSLG seal. Everything is decorative: the real label
 * is adjacent text, so the plate is hidden from assistive tech and the
 * typing never announces itself.
 */
export function DocumentPlate({
  label,
  readHere = false,
  className = "",
  preview = null,
  order = 0,
}: {
  label: string;
  readHere?: boolean;
  className?: string;
  /** Opening lines from the snapshot; renders the abstract rules when null. */
  preview?: DocPreview | null;
  /** Position in a grid, used to stagger the typing pass. */
  order?: number;
}) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const [revealed, setRevealed] = useState<number | null>(null);
  const [stamped, setStamped] = useState(false);
  const [run, setRun] = useState(0);

  const lines = preview?.lines ?? [];
  const full = lines.join("\n");
  const total = full.length;
  const motionOK = () =>
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

  // Start hidden (before paint) only where typing will happen, so a visible
  // page never flashes its full text before the first keystroke.
  useLayoutEffect(() => {
    if (total > 0 && motionOK()) setRevealed(0);
  }, [total, preview?.id]);

  useEffect(() => {
    if (total === 0) return;
    if (!motionOK()) {
      setRevealed(null);
      setStamped(true);
      return;
    }

    let interval: number | undefined;
    let delay: number | undefined;
    let started = false;

    const begin = () => {
      if (started) return;
      started = true;
      setStamped(false);
      setRevealed(0);
      let count = 0;
      const step = Math.max(9, Math.round(2300 / total));
      interval = window.setInterval(() => {
        count += 1;
        if (count >= total) {
          window.clearInterval(interval);
          setRevealed(null);
          setStamped(true);
        } else {
          setRevealed(count);
        }
      }, step);
    };

    const element = rootRef.current;
    let observer: IntersectionObserver | undefined;
    if (run > 0 || !element || typeof IntersectionObserver === "undefined") {
      delay = window.setTimeout(begin, run > 0 ? 0 : order * 110);
    } else {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          observer?.disconnect();
          delay = window.setTimeout(begin, order * 110);
        },
        { threshold: 0.35 },
      );
      observer.observe(element);
    }

    return () => {
      if (interval) window.clearInterval(interval);
      if (delay) window.clearTimeout(delay);
      observer?.disconnect();
    };
  }, [preview?.id, run, order, total]);

  const revealedText = revealed === null ? full : full.slice(0, revealed);
  const shown = revealedText.split("\n");
  const typing = revealed !== null && revealed < total;

  return (
    <span
      ref={rootRef}
      className={[
        "doc-plate",
        typing ? "doc-plate--typing" : "",
        stamped ? "doc-plate--stamped" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
      onPointerEnter={() => {
        if (preview) setRun((value) => value + 1);
      }}
    >
      <span className="doc-plate__tab" />

      {preview ? (
        <>
          <span className="doc-plate__meta">
            <span className="doc-plate__dot" />
            <span className="doc-plate__filename">
              {preview.name.replace(/\.[^.]+$/, "")}
            </span>
          </span>
          <span className="doc-plate__seal">SSLG</span>
          <span className="doc-plate__doc">
            {lines.map((line, index) => (
              <span className="doc-plate__line" key={`${index}-${line.slice(0, 8)}`}>
                {shown[index] ?? ""}
                {typing && index === shown.length - 1 ? (
                  <span className="doc-plate__caret" />
                ) : null}
              </span>
            ))}
          </span>
        </>
      ) : (
        <span className="doc-plate__rules">
          <span className="doc-plate__rule" />
          <span className="doc-plate__rule" />
          <span className="doc-plate__rule" />
        </span>
      )}

      {readHere ? <span className="doc-plate__pill">Read here</span> : null}
      <span className="doc-plate__label">{label}</span>
    </span>
  );
}
