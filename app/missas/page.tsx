// app/missas/page.tsx
import { getPaginaMissas, formatarHorarios } from '@/sanity/lib/getPaginaMissas';
import { NavVoltarInicio } from '../sobre-nos/_components/NavVoltarInicio';

export const revalidate = 60;

function LinhaHorario({ titulo, horarios }: { titulo: string; horarios?: string[] }) {
  return (
    <p className="linha">
      <span>{titulo}</span>
      <span className="barra">|</span>
      <span className="hora">{formatarHorarios(horarios)}</span>
    </p>
  );
}

export default async function MissasPage() {
  const pagina = await getPaginaMissas();

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F7F5EB] select-none">
      <style>{`
        .linha { font-family: var(--font-regular); font-size: clamp(1rem, 4.4vw, 3.17rem); color: #491F14;
                 white-space: nowrap; display: flex; align-items: baseline; gap: 0.32em; }
        .linha .barra { color: #491F14; opacity: .55; font-family: var(--font-regular); }
        .linha .hora { font-family: var(--font-bold); color: #8B1E31; }
      `}</style>

      {/* 1) TÍTULO + HORÁRIOS + CTA */}
      <div className="relative z-10 w-full pt-[4.6vh] flex flex-col items-center text-center">
        <h1
          style={{ fontFamily: 'var(--font-asah)', fontSize: 'clamp(2.5rem, 10.1vw, 7.27rem)' }}
          className="uppercase text-[#8B1E31] leading-[1.05]"
        >
          Horário<br />de Missas
        </h1>

        <div className="mt-[3.6vh] flex flex-col items-center w-full px-[6%]">
          <LinhaHorario titulo={pagina?.tercaSexta?.titulo ?? 'Terça à Sexta-feira'} horarios={pagina?.tercaSexta?.horarios} />
          <div className="mt-[2.6vh]">
            <LinhaHorario titulo={pagina?.sabado?.titulo ?? 'Sábado'} horarios={pagina?.sabado?.horarios} />
          </div>

          <div className="mt-[2.4vh] flex flex-col items-center">
            <LinhaHorario titulo={pagina?.domingo?.titulo ?? 'Domingo'} horarios={pagina?.domingo?.horarios} />
            {pagina?.domingo?.observacao && (
              <p
                style={{ fontFamily: 'var(--font-regular)', fontSize: 'clamp(0.88rem, 3.86vw, 2.78rem)' }}
                className="text-[#7A5B4B] mt-[0.4vh]"
              >
                ({pagina.domingo.observacao})
              </p>
            )}
          </div>

          <div className="mt-[2.4vh] flex flex-col items-center">
            <LinhaHorario titulo={pagina?.quintaDoMes?.titulo ?? '1ª Quinta-feira do Mês'} horarios={pagina?.quintaDoMes?.horarios} />
            {pagina?.quintaDoMes?.observacao && (
              <p
                style={{ fontFamily: 'var(--font-regular)', fontSize: 'clamp(0.88rem, 3.86vw, 2.78rem)' }}
                className="text-[#7A5B4B] mt-[0.4vh]"
              >
                ({pagina.quintaDoMes.observacao})
              </p>
            )}
          </div>
        </div>

        <p
          style={{ fontFamily: 'var(--font-bold)', fontSize: 'clamp(1.25rem, 5.57vw, 4.01rem)' }}
          className="mt-[6.5vh] text-[#8B1E31] text-center leading-[1.28] px-[10%]"
        >
          Participe conosco e<br />fortaleça sua fé
        </p>
      </div>

      {/* 2) PADRÃO DECORATIVO + FOTO (Sanity), na parte de baixo */}
      <div className="absolute inset-x-0 bottom-0 w-full h-[51vh] z-0 overflow-hidden">
        <img
          src="/missas/vetor.png"
          alt=""
          className="absolute left-1/2 pointer-events-none"
          style={{ top: '-2vh', transform: 'translateX(-50%)', width: '112vw', height: 'auto', opacity: 0.9 }}
        />
        <div
          className="absolute inset-x-0 bottom-0 w-full h-[88%] z-[1]"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 14%)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 14%)',
          }}
        >
          {pagina?.imagemUrl ? (
            <img
              src={pagina.imagemUrl}
              alt=""
              className="w-full h-full object-cover object-top"
              style={{ transform: 'scale(1.35)', transformOrigin: 'bottom center' }}
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-center px-6">
              Cadastre a foto desta página no Sanity (Horário de Missas)
            </div>
          )}
        </div>
      </div>

      {/* 3) BOTÕES SOBRE A FOTO */}
      <NavVoltarInicio hrefVoltar="/" className="absolute inset-x-0 bottom-[4.2vh] z-20" />
    </div>
  );
}
