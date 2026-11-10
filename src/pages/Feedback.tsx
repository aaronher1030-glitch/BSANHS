import { useEffect, useRef } from "react";
import { Band } from "../components/Band";
import { PageHero } from "../components/Hero";
import { PageMeta } from "../components/PageMeta";
import { FEEDBACK_FORM_URL } from "../config";

/**
 * The official feedback form, embedded in place. The iframe is never wrapped
 * in a link; the fallback line below it opens the same form in a new tab for
 * browsers or networks that refuse the embed.
 */
export default function Feedback() {
  const frameRef = useRef<HTMLIFrameElement>(null);

  // Chrome hides cross-origin iframe focus from parent CSS entirely (:focus,
  // :focus-visible and :focus-within never match, and no focus event fires on
  // the element), so the keyboard ring is driven by window blur/focus: when
  // Tab carries focus into the form this window blurs while the iframe is
  // the active element. The ring shows only after keyboard use so a mouse
  // click into the form does not draw it.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    let keyboard = false;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") keyboard = true;
    };
    const onPointerDown = () => {
      keyboard = false;
    };
    const sync = () => {
      // The blur fires both when Tab enters the form and when the whole tab
      // loses focus; the activeElement guard keeps the ring tied to the form.
      const inside = document.activeElement === frame;
      frame.classList.toggle("feedback-frame--focused", keyboard && inside);
    };
    const onBlur = () => sync();
    const onFocus = () => {
      keyboard = false;
      frame.classList.remove("feedback-frame--focused");
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return (
    <section className="page page--feedback">
      <PageMeta
        title="Feedback"
        description="Share feedback with the SSLG through the official BSANHS SSLG feedback form, with an anonymous option for learners who prefer not to give their name."
        path="/feedback"
      />
      <PageHero title="Feedback" />

      <Band variant="mint">
        <div className="feedback-card">
          <h2>Share feedback with the SSLG</h2>
          <p className="feedback-card__intro">
            Tell the SSLG what is working and what is not. Your responses go
            straight to the official BSANHS SSLG feedback form read by the
            officers, and the form offers an anonymous option — you can raise
            a concern without giving your name.
          </p>
          <iframe
            ref={frameRef}
            className="feedback-frame"
            src={`${FEEDBACK_FORM_URL}?embedded=true`}
            title="BSANHS SSLG feedback form"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <p className="feedback-fallback">
            Form not loading? <a href={FEEDBACK_FORM_URL} target="_blank" rel="noreferrer">Open it in a new tab</a>.
          </p>
        </div>
      </Band>
    </section>
  );
}
