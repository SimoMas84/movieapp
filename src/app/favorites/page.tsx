import { Heart } from "lucide-react";

export default function FavoritesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh gap-4 text-center px-6">
      <Heart size={48} className="text-heart opacity-50" />
      <h1 className="text-3xl font-light text-text-primary">Preferiti</h1>
      <p className="text-text-secondary max-w-sm">
        I tuoi film e serie preferiti tutti in un posto.
      </p>
      <p className="text-text-secondary text-2xl max-w-sm">
        Sezione in arrivo.
      </p>
    </div>
  );
}
