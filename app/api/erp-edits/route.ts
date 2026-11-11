import { NextResponse } from "next/server";
import { getEditedPage, getEditedPaths } from "@/lib/cms/erp-edits";
import { normalizeEditPath } from "@/lib/cms/erp-edits-shared";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (path === null) {
    return NextResponse.json({ paths: await getEditedPaths({ fresh: true }) });
  }

  const normalizedPath = normalizeEditPath(path);
  const page = await getEditedPage(normalizedPath, { fresh: true });
  return NextResponse.json({
    edits: page?.edits ?? [],
    version: page?.version ?? null,
  });
}
