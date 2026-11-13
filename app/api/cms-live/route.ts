// app/api/cms-live/route.ts
// Live-update check for CRM/ERP changes, polled by components/cms/ErpPageEdits.
//
// Reads everything the ERP contributes to a path twice: from the Next.js data
// cache (what pages are rendered from) and fresh from the ERP. If they differ,
// a change was published since the page was cached, so the cache tags are
// expired immediately ({ expire: 0 }); the browser then calls router.refresh()
// and gets the new content on that very request, with no reload and no
// "refresh twice" stale-while-revalidate lag.
//
// Checks are coalesced per path for CHECK_INTERVAL_MS, so any number of open
// tabs costs the ERP at most one set of fresh requests per path per interval,
// and any ERP error (e.g. 429 rate limiting) pauses all checks for 30s.
import { createHash } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { cmsLiveSnapshot } from "@/lib/cms/cms";
import { editsLiveSnapshot } from "@/lib/cms/erp-edits";
import { normalizeEditPath } from "@/lib/cms/erp-edits-shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CHECK_INTERVAL_MS = 4000;
// After an ERP error (down, rate-limited), pause all checks for this long.
const FAILURE_BACKOFF_MS = 30_000;
const CACHE_TAGS = ["cms-public", "erp-edited-paths", "erp-edited-page"];
const isDev = process.env.NODE_ENV !== "production";

type LiveResult = { version: string | null; expired: boolean };

let lastFailureAt = 0;

const recent = new Map<string, { at: number; result: Promise<LiveResult> }>();

const fingerprint = (value: unknown) =>
  createHash("sha1").update(JSON.stringify(value)).digest("base64url").slice(0, 16);

async function snapshot(path: string, fresh: boolean) {
  const [cms, edits] = await Promise.all([
    cmsLiveSnapshot(path, fresh),
    editsLiveSnapshot(path, fresh),
  ]);
  return fingerprint({ cms, edits });
}

async function check(path: string): Promise<LiveResult> {
  if (Date.now() - lastFailureAt < FAILURE_BACKOFF_MS) return { version: null, expired: false };
  try {
    const fresh = await snapshot(path, true);
    // In development every read is already uncached; there is nothing to expire.
    if (isDev) return { version: fresh, expired: false };
    const cached = await snapshot(path, false);
    if (cached === fresh) return { version: fresh, expired: false };
    for (const tag of CACHE_TAGS) revalidateTag(tag, { expire: 0 });
    revalidatePath("/", "layout");
    return { version: fresh, expired: true };
  } catch (error) {
    lastFailureAt = Date.now();
    if (isDev) console.warn("[cms-live] check failed:", error);
    // ERP unreachable or rate-limited: report "unknown", change nothing.
    return { version: null, expired: false };
  }
}

export async function GET(request: Request) {
  const path = normalizeEditPath(new URL(request.url).searchParams.get("path") ?? "/");
  if (path.length > 2048) return NextResponse.json({ version: null }, { status: 400 });

  const now = Date.now();
  let entry = recent.get(path);
  if (!entry || now - entry.at > CHECK_INTERVAL_MS) {
    entry = { at: now, result: check(path) };
    recent.set(path, entry);
    // Keep the map small: drop entries nobody has asked about recently.
    for (const [key, value] of recent) {
      if (now - value.at > CHECK_INTERVAL_MS * 10) recent.delete(key);
    }
  }
  const result = await entry.result;
  return NextResponse.json(result, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
