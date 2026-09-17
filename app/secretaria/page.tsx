// app/secretaria/page.tsx
import { getPaginaSecretaria } from '@/sanity/lib/getPaginaSecretaria';
import { NavVoltarInicio } from '../sobre-nos/_components/NavVoltarInicio';

export const revalidate = 60;

// Foto que já está no totem. Vale enquanto ninguém enviar outra pelo Sanity.
const FOTO_PADRAO = '/secretaria/foto.png';

export default async function SecretariaPage() {
  const pagina = await getPaginaSecretaria();

  const horarios = pagina?.horarios ?? [];
  const telefones = pagina?.telefones ?? [];

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F7F5EB] select-none">
      {/* Foto à direita, dissolvida no fundo pela esquerda e por baixo */}
      <div className="absolute right-0 top-0 w-[66%] h-[88vh] z-0">
        <img
          src={pagina?.fotoUrl ?? FOTO_PADRAO}
          alt=""
          className="w-full h-full object-cover"
          style={{
            objectPosition: 'right center',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, #000 40%), linear-gradient(to top, transparent 0%, #000 26%)',
            maskImage:
              'linear-gradient(to right, transparent 0%, #000 40%), linear-gradient(to top, transparent 0%, #000 26%)',
            WebkitMaskComposite: 'source-in',
            maskComposite: 'intersect',
          }}
        />
      </div>

      <div className="relative z-[2] pl-[8.9%] pt-[3.7vh]">
        <h1
          style={{ fontFamily: 'var(--font-asah)', fontSize: 'clamp(1.9rem, 9vw, 6.5rem)' }}
          className="uppercase text-[#8B1E31] leading-none"
        >
          Secretaria
        </h1>

        <div
          style={{ fontFamily: 'var(--font-bold)', fontSize: 'clamp(0.78rem, 3.34vw, 2.4rem)' }}
          className="mt-[1vh] text-[#491F14] leading-[1.2]"
        >
          Horário de Funcionamento
        </div>

        <img
          src="/secretaria/Ret%C3%A2ngulo%20separa%C3%A7%C3%A3o.png"
          alt=""
          className="block w-[9.4%] h-auto mt-[1.5vh]"
        />

        {/* Horários de atendimento (vêm do Sanity) */}
        <div className="mt-[2.9vh] flex flex-col gap-[2.9vh]">
          {horarios.length === 0 && (
            <div
              style={{ fontFamily: 'var(--font-regular)', fontSize: 'clamp(0.98rem, 4.33vw, 3.12rem)' }}
              className="text-[#7A5B4B] leading-[1.25]"
            >
              Cadastre os horários no Sanity
              <br />
              (item &quot;Secretaria&quot;)
            </div>
          )}
          {horarios.map((h, i) => (
            <div key={i}>
              <div
                style={{ fontFamily: 'var(--font-regular)', fontSize: 'clamp(0.98rem, 4.33vw, 3.12rem)' }}
                className="text-[#491F14] leading-[1.25]"
              >
                {h.dias}
              </div>
              <div
                style={{ fontFamily: 'var(--font-bold)', fontSize: 'clamp(1.45rem, 6.45vw, 4.64rem)' }}
                className="text-[#8B1E31] leading-[1.18]"
              >
                {h.horario}
              </div>
            </div>
          ))}
        </div>

        {/* Telefones fixos (vêm do Sanity) */}
        <div className="mt-[5.6vh] flex flex-col gap-[1.1vh]">
          {telefones.map((tel, i) => (
            <div key={i} className="flex items-center gap-[0.55em]">
              <img
                src="/secretaria/Fone%20copy%202.png"
                alt=""
                style={{ width: 'clamp(1.12rem, 5vw, 3.6rem)' }}
                className="h-auto"
              />
              <span
                style={{ fontFamily: 'var(--font-bold)', fontSize: 'clamp(1.32rem, 5.87vw, 4.23rem)' }}
                className="text-[#5C1A22] leading-[1.2]"
              >
                {tel}
              </span>
            </div>
          ))}
        </div>

        {/* Cartão do WhatsApp */}
        {pagina?.whatsappNumero && (
          <div className="relative w-[69%] aspect-[688/258] mt-[5.2vh] ml-[5.2%]">
            <img
              src="/secretaria/Ret%C3%A2ngulo%20fundo%20telefone.png"
              alt=""
              className="absolute inset-0 w-full h-full object-fill drop-shadow-lg"
            />
            <img
              src="/secretaria/whatsapp.png"
              alt=""
              className="absolute left-[-6.5%] top-1/2 -translate-y-1/2 w-[17%] h-auto z-[2]"
            />
            <div className="absolute inset-0 pl-[12%] pr-[6%] flex flex-col items-center justify-center text-center">
              <div
                style={{ fontFamily: 'var(--font-regular)', fontSize: 'clamp(0.78rem, 3.45vw, 2.48rem)' }}
                className="text-white leading-[1.3] whitespace-pre-line"
              >
                {pagina.whatsappTexto}
              </div>
              <div
                style={{ fontFamily: 'var(--font-bold)', fontSize: 'clamp(1.3rem, 5.78vw, 4.16rem)' }}
                className="mt-[0.25em] text-white leading-[1.25]"
              >
                {pagina.whatsappNumero}
              </div>
            </div>
          </div>
        )}
      </div>

      <NavVoltarInicio hrefVoltar="/?ativo=true" className="absolute inset-x-0 bottom-[4.7vh] z-10" />
    </div>
  );
}
