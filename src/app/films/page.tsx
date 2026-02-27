import { Film } from "lucide-react";

export default function FilmsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh gap-4 text-center px-6">
      <Film size={48} className="text-accent opacity-50" />
      <h1 className="text-3xl font-light text-text-primary">Film</h1>
      <p className="text-text-secondary max-w-sm">
        Esplora il catalogo completo dei film. Sezione in arrivo.
      </p>
    </div>
  );
}
