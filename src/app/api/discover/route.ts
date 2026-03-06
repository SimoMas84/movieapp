import { NextRequest, NextResponse } from "next/server";
import { discoverByGenre } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const genre = searchParams.get("genre") ?? "";
  const page = Number(searchParams.get("page") ?? "1");
  const sortBy = searchParams.get("sort") ?? "vote_average.desc";
  const mediaType = (searchParams.get("type") ?? "movie") as "movie" | "tv";

  if (!genre) return NextResponse.json({ error: "Missing genre" }, { status: 400 });

  const data = await discoverByGenre(genre, page, sortBy, mediaType);
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
