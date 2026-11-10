/// <reference types="@cloudflare/workers-types" />

import type { FolderKey } from "../../shared/drive";

export type { FolderKey } from "../../shared/drive";

export interface Env {
  GOOGLE_API_KEY: string;
  CACHE: KVNamespace;
}

export const PIO_ROOT = "1QbMxIfTuL9-qJ3T9YgfuYyErHexqxBiQ";

export const FOLDERS = {
  finance: "1NhgG1fkfxch70E3hzb5YhTgCK0PWKcdV",
  minutes: "1qm3Z6OmjxFa41OsjTPrBUJEl57-GSGH5",
  notices: "1SVzssvcj1IkEndY0Mp5Nv8WhDsaQUDl4",
  elections: "1hiqv7sFda_cGWVo7OtgJs5cpPS-buZ4L",
  proposals: "15vGFBRfifPvEUkN5yo1iv87MQPAoaFHE",
  memorandums: "1xszCcvP83aaVus3xLQ4f1RDmjvWqLHUj",
} as const satisfies Record<FolderKey, string>;

export const FOLDER_MIME = "application/vnd.google-apps.folder";
const FIELDS =
  "files(id,name,mimeType,modifiedTime,size,imageMediaMetadata(width,height))";

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  size?: string;
  imageMediaMetadata?: { width?: number; height?: number };
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control":
        status >= 400
          ? "no-store"
          : "public, max-age=60, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}

export async function driveList(
  env: Env,
  folderId: string,
  extra = "",
): Promise<DriveFile[]> {
  const url = new URL("https://www.googleapis.com/drive/v3/files");
  url.searchParams.set("q", `'${folderId}' in parents and trashed = false${extra}`);
  url.searchParams.set("fields", FIELDS);
  url.searchParams.set("pageSize", "1000");
  url.searchParams.set("orderBy", "name_natural");
  url.searchParams.set("key", env.GOOGLE_API_KEY);
  const res = await fetch(url.toString(), {
    cf: { cacheTtl: 300, cacheEverything: true },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Drive ${res.status} for ${folderId}`);
  const body = (await res.json()) as { files?: DriveFile[] };
  return body.files ?? [];
}

export async function cached<T>(
  env: Env,
  key: string,
  ttl: number,
  load: () => Promise<T>,
): Promise<T> {
  const hit = await env.CACHE.get(key, "json");
  if (hit) return hit as T;
  const value = await load();
  await env.CACHE.put(key, JSON.stringify(value), { expirationTtl: ttl });
  return value;
}
