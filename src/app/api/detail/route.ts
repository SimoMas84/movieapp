/* ============================================================
   DETAIL API ROUTE
   Returns runtime, seasons and episodes for a movie or series.
   With full=true returns all fields needed to build a Movie object.
   Called client-side when opening the movie modal.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { getMovieDetail, getSeriesDetail } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id   = Number(searchParams.get("id"));
  const type = searchParams.get("type");
  const full = searchParams.get("full") === "true";

  if (!id || (type !== "movie" && type !== "tv")) {
    return NextResponse.json({ error: "Missing or invalid params" }, { status: 400 });
  }

  try {
    const detail = type === "tv"
      ? await getSeriesDetail(id)
      : await getMovieDetail(id);

    /* ── Full response for realtime card building ── */
    if (full) {
      return NextResponse.json({
        title:            detail.title ?? detail.name ?? "",
        poster_path:      detail.poster_path ?? null,
        backdrop_path:    detail.backdrop_path ?? null,
        release_date:     detail.release_date ?? detail.first_air_date ?? "",
        vote_average:     detail.vote_average ?? 0,
        overview:         detail.overview ?? "",
        genres:           detail.genres ?? [],
        runtime:          detail.runtime ?? null,
        number_of_seasons:  detail.number_of_seasons ?? null,
        number_of_episodes: detail.number_of_episodes ?? null,
      });
    }

    /* ── Minimal response for modal ── */
    return NextResponse.json({
      runtime:          detail.runtime ?? null,
      numberOfSeasons:  detail.number_of_seasons ?? null,
      numberOfEpisodes: detail.number_of_episodes ?? null,
    });
  } catch {
    return NextResponse.json({
      runtime: null,
      numberOfSeasons: null,
      numberOfEpisodes: null,
    });
  }
}