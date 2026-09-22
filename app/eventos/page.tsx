// app/eventos/page.tsx
import { getEventos } from '@/sanity/lib/getEventos';
import { getPaginaEventos } from '@/sanity/lib/getPaginaEventos';
import { NavVoltarInicio } from '../sobre-nos/_components/NavVoltarInicio';

export const revalidate = 60;

export default async function EventosPage() {
  // Duas coisas vêm do Sanity: a lista de eventos (tipo "evento", um documento
  // por evento) e a foto do rodapé (documento único "Eventos (Foto)").
  const [eventos, pagina] = await Promise.all([getEventos(), getPaginaEventos()]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F7F5EB] select-none flex flex-col">
      {/* Igreja em traço claro, atrás da lista */}
      <img
        src="/eventos/evento%20vetor%20desenho.png"
        alt=""
        className="absolute left-1/2 -translate-x-1/2 top-[29vh] w-full h-auto z-0 pointer-events-none"
      />

      <h1
        style={{ fontFamily: 'var(--font-asah)', fontSize: 'clamp(1.7rem, 6.4vw, 4.6rem)' }}
        className="relative z-[2] uppercase text-center text-[#8B1E31] leading-[1.18] pt-[5.6vh] px-[8%]"
      >
        Calendário de<br />Eventos
      </h1>

      {/* Lista de eventos. Rola sozinha se a secretaria cadastrar mais eventos
          do que cabe no espaço acima da foto. */}
      <div className="relative z-[2] flex-1 min-h-0 overflow-y-auto flex flex-col items-center gap-[4vh] pt-[3.4vh]">
        {eventos.length === 0 && (
          <div
            style={{ fontFamily: 'var(--font-regular)', fontSize: 'clamp(0.9rem, 4vw, 2.9rem)' }}
            className="text-center text-[#7A5B4B] leading-[1.34] px-[10%]"
          >
            Cadastre os eventos no Sanity
            <br />
            (item &quot;Eventos (Calendário)&quot;)
          </div>
        )}

        {eventos.map((evento) => (
          <div key={evento._id} className="text-center flex-none px-[6%]">
            <div
              style={{ fontFamily: 'var(--font-bold)', fontSize: 'clamp(1.05rem, 5.15vw, 3.7rem)' }}
              className="text-[#491F14] leading-[1.34]"
            >
              {evento.data}
            </div>
            <div
              style={{ fontFamily: 'var(--font-regular)', fontSize: 'clamp(1rem, 4.95vw, 3.56rem)' }}
              className="text-[#491F14] leading-[1.34]"
            >
              {evento.titulo}
            </div>
            <div
              style={{ fontFamily: 'var(--font-regular)', fontSize: 'clamp(1rem, 4.95vw, 3.56rem)' }}
              className="text-[#491F14] leading-[1.34]"
            >
              {evento.horario}
            </div>
          </div>
        ))}
      </div>

      {/* Foto do rodapé, com o topo em arco (cúpula). O border-radius elíptico
          é o que faz a curva: 50% da largura na horizontal, 31% da altura na
          vertical — mesma proporção do design. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[37.6vh] z-[3] overflow-hidden"
        style={{ borderRadius: '50% 50% 0 0 / 31% 31% 0 0' }}
      >
        {pagina?.fotoUrl ? (
          <img
            src={pagina.fotoUrl}
            alt=""
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 42%' }}
          />
        ) : (
          <div
            style={{ fontFamily: 'var(--font-bold)', fontSize: 'clamp(0.8rem, 3vw, 2.16rem)' }}
            className="w-full h-full bg-[#E2DDD3] flex items-center justify-center text-center px-[12%] text-[#7A5B4B] leading-[1.3]"
          >
            Cadastre a foto no Sanity — item &quot;Eventos (Foto)&quot;
          </div>
        )}
      </div>

      <NavVoltarInicio hrefVoltar="/?ativo=true" className="absolute inset-x-0 bottom-[4.6vh] z-10" />
    </div>
  );
}
