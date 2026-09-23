// app/confissoes/page.tsx
import { getPaginaConfissoes } from '@/sanity/lib/getPaginaConfissoes';
import { NavVoltarInicio } from '../sobre-nos/_components/NavVoltarInicio';

export const revalidate = 60;

export default async function ConfissoesPage() {
  const pagina = await getPaginaConfissoes();

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F7F5EB] select-none">
      {/* 1) FOTO DE FUNDO (Sanity), atrás do título e horários.
          O arquivo (1080x1706) já vem com o esmaecido embutido no próprio alfa:
          opacidade ~0.85 no topo caindo para 0 por volta de 76% da altura dele.
          Por isso ele é desenhado em tamanho natural (1:1 com o design, largura
          cheia) e SEM degradê por cima — o degradê de creme que existia aqui
          derrubava a foto para ~38% e era o motivo de os dois senhores quase
          não aparecerem. */}
      <div className="absolute inset-x-0 top-0 w-full z-0">
        {pagina?.fotoFundoUrl ? (
          <img src={pagina.fotoFundoUrl} alt="" className="block w-full h-auto" />
        ) : (
          <div className="w-full h-[56vh] bg-gray-300" />
        )}
      </div>

      {/* 2) TÍTULO + HORÁRIOS + CTA */}
      <div className="relative z-10 w-full pt-[5vh] flex flex-col items-center text-center">
        <div className="flex items-center gap-[0.35em]">
          <h1
            style={{ fontFamily: 'var(--font-asah)', fontSize: 'clamp(1.75rem, 7.3vw, 5.25rem)' }}
            className="uppercase tracking-wide text-[#8B1E31]"
          >
            Confissões
          </h1>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8B1E31"
            strokeWidth="1.4"
            className="mt-[0.3em] opacity-55"
            style={{ width: '0.85em', height: '0.85em' }}
          >
            <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" strokeOpacity="0.55" />
            <circle cx="12" cy="12" r="2" fill="#8B1E31" fillOpacity="0.55" stroke="none" />
          </svg>
        </div>

        <p
          style={{ fontFamily: 'var(--font-bold)', fontSize: 'clamp(1.05rem, 4.6vw, 3.3rem)' }}
          className="mt-[2.6vh] text-[#241C14]"
        >
          Terça à Sexta-feira
        </p>

        <p
          style={{ fontFamily: 'var(--font-bold)', fontSize: 'clamp(1.05rem, 4.6vw, 3.3rem)' }}
          className="mt-[2vh] text-[#241C14] leading-[1.4]"
        >
          Manhã - 8h45 às 11h<br />Tarde - 14h30 às 16h30
        </p>

        <p
          style={{ fontFamily: 'var(--font-bold)', fontSize: 'clamp(1.05rem, 4.6vw, 3.3rem)' }}
          className="mt-[2vh] text-[#241C14] leading-[1.28] px-[6%]"
        >
          Confissões por ordem<br />de chegada
        </p>

        <p
          style={{ fontFamily: 'var(--font-bold)', fontSize: 'clamp(1.1rem, 4.75vw, 3.42rem)' }}
          className="mt-[2vh] text-[#8B1E31] text-center leading-[1.24] px-[7%]"
        >
          A paz começa em<br />um coração reconciliado
        </p>
      </div>

      {/* 3) FOTO PRINCIPAL (Sanity) — como no mockup: tamanho natural
          (1080x1244), largura cheia, encostando no rodapé da tela e com os
          botões Voltar/Início por cima. Esse arquivo também já traz o
          esmaecido do topo no alfa, então não leva máscara nem degradê; antes
          ela era cortada em 54vh com `object-top` e o chão/os pés sumiam. */}
      <div className="absolute inset-x-0 bottom-0 w-full z-0">
        {pagina?.fotoPrincipalUrl ? (
          <img src={pagina.fotoPrincipalUrl} alt="" className="block w-full h-auto" />
        ) : (
          <div className="w-full h-[54vh] bg-gray-300 flex items-center justify-center text-gray-500 text-center px-6">
            Cadastre as fotos desta página no Sanity (Confissões)
          </div>
        )}
      </div>

      {/* 4) BOTÕES SOBRE A FOTO */}
      <NavVoltarInicio hrefVoltar="/?ativo=true" className="absolute inset-x-0 bottom-[4.2vh] z-20" />
    </div>
  );
}
