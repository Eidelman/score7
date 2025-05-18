import React from "react";

interface TorneioPageProps {
  params: Promise<{ id: number }>;
}

const TorneioPage: React.FC<TorneioPageProps> = async ({ params }) => {
  const { id } = await params;
  return (
    <main className="container max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Torneio: {id}</h1>
      {/* Conteúdo do torneio será adicionado aqui */}
      <section>
        <p>Detalhes do torneio em breve.</p>
      </section>
    </main>
  );
};

export default TorneioPage;
