import { NextRequest, NextResponse } from "next/server";
import { getMovieDetail, getSeriesDetail } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = Number(searchParams.get("id"));
  const type = searchParams.get("type") as "movie" | "tv";

  if (!id || !type) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  try {
    const detail = type === "tv"
      ? await getSeriesDetail(id)
      : await getMovieDetail(id);

    return NextResponse.json({
      runtime: detail.runtime ?? null,
      numberOfSeasons: detail.number_of_seasons ?? null,
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