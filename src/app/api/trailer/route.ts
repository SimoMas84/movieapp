/* ============================================================
   TRAILER API ROUTE
   Returns the best available YouTube trailer key for a
   movie or series. Prefers Italian, falls back to English.
   Called client-side when opening the movie modal.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { getMovieVideos, getSeriesVideos } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id   = Number(searchParams.get("id"));
  const type = searchParams.get("type");

  if (!id || (type !== "movie" && type !== "tv")) {
    return NextResponse.json({ error: "Missing or invalid params" }, { status: 400 });
  }

  try {
    const videos = type === "tv"
      ? await getSeriesVideos(id)
      : await getMovieVideos(id);
    return NextResponse.json({ trailerKey: videos[0]?.key ?? null });
  } catch {
    return NextResponse.json({ trailerKey: null });
  }
}