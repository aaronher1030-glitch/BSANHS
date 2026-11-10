import type { PagesFunction } from "@cloudflare/workers-types";
import {
  cached,
  driveList,
  json,
  FOLDER_MIME,
  PIO_ROOT,
  type DriveFile,
  type Env,
} from "./_drive";
import { imageThumb, imageFull } from "../../shared/drive";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const album = new URL(request.url).searchParams.get("album") ?? "";
  if (!/^[A-Za-z0-9_-]{20,}$/.test(album)) return json({ error: "bad-album" }, 400);
  if (!env.GOOGLE_API_KEY) return json({ error: "drive-not-configured" }, 503);

  try {
    const tree = await cached(env, "album-ids:v2", 900, async () => {
      const years = await driveList(env, PIO_ROOT, ` and mimeType = '${FOLDER_MIME}'`);
      const ids: Record<string, string> = Object.create(null) as Record<
        string,
        string
      >;
      for (const year of years) {
        for (const term of await driveList(
          env,
          year.id,
          ` and mimeType = '${FOLDER_MIME}'`,
        )) {
          for (const folder of await driveList(
            env,
            term.id,
            ` and mimeType = '${FOLDER_MIME}'`,
          )) {
            ids[folder.id] = folder.name;
          }
        }
      }
      return ids;
    });

    if (!Object.hasOwn(tree, album)) {
      return json({ error: "unknown-album" }, 404);
    }
    const name = tree[album];

    const photos = await cached(env, `photos:${album}:v2`, 900, async () => {
      const files = await driveList(env, album, ` and mimeType contains 'image/'`);
      return files
        .filter((f) => /image\//.test(f.mimeType))
        .map((f: DriveFile) => ({
          id: f.id,
          name: f.name,
          mime: f.mimeType,
          width: f.imageMediaMetadata?.width,
          height: f.imageMediaMetadata?.height,
          thumb: imageThumb(f.id, f.mimeType, 800),
          full: imageFull(f.id, f.mimeType),
        }));
    });
    return json({
      album: { id: album, name },
      photos,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("photos", error);
    return json({ error: "drive-unavailable" }, 502);
  }
};
