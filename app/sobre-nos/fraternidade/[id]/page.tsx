// app/sobre-nos/fraternidade/[id]/page.tsx
import { client } from '@/sanity/lib/client';
import Link from 'next/link';
import { NavVoltarInicio } from '../../_components/NavVoltarInicio';

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
    corCabecalho,
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
      <div className="min-h-screen bg-[#F7F5EB] flex flex-col items-center justify-center p-6 text-center select-none">
        <h1
          style={{ fontFamily: 'var(--font-asah)' }}
          className="text-3xl text-[#8B1E31] mb-4 uppercase"
        >
          Frade não encontrado.
        </h1>
        <p className="text-gray-600 mb-8 max-w-md">
          Não conseguimos carregar os dados deste frade. Verifique se ele está publicado corretamente no painel do Sanity.
        </p>
        <Link
          href="/sobre-nos/fraternidade"
          style={{ fontFamily: 'var(--font-bold)' }}
          className="bg-[#8B1E31] text-white px-8 py-3 rounded-full uppercase tracking-wider shadow-lg"
        >
          Voltar para Fraternidade
        </Link>
      </div>
    );
  }

  // O design alterna a cor do cabeçalho entre os frades. A escolha vem do
  // Sanity ("Cor do cabeçalho"); quem não tiver nada preenchido cai no dourado.
  const dourado = frade.corCabecalho !== 'vinho';
  const raio = dourado
    ? '/fraternidade/forma%20radial%20inteiro.png'
    : '/fraternidade/forma%20radial%20inteiro%20marrom.png';

  return (
    <div className="min-h-screen bg-[#F7F5EB] relative select-none overflow-hidden flex flex-col items-center">

      {/* =========================================
          CABEÇALHO — degradê vinho com "sunburst" decorativo (asset real,
          public/fraternidade) e a foto do frade
      ========================================= */}
      <div
        className="relative w-full h-[38vh] flex-shrink-0 overflow-hidden flex justify-center"
        style={{
          borderRadius: '0 0 clamp(1.6rem, 6vw, 4.2rem) clamp(1.6rem, 6vw, 4.2rem)',
          background: dourado ? '#C49334' : '#8B1E31',
        }}
      >
        {/* Raios decorativos saindo pelas bordas (assets reais). No fundo
            dourado usam a versão creme; no vinho, a versão escura. */}
        <img
          src={raio}
          alt=""
          className="absolute pointer-events-none"
          style={{ left: '-13vh', top: '-4vh', width: '34vh', height: '34vh', objectFit: 'contain' }}
        />
        <img
          src={raio}
          alt=""
          className="absolute pointer-events-none"
          style={{ right: '-13vh', top: '6vh', width: '34vh', height: '34vh', objectFit: 'contain', transform: 'scaleX(-1)' }}
        />

        {/* Foto do frade, centralizada, mais estreita que a tela toda */}
        <div className="relative w-[67%] h-full overflow-hidden">
          {frade.fotoUrl ? (
            <img src={frade.fotoUrl} alt={frade.nome} className="w-full h-full object-cover object-top" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/60 text-sm">Sem foto</div>
          )}
        </div>
      </div>

      {/* Marca d'água em forma de Tau (símbolo franciscano), asset real, atrás do texto */}
      <img
        src="/fraternidade/tau.png"
        alt=""
        className="absolute pointer-events-none opacity-50"
        style={{ top: '42vh', left: '50%', transform: 'translateX(-50%)', width: '40vw', zIndex: 0 }}
      />

      {/* =========================================
          CONTEÚDO DO PERFIL (DADOS DO SANITY)
      ========================================= */}
      <h1
        style={{ fontFamily: 'var(--font-asah)', fontSize: 'clamp(1.9rem, 7.4vw, 5.3rem)' }}
        className="relative z-[1] mt-[3.3vh] text-center uppercase text-[#8B1E31] leading-[1.08] max-w-[64%]"
      >
        {frade.nome}
      </h1>

      <img src="/fraternidade/retangulo%20separa%C3%A7%C3%A3o.png" alt="" className="relative z-[1] mt-[3.3vh] w-[14%] h-auto" />

      {frade.dataNascimento && (
        <p
          style={{ fontFamily: 'var(--font-bold)', fontSize: 'clamp(1rem, 4.3vw, 3.1rem)' }}
          className="relative z-[1] mt-[3.6vh] text-[#491F14] tracking-wide"
        >
          {formatarData(frade.dataNascimento)}
        </p>
      )}

      {frade.origem && (
        <p
          style={{ fontFamily: 'var(--font-bold)', fontSize: 'clamp(0.85rem, 3.5vw, 2.5rem)' }}
          className="relative z-[1] mt-[1vh] text-[#7A5B4B]"
        >
          {frade.origem}
        </p>
      )}

      {frade.descricao && (
        <p
          style={{ fontFamily: 'var(--font-regular)', fontSize: 'clamp(0.78rem, 3.25vw, 2.34rem)' }}
          className="relative z-[1] mt-[3.4vh] text-[#491F14] leading-[1.42] text-center px-[9%] whitespace-pre-line"
        >
          {frade.descricao}
        </p>
      )}

      {/* =========================================
          BOTÕES DE NAVEGAÇÃO INFERIOR
      ========================================= */}
      <NavVoltarInicio hrefVoltar="/sobre-nos/fraternidade" className="relative z-[1] w-full mt-[4vh] mb-[4vh]" />

    </div>
  );
}
