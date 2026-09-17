// app/confissoes/page.tsx
import { getPaginaConfissoes } from '@/sanity/lib/getPaginaConfissoes';
import { NavVoltarInicio } from '../sobre-nos/_components/NavVoltarInicio';

export const revalidate = 60;

export default async function ConfissoesPage() {
  const pagina = await getPaginaConfissoes();

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F7F5EB] select-none">
      {/* 1) FOTO DE FUNDO (Sanity) + degradê, atrás do título e horários */}
      <div className="absolute inset-x-0 top-0 w-full h-[56vh] z-0 overflow-hidden">
        {pagina?.fotoFundoUrl ? (
          <img src={pagina.fotoFundoUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-300" />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(247,245,235,.55) 0%, rgba(247,245,235,.93) 45%, #F7F5EB 78%)',
          }}
        />
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

      {/* 3) FOTO PRINCIPAL (Sanity), na parte de baixo */}
      <div className="absolute inset-x-0 bottom-0 w-full h-[46vh] z-0 overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 12%)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%)',
          }}
        >
          {pagina?.fotoPrincipalUrl ? (
            <img src={pagina.fotoPrincipalUrl} alt="" className="w-full h-full object-cover object-top" />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-center px-6">
              Cadastre as fotos desta página no Sanity (Confissões)
            </div>
          )}
        </div>
      </div>

      {/* 4) BOTÕES SOBRE A FOTO */}
      <NavVoltarInicio hrefVoltar="/" className="absolute inset-x-0 bottom-[4.2vh] z-20" />
    </div>
  );
}
