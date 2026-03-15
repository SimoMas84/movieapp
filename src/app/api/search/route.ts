/* ============================================================
   SEARCH API ROUTE
   Returns movies, series and people matching the query.
   Called client-side by the SearchBar component.
   Requires at least 2 characters to avoid empty queries.
   ============================================================ */

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
    return NextResponse.json({
      results: results.map((m) => toMovie(m, genres)),
      people,
    });
  } catch {
    return NextResponse.json({ results: [], people: [] });
  }
}