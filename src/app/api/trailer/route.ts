import { NextRequest, NextResponse } from "next/server";
import { getMovieVideos, getSeriesVideos } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = Number(searchParams.get("id"));
  const type = searchParams.get("type") as "movie" | "tv";

  if (!id || !type) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  try {
    const videos = type === "tv"
      ? await getSeriesVideos(id)
      : await getMovieVideos(id);
    const trailer = videos[0]?.key ?? null;
    return NextResponse.json({ trailerKey: trailer });
  } catch {
    return NextResponse.json({ trailerKey: null });
  }
}