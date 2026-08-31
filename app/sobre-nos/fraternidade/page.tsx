// app/sobre-nos/fraternidade/page.tsx
import { client } from '@/sanity/lib/client'; // Ajuste se o caminho do seu client for diferente
import Link from 'next/link';

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
  const frades = await getFrades();

  return (
    <div className="min-h-screen bg-[#FDFBF7] relative select-none overflow-hidden pb-12">
      
      {/* Marca d'água de fundo (Opcional) */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('/fundo-marca-dagua.png')] bg-cover bg-center pointer-events-none"></div>

      {/* =========================================
          CABEÇALHO COM BORDA ARREDONDADA
      ========================================= */}
      <div className="relative w-full h-[35vh] sm:h-[40vh] rounded-b-[3rem] sm:rounded-b-[4rem] overflow-hidden shadow-xl">
        {/* Imagem de Fundo - Troque pelo src da foto oficial dos frades */}
        <img 
          src="https://via.placeholder.com/1200x600" 
          alt="Foto da Fraternidade" 
          className="w-full h-full object-cover"
        />
        {/* Sobreposição escura para o texto branco ler bem */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        
        {/* Título */}
        <div className="absolute bottom-6 w-full text-center">
          <h1 className="text-5xl sm:text-6xl font-serif text-white tracking-widest drop-shadow-lg uppercase">
            FRATERNIDADE
          </h1>
        </div>
      </div>

      {/* =========================================
          BOTÕES DE NAVEGAÇÃO TOPO (Voltar / Início)
      ========================================= */}
      <div className="w-full max-w-2xl mx-auto flex justify-between items-center px-6 mt-8 relative z-10">
        
        {/* Botão Voltar -> Direciona de volta para a tela Sobre Nós */}
        <Link href="/sobre-nos" className="w-14 h-14 bg-[#8B1E31] rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform border-2 border-white/20">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>

      {/* Botão Início - Adicionamos o ?ativo=true para pular a tela de descanso */}
      <Link href="/?ativo=true" className="px-6 py-3 bg-[#8B1E31] rounded-full flex items-center gap-3 text-white font-bold tracking-wide shadow-lg active:scale-95 transition-transform border-2 border-white/20">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M11.47 3.841a.75.75 0 011.06 0l8.99 8.998c.3.3.087.82-.338.82h-2.154v7.091a1.5 1.5 0 01-1.5 1.5h-4.5a1.5 1.5 0 01-1.5-1.5v-4.5h-3v4.5a1.5 1.5 0 01-1.5 1.5h-4.5a1.5 1.5 0 01-1.5-1.5v-7.091H1.547c-.425 0-.638-.52-.339-.82l8.99-8.998z" />
        </svg>
        INÍCIO
      </Link>
      </div>

      {/* =========================================
          LISTA DINÂMICA DE FRADES (Botões Dourados)
      ========================================= */}
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-4 px-6 mt-10 relative z-10">
        
        {/* Se a lista estiver vazia no Sanity */}
        {frades.length === 0 && (
          <p className="text-center text-[#5A3B2B] mt-10 font-bold">
            Nenhum frade cadastrado no momento. Acesse o painel para adicionar.
          </p>
        )}

        {/* Mapeia os dados do Sanity gerando os botões automaticamente */}
        {frades.map((frade: any, index: number) => (
          <Link 
            key={frade._id} 
            href={`/sobre-nos/fraternidade/${frade._id}`} // 👈 Prepara o link para a tela de detalhes de cada frade
            className="group w-full py-5 px-8 rounded-full flex items-center bg-gradient-to-b from-[#D4A545] to-[#B8862A] shadow-[0_6px_15px_rgba(0,0,0,0.15)] border-[3px] border-[#E8C888] active:scale-95 transition-transform"
          >
            {/* O "index + 1" numera os botões na ordem correta (1, 2, 3...) */}
            <span className="text-white text-xl sm:text-2xl font-black drop-shadow-md mr-3">
              {index + 1}.
            </span>
            <span className="text-white text-lg sm:text-xl font-bold tracking-wide drop-shadow-md uppercase">
              {frade.nome}
            </span>
          </Link>
        ))}
      </div>

    </div>
  );
}