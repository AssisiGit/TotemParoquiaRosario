// app/confissoes/page.tsx
import { getPaginaConfissoes } from '@/sanity/lib/getPaginaConfissoes';
import { NavVoltarInicio } from '../sobre-nos/_components/NavVoltarInicio';

export const revalidate = 60;

export default async function ConfissoesPage() {
  const pagina = await getPaginaConfissoes();

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F7F5EB] select-none">
      {/* 1) FOTO DE FUNDO (Sanity), atrás do título e horários.
          O arquivo já vem com o esmaecido embutido no próprio alfa: opacidade
          ~0.85 no topo caindo para 0 por volta de 76% da altura dele. Por isso
          ele é desenhado na largura cheia, com a proporção do design (1080x1706
          na tela, qualquer que seja a resolução do arquivo), e SEM degradê por
          cima — o degradê de creme que existia aqui derrubava a foto para ~38%
          e era o motivo de os dois senhores quase não aparecerem.
          ATENÇÃO: as duas fotos desta tela PRECISAM ter transparência (PNG ou
          WebP com alfa). Um JPEG põe preto onde deveria sumir no fundo — ver
          "Confissões: fotos do Gemini" no CONTEXTO-PROJETO.md. */}
      <div className="absolute inset-x-0 top-0 w-full z-0">
        {pagina?.fotoFundoUrl ? (
          <img src={pagina.fotoFundoUrl} alt="" className="block w-full h-auto" />
        ) : (
          <div className="w-full h-[56vh] bg-gray-300" />
        )}
      </div>

      {/* 2) TÍTULO + HORÁRIOS + CTA — medidos 1:1 no mockup de 1080x1920
          (25/09/2026). Só "Terça à Sexta-feira" e a frase final são em
          negrito; horários e "por ordem de chegada" são Regular. As cores
          também saíram do mockup: marrom #573A27 e vinho #951E3B na frase.
          O enfeite à direita do título é a roseta que já vem na própria foto
          de fundo — por isso não há ícone aqui (o SVG que existia ficava por
          cima dela e empurrava o título 10px para a esquerda). */}
      <div className="relative z-10 w-full pt-[5.5vh] flex flex-col items-center text-center">
        <h1
          style={{ fontFamily: 'var(--font-asah)', fontSize: 'clamp(1.75rem, 7.3vw, 5.25rem)' }}
          className="uppercase tracking-wide text-[#8B1E31]"
        >
          Confissões
        </h1>

        <p
          style={{ fontFamily: 'var(--font-bold)', fontSize: 'clamp(1.25rem, 5.5vw, 3.95rem)' }}
          className="mt-[1.2vh] text-[#573A27]"
        >
          Terça à Sexta-feira
        </p>

        <p
          style={{ fontFamily: 'var(--font-medium)', fontSize: 'clamp(1.26rem, 5.53vw, 3.97rem)' }}
          className="mt-[3.46vh] text-[#573A27] leading-[1.23]"
        >
          Manhã - 8h45 às 11h<br />Tarde - 14h30 às 16h30
        </p>

        <p
          style={{ fontFamily: 'var(--font-medium)', fontSize: 'clamp(1.26rem, 5.53vw, 3.97rem)' }}
          className="mt-[3.78vh] text-[#573A27] leading-[1.24]"
        >
          Confissões por ordem<br />de chegada
        </p>

        <p
          style={{ fontFamily: 'var(--font-bold)', fontSize: 'clamp(0.98rem, 4.31vw, 3.1rem)' }}
          className="mt-[3.41vh] text-[#951E3B] leading-[1.15]"
        >
          A paz começa em<br />um coração reconciliado
        </p>
      </div>

      {/* 3) FOTO PRINCIPAL (Sanity) — como no mockup: largura cheia
          (1080x1244 na tela), encostando no rodapé e com os botões
          Voltar/Início por cima. Esse arquivo também já traz o esmaecido do
          topo no alfa, então não leva máscara nem degradê; antes ela era
          cortada em 54vh com `object-top` e o chão/os pés sumiam. */}
      <div className="absolute inset-x-0 bottom-0 w-full z-0">
        {pagina?.fotoPrincipalUrl ? (
          <img src={pagina.fotoPrincipalUrl} alt="" className="block w-full h-auto" />
        ) : (
          <div className="w-full h-[54vh] bg-gray-300 flex items-center justify-center text-gray-500 text-center px-6">
            Cadastre as fotos desta página no Sanity (Confissões)
          </div>
        )}
      </div>

      {/* 4) BOTÕES SOBRE A FOTO — altura do mockup (centro em 1742 de 1920).
          No mockup eles são ~8% maiores e mais para dentro, mas isso é
          geometria do NavVoltarInicio, que é compartilhado pelas 15 telas. */}
      <NavVoltarInicio hrefVoltar="/?ativo=true" className="absolute inset-x-0 bottom-[5.85vh] z-20" />
    </div>
  );
}
