import { NextRequest, NextResponse } from "next/server";
import { searchMulti, searchPeople, getGenres } from "@/lib/tmdb";
import { toMovie } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [], people: [] });
  }

  try {
    const [results, genres, people] = await Promise.all([
      searchMulti(query),
      getGenres(),
      searchPeople(query),
    ]);
    const movies = results.map((m) => toMovie(m, genres));
    return NextResponse.json({ results: movies, people });
  } catch {
    return NextResponse.json({ results: [], people: [] });
  }
}