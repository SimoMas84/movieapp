import { Tv } from "lucide-react";

export default function SeriesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh gap-4 text-center px-6">
      <Tv size={48} className="text-accent opacity-50" />
      <h1 className="text-3xl font-light text-text-primary">Serie TV</h1>
      <p className="text-text-secondary max-w-sm">
        Esplora il catalogo completo delle serie TV. Sezione in arrivo.
      </p>
    </div>
  );
}
