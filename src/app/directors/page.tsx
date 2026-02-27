import { Video } from "lucide-react";

export default function DirectorsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh gap-4 text-center px-6">
      <Video size={48} className="text-accent opacity-50" />
      <h1 className="text-3xl font-light text-text-primary">Registi</h1>
      <p className="text-text-secondary max-w-sm">
        Scopri i grandi registi del cinema mondiale. Sezione in arrivo.
      </p>
    </div>
  );
}
