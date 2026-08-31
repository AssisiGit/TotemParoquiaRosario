// app/sobre-nos/fraternidade/[id]/page.tsx
import { client } from '@/sanity/lib/client';
import Link from 'next/link';

export const revalidate = 60;

// Função ultra flexível que busca o frade ignorando se ele é rascunho ou publicado, e aceita o ID limpo
async function getFradeDetalhes(id: string) {
  // Removemos possíveis conflitos de prefixo caso o ID venha com 'drafts.'
  const cleanId = id.replace('drafts.', '');

  const query = `*[_type == "frade" && (_id == $cleanId || _id == "drafts." + $cleanId)][0] {
    nome,
    dataNascimento,
    origem,
    descricao,
    "fotoUrl": foto.asset->url
  }`;
  
  try {
    return await client.fetch(query, { cleanId });
  } catch (error) {
    console.error("Erro ao buscar detalhes do frade:", error);
    return null;
  }
}

// Função para formatar a data de YYYY-MM-DD para DD.MM.YYYY
function formatarData(dataStr: string) {
  if (!dataStr) return '';
  const [ano, mes, dia] = dataStr.split('-');
  return `${dia}.${mes}.${ano}`;
}

// 👇 IMPORTANTE: No Next.js App Router recente, params precisa ser tratado como Promise
export default async function FradeDetalhesPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const frade = await getFradeDetalhes(resolvedParams.id);

  if (!frade) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-center select-none">
        <h1 className="text-3xl font-serif font-bold text-[#8B1E31] mb-4">Frade não encontrado.</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          Não conseguimos carregar os dados deste frade. Verifique se ele está publicado corretamente no painel do Sanity.
        </p>
        <Link href="/sobre-nos/fraternidade" className="bg-[#8B1E31] text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider shadow-lg">
          Voltar para Fraternidade
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] relative select-none overflow-hidden pb-12 flex flex-col items-center">
      
      {/* =========================================
          CABEÇALHO BORDA ARREDONDADA (FUNDO VINHO)
      ========================================= */}
      <div className="relative w-full h-[40vh] sm:h-[45vh] bg-[#8B1E31] rounded-b-[3.5rem] sm:rounded-b-[4.5rem] overflow-hidden shadow-xl flex justify-center items-end">
        
        <div className="absolute inset-0 opacity-10 bg-[url('/fundo-marca-dagua.png')] bg-cover bg-center"></div>

        {/* Foto do Frade Recortada em Arco */}
        <div className="relative w-48 h-60 sm:w-56 sm:h-72 rounded-t-full overflow-hidden border-4 border-[#C79C45] bg-[#4A3022] shadow-2xl z-10 -mb-1">
          {frade.fotoUrl ? (
            <img src={frade.fotoUrl} alt={frade.nome} className="w-full h-full object-cover object-top" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/50 text-sm">Sem Foto</div>
          )}
        </div>
      </div>

      {/* =========================================
          CONTEÚDO DO PERFIL (DADOS DO SANITY)
      ========================================= */}
      <div className="w-full max-w-2xl px-6 flex flex-col items-center text-center mt-6 relative z-10">
        
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#8B1E31] tracking-wide uppercase mb-2">
          {frade.nome}
        </h1>

        <div className="w-16 h-1.5 bg-[#C79C45] rounded-full my-3"></div>

        <div className="mb-6">
          {frade.dataNascimento && (
            <p className="text-2xl font-black text-[#5A3B2B] tracking-widest mb-1">
              {formatarData(frade.dataNascimento)}
            </p>
          )}
          {frade.origem && (
            <p className="text-lg font-bold text-[#7A5B4B] tracking-wide">
              {frade.origem}
            </p>
          )}
        </div>

        {frade.descricao && (
          <p className="text-[#4A3022] text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-10 px-4 whitespace-pre-line">
            {frade.descricao}
          </p>
        )}
      </div>

      {/* =========================================
          BOTÕES DE NAVEGAÇÃO INFERIOR
      ========================================= */}
      <div className="w-full max-w-2xl mx-auto flex justify-between items-center px-6 mt-auto relative z-10 pt-4">
        
        <Link href="/sobre-nos/fraternidade" className="w-14 h-14 bg-[#8B1E31] rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform border-2 border-white/20">
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

    </div>
  );
}