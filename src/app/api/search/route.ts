import { NextRequest, NextResponse } from "next/server";
import { searchMulti } from "@/lib/tmdb";
import { toMovie } from "@/lib/utils";
import { getGenres } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const [results, genres] = await Promise.all([
      searchMulti(query),
      getGenres(),
    ]);
    const movies = results.map((m) => toMovie(m, genres));
    return NextResponse.json({ results: movies });
  } catch {
    return NextResponse.json({ results: [] });
  }
}