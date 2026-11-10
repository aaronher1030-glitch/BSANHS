import type { PagesFunction } from "@cloudflare/workers-types";
import {
  cached,
  driveList,
  json,
  FOLDERS,
  FOLDER_MIME,
  type Env,
} from "./_drive";
import { docThumb, isFolderKey } from "../../shared/drive";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const key = new URL(request.url).searchParams.get("folder") ?? "";
  if (!isFolderKey(key)) return json({ error: "unknown-folder" }, 400);
  if (!env.GOOGLE_API_KEY) return json({ error: "drive-not-configured" }, 503);

  try {
    const data = await cached(env, `docs:${key}:v2`, 900, async () => {
      const items = await driveList(env, FOLDERS[key]);
      return {
        folders: items
          .filter((f) => f.mimeType === FOLDER_MIME)
          .map((f) => ({
            id: f.id,
            name: f.name,
            url: `https://drive.google.com/drive/folders/${f.id}`,
          })),
        files: items
          .filter((f) => f.mimeType !== FOLDER_MIME)
          .map((f) => ({
            id: f.id,
            name: f.name,
            mime: f.mimeType,
            modified: f.modifiedTime ?? null,
            thumb: docThumb(f.id),
            view: `https://drive.google.com/file/d/${f.id}/view`,
          })),
      };
    });
    return json({ ...data, fetchedAt: new Date().toISOString() });
  } catch (error) {
    console.error("documents", error);
    return json({ error: "drive-unavailable" }, 502);
  }
};
