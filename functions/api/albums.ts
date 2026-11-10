import type { PagesFunction } from "@cloudflare/workers-types";
import {
  cached,
  driveList,
  json,
  FOLDER_MIME,
  PIO_ROOT,
  type Env,
  type DriveFile,
} from "./_drive";
import { imageThumb, type Album, type Term, type Year } from "../../shared/drive";

export type { Album, Term, Year } from "../../shared/drive";

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  if (!env.GOOGLE_API_KEY) return json({ error: "drive-not-configured" }, 503);
  try {
    const years = await cached(env, "albums:v2", 900, async () => {
      const yearFolders = await driveList(
        env,
        PIO_ROOT,
        ` and mimeType = '${FOLDER_MIME}'`,
      );
      const out: Year[] = [];
      for (const year of yearFolders) {
        const termFolders = await driveList(
          env,
          year.id,
          ` and mimeType = '${FOLDER_MIME}'`,
        );
        const terms: Term[] = [];
        for (const term of termFolders) {
          const albumFolders = await driveList(
            env,
            term.id,
            ` and mimeType = '${FOLDER_MIME}'`,
          );
          const albums: Album[] = [];
          for (const album of albumFolders) {
            const photos = await driveList(
              env,
              album.id,
              ` and mimeType contains 'image/'`,
            );
            const first = photos.find((p: DriveFile) =>
              /image\/(jpeg|png|heic|heif)/i.test(p.mimeType),
            );
            albums.push({
              id: album.id,
              name: album.name,
              count: photos.length,
              cover: first ? imageThumb(first.id, first.mimeType, 1200) : null,
            });
          }
          terms.push({
            id: term.id,
            name: term.name,
            albums: albums.filter((a) => a.count > 0),
          });
        }
        out.push({
          id: year.id,
          name: year.name,
          terms: terms.filter((t) => t.albums.length > 0),
        });
      }
      return out;
    });
    return json({ years, fetchedAt: new Date().toISOString() });
  } catch (error) {
    console.error("albums", error);
    return json({ error: "drive-unavailable" }, 502);
  }
};
