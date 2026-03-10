import { Bookmark } from "lucide-react";

export default function WatchlistPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh gap-4 text-center px-6">
      <Bookmark size={48} className="text-accent opacity-50" />
      <h1 className="text-3xl font-light text-text-primary">Watchlist</h1>
      <p className="text-text-secondary max-w-sm">
        I film e le serie che vuoi vedere.
      </p>
      <p className="text-text-secondary text-2xl max-w-sm">
        Sezione in arrivo.
      </p>
    </div>
  );
}
