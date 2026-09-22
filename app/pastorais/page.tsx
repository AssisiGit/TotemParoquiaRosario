// app/pastorais/page.tsx
import { getPastorais } from '@/sanity/lib/getPastorais';
import { NavVoltarInicio } from '../sobre-nos/_components/NavVoltarInicio';

export const revalidate = 60;

export default async function PastoraisPage() {
  // Todo o conteúdo desta tela vem do Sanity: cada card é um documento
  // "Pastorais e Movimentos". Não há nada fixo no código além do título.
  const pastorais = await getPastorais();

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F7F5EB] select-none flex flex-col">
      <h1
        style={{ fontFamily: 'var(--font-asah)', fontSize: 'clamp(1.6rem, 6.15vw, 4.45rem)' }}
        className="uppercase text-center text-[#8B1E31] leading-[1.18] pt-[4.6vh] px-[6%]"
      >
        Programações das<br />Pastorais e Movimentos
      </h1>

      {/* Lista de cards. Rola sozinha se a secretaria cadastrar mais pastorais
          do que cabe na tela — o degradê no topo faz o card sumir antes de
          encostar no título. */}
      <div
        className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center gap-[2.5vh] pt-[3.6vh] pb-[1vh]"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, black 3vh)',
          maskImage: 'linear-gradient(to bottom, transparent 0, black 3vh)',
        }}
      >
        {pastorais.length === 0 && (
          <div className="relative w-[75.65%] aspect-[817/283] flex-none">
            <img
              src="/pastorais/retangulo%20amarelo.png"
              alt=""
              className="absolute inset-0 w-full h-full object-fill drop-shadow-md opacity-40"
            />
            <div
              style={{ fontFamily: 'var(--font-bold)', fontSize: 'clamp(0.85rem, 3.2vw, 2.3rem)' }}
              className="absolute inset-0 flex items-center justify-center text-center px-[8%] text-[#6B4A1E] leading-[1.3]"
            >
              Cadastre as pastorais no Sanity
              <br />
              (Pastorais e Movimentos)
            </div>
          </div>
        )}

        {pastorais.map((pastoral) => (
          <div key={pastoral._id} className="relative w-[75.65%] aspect-[817/283] flex-none">
            <img
              src="/pastorais/retangulo%20amarelo.png"
              alt=""
              className="absolute inset-0 w-full h-full object-fill drop-shadow-md"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[6%]">
              <span
                style={{ fontFamily: 'var(--font-bold)', fontSize: 'clamp(0.8rem, 3vw, 2.16rem)' }}
                className="uppercase tracking-[0.03em] text-[#6B4A1E] leading-[1.2]"
              >
                {pastoral.titulo}
              </span>
              <span
                style={{ fontFamily: 'var(--font-bold)', fontSize: 'clamp(1.12rem, 4.55vw, 3.28rem)' }}
                className="mt-[0.22em] text-white leading-[1.24]"
              >
                {`${pastoral.dia} ${pastoral.horario}`}
              </span>
              {pastoral.local && (
                <span
                  style={{ fontFamily: 'var(--font-regular)', fontSize: 'clamp(0.78rem, 2.95vw, 2.12rem)' }}
                  className="mt-[0.18em] text-white/90 leading-[1.25]"
                >
                  {pastoral.local}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <NavVoltarInicio hrefVoltar="/?ativo=true" className="pt-[1vh] pb-[4.2vh]" />
    </div>
  );
}
