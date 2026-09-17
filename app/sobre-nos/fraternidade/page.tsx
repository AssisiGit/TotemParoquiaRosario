// app/sobre-nos/fraternidade/page.tsx
import { client } from '@/sanity/lib/client';
import { getPaginaFraternidade } from '@/sanity/lib/getPaginaFraternidade';
import { CabecalhoComFundo } from '../_components/CabecalhoComFundo';
import { NavVoltarInicio } from '../_components/NavVoltarInicio';
import { BotaoDourado } from '../_components/BotaoDourado';

export const revalidate = 60; // Atualiza a página a cada 60s se houver mudanças no Sanity

// Função que busca os frades cadastrados no Sanity
async function getFrades() {
  // Puxa o ID e o Nome, ordenando pela 'ordem' que a secretaria escolheu lá no painel
  const query = `*[_type == "frade"] | order(ordem asc) {
    _id,
    nome
  }`;

  try {
    return await client.fetch(query);
  } catch (error) {
    console.error("Erro ao buscar frades:", error);
    return [];
  }
}

export default async function FraternidadePage() {
  const [frades, pagina] = await Promise.all([
    getFrades(),
    getPaginaFraternidade(),
  ]);

  return (
    <div className="min-h-screen bg-[#F7F5EB] relative select-none overflow-hidden">

      {/* Raio decorativo (asset real, public/fraternidade), atrás da lista */}
      <img
        src="/fraternidade/forma%20radial%20inteiro.png"
        alt=""
        className="absolute pointer-events-none opacity-70 z-0"
        style={{ top: '39vh', right: '-20vh', width: '80vh', height: '80vh' }}
      />

      {/* CABEÇALHO COM BORDA ARREDONDADA — foto própria desta página (Sanity) */}
      <CabecalhoComFundo titulo="Fraternidade" imagemFundoUrl={pagina?.imagemUrl} />

      {/* BOTÕES DE NAVEGAÇÃO TOPO (Voltar / Início) */}
      <NavVoltarInicio hrefVoltar="/sobre-nos" className="relative z-10 mt-[6vh]" />

      {/* LISTA DINÂMICA DE FRADES (Botões Dourados) */}
      <div className="w-full flex flex-col gap-[2.3vh] px-[9%] mt-[2.5vh] pb-[4vh] relative z-10">

        {/* Se a lista estiver vazia no Sanity */}
        {frades.length === 0 && (
          <p
            style={{ fontFamily: 'var(--font-bold)' }}
            className="text-center text-[#5A3B2B] mt-10"
          >
            Nenhum frade cadastrado no momento. Acesse o painel para adicionar.
          </p>
        )}

        {/* Mapeia os dados do Sanity gerando os botões automaticamente */}
        {frades.map((frade: { _id: string; nome: string }, index: number) => (
          <BotaoDourado
            key={frade._id}
            href={`/sobre-nos/fraternidade/${frade._id}`}
            numero={`${index + 1}.`}
            titulo={frade.nome}
          />
        ))}
      </div>

    </div>
  );
}
