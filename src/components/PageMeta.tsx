import { useEffect } from "react";
import { APP_NAME, SITE_URL } from "../config";

/**
 * Update the document metadata for the active route.
 *
 * The app is a client-rendered SPA, so the tags are written to the document
 * head in an effect. This is deliberate: the previous React 19 metadata
 * hoisting left an empty <title> in the built output, and an effect gives us
 * deterministic updates for title, description, social tags, canonical URL,
 * and the robots directive.
 */
export function PageMeta({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path?: string;
}) {
  useEffect(() => {
    const fullTitle = `${title} · ${APP_NAME}`;
    document.title = fullTitle;

    setMeta('meta[name="description"]', "description", description);
    setMeta('meta[property="og:title"]', "og:title", fullTitle, "property");
    setMeta('meta[property="og:description"]', "og:description", description, "property");
    setMeta('meta[property="og:type"]', "og:type", "website", "property");
    // The share image is static (public/og.png, declared in index.html).
    // Ensure it survives SPA navigations without ever overwriting it.
    ensureMeta(
      'meta[property="og:image"]',
      "og:image",
      `${SITE_URL}/og.png`,
      "property",
    );
    ensureMeta(
      'meta[property="og:image:alt"]',
      "og:image:alt",
      "Supreme Secondary Learner Government wordmark with the BSANHS and SSLG seals",
      "property",
    );

    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (path) {
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = `${SITE_URL}${path}`;
      setMeta('meta[property="og:url"]', "og:url", `${SITE_URL}${path}`, "property");
      setMeta('meta[name="robots"]', "robots", "index,follow");
    } else {
      canonical?.remove();
      document.head
        .querySelector('meta[property="og:url"]')
        ?.remove();
      setMeta('meta[name="robots"]', "robots", "noindex,follow");
    }
  }, [title, description, path]);

  return null;
}

function setMeta(
  selector: string,
  name: string,
  content: string,
  attribute: "name" | "property" = "name",
) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.content = content;
}

/** Create the tag only when it is missing; never touch an existing value. */
function ensureMeta(
  selector: string,
  name: string,
  content: string,
  attribute: "name" | "property" = "name",
) {
  if (document.head.querySelector(selector)) return;
  const element = document.createElement("meta");
  element.setAttribute(attribute, name);
  element.content = content;
  document.head.appendChild(element);
}
