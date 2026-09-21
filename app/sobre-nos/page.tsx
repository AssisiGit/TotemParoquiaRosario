// app/sobre-nos/page.tsx
import { getConfigTotem } from '@/sanity/lib/getConfigTotem';
import { CabecalhoComFundo } from './_components/CabecalhoComFundo';
import { NavVoltarInicio } from './_components/NavVoltarInicio';
import { BotaoDourado } from './_components/BotaoDourado';

export const revalidate = 60;

// Array com os botões para facilitar a manutenção
// Observe que o botão 6 já está apontando para a página dinâmica que criamos!
const botoesSobreNos = [
  { id: 1, numero: '1.', titulo: 'PRIMEIRA VEZ AQUI', rota: '/sobre-nos/primeira-vez' },
  { id: 2, numero: '2.', titulo: 'QUEM SOMOS', rota: '/sobre-nos/quem-somos' },
  { id: 3, numero: '3.', titulo: 'HISTÓRIA', rota: '/sobre-nos/historia' },
  { id: 4, numero: '4.', titulo: 'CARISMA', rota: '/sobre-nos/carisma' },
  { id: 5, numero: '5.', titulo: 'SÃO FRANCISCO', rota: '/sobre-nos/sao-francisco' },
  { id: 6, numero: '6.', titulo: 'FRATERNIDADE', rota: '/sobre-nos/fraternidade' },
];

export default async function SobreNosPage() {
  // Mesma fonte de dados do Menu Inicial: a foto do santuário e a marca d'água
  // são cadastradas uma única vez em "Configurações Visuais" no Sanity e
  // reaproveitadas em todas as telas do totem.
  const config = await getConfigTotem();

  return (
    // h-screen + overflow-hidden: a tela do totem nunca rola. O que distribui
    // a sobra de altura é o "justify-evenly" da lista, logo abaixo.
    <div className="h-screen bg-[#F7F5EB] relative select-none overflow-hidden flex flex-col">

      {/* Marca d'água de fundo (mesma imagem usada no Menu Inicial) */}
      {config?.marcaDaguaUrl && (
        <div
          className="absolute inset-0 opacity-[0.090] bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url(${config.marcaDaguaUrl})` }}
        ></div>
      )}

      {/* CABEÇALHO COM BORDA ARREDONDADA (foto do santuário vinda do Sanity) */}
      <CabecalhoComFundo titulo="Sobre Nós" imagemFundoUrl={config?.fotoSantuarioUrl} />

      {/* BOTÕES DE NAVEGAÇÃO TOPO (Voltar / Início) */}
      <NavVoltarInicio hrefVoltar="/?ativo=true" className="relative z-10 mt-[1.8vh]" />

      {/* LISTA DE BOTÕES (Menu Dourado)
          Ocupa toda a altura que sobrou (flex-1) e espalha os 6 botões nela com
          espaçamento igual. Assim o respiro entre eles se ajusta sozinho à tela,
          em vez de ser um valor fixo que pode estourar os 100vh. */}
      <div className="w-full flex-1 min-h-0 flex flex-col justify-evenly px-[9%] pb-[1.5vh] relative z-10">
        {botoesSobreNos.map((botao) => (
          <BotaoDourado key={botao.id} href={botao.rota} numero={botao.numero} titulo={botao.titulo} />
        ))}
      </div>

    </div>
  );
}
