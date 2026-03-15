/* ============================================================
   GENRE DISCOVER API ROUTE
   Returns paginated movies or series filtered by genre.
   Called client-side by the GenreExplorer component.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { discoverByGenre } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const genre    = searchParams.get("genre") ?? "";
  const page     = Number(searchParams.get("page") ?? "1");
  const sortBy   = searchParams.get("sort") ?? "vote_average.desc";
  const typeParam = searchParams.get("type");
  const mediaType = typeParam === "tv" ? "tv" : "movie";

  if (!genre) {
    return NextResponse.json({ error: "Missing genre" }, { status: 400 });
  }

  const data = await discoverByGenre(genre, page, sortBy, mediaType);
  return NextResponse.json(data, {
    headers: { "Cache-Control": "no-store" },
  });
}