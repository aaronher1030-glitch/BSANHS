import snapshot from "../content/drive-snapshot.json";
import type {
  DocFile,
  DocPreview,
  DriveSnapshot,
  FolderKey,
  SnapshotAlbum,
  SnapshotYear,
} from "../../shared/drive";

/**
 * A committed, build-time reading of the public Drive folders. Refreshed by
 * `npm run sync:drive` (which `npm run deploy` runs); no runtime API call.
 */
export const DRIVE_SNAPSHOT = snapshot as unknown as DriveSnapshot;

export function documentsFor(folder: FolderKey): DocFile[] {
  return DRIVE_SNAPSHOT.documents[folder] ?? [];
}

/** The actual General Plan of Action document, when the snapshot found one. */
export const GPOA_FILE: DocFile | null = DRIVE_SNAPSHOT.gpoa;

/** Opening lines of a folder's latest document, read at build time. */
export function previewFor(folder: FolderKey): DocPreview | null {
  return DRIVE_SNAPSHOT.previews?.[folder] ?? null;
}

/** Opening lines of the General Plan of Action itself. */
export const GPOA_PREVIEW: DocPreview | null = DRIVE_SNAPSHOT.gpoaPreview ?? null;

/** The accomplishment reports listed by the snapshot. */
export const REPORT_FILES: DocFile[] = DRIVE_SNAPSHOT.reports;

export const ALBUM_YEARS: SnapshotYear[] = DRIVE_SNAPSHOT.years;

const byId = new Map<string, SnapshotAlbum>();
for (const year of ALBUM_YEARS) {
  for (const term of year.terms) {
    for (const album of term.albums) byId.set(album.id, album);
  }
}

export function albumFor(id: string): SnapshotAlbum | undefined {
  return byId.get(id);
}

/** Album id → cover URL (or null when the album has no photographs yet). */
export const ALBUM_COVERS: ReadonlyMap<string, string | null> = new Map(
  [...byId].map(([id, album]) => [id, album.cover]),
);
