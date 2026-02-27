import { Film } from "lucide-react";

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-col items-center justify-center min-h-svh gap-4 text-center px-6">
      <Film size={48} className="text-accent opacity-50" />
      <h1 className="text-3xl font-light text-text-primary">Scheda Film</h1>
      <p className="text-text-secondary max-w-sm">
        Pagina del film #{id}. Sezione in arrivo.
      </p>
    </div>
  );
}
