// app/avisos/page.tsx
import { getAvisos } from '@/sanity/lib/getAvisos';
import { NavVoltarInicio } from '../sobre-nos/_components/NavVoltarInicio';

export const revalidate = 60;

export default async function AvisosPage() {
  // Todo o conteúdo desta tela vem do Sanity: cada cartão bege é um documento
  // "Aviso". Não há nada fixo no código além do título e do ícone.
  const avisos = await getAvisos();

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F7F5EB] select-none flex flex-col">
      {/* Divino Espírito Santo em traço claro, ocupando a tela toda por trás */}
      <img
        src="/avisos/vetor%20divino%20espirito.png"
        alt=""
        className="absolute left-1/2 -translate-x-1/2 top-[1.2vh] w-full h-auto z-0 pointer-events-none"
      />

      <img
        src="/avisos/Icon%20Avisos.png"
        alt=""
        style={{ width: 'clamp(1.6rem, 7.3vw, 5.25rem)' }}
        className="relative z-[2] block mx-auto h-auto mt-[9.4vh]"
      />

      <h1
        style={{ fontFamily: 'var(--font-asah)', fontSize: 'clamp(1.75rem, 6.9vw, 4.97rem)' }}
        className="relative z-[2] uppercase text-center text-[#8B1E31] leading-[1.1] mt-[1.3vh]"
      >
        Avisos
      </h1>

      {/* Cartões. Cada um cresce conforme o texto (o retângulo bege é esticado
          junto), e a lista rola se a secretaria cadastrar mais do que cabe. */}
      <div className="relative z-[2] flex-1 min-h-0 overflow-y-auto flex flex-col items-center gap-[1.8vh] pt-[7vh] pb-[1vh] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {avisos.length === 0 && (
          <div className="relative w-[74.2%] flex-none min-h-[10.2vh] flex items-center justify-center px-[5%] py-[2.1vh]">
            <img
              src="/avisos/Ret%C3%A2ngulo%20bege.png"
              alt=""
              className="absolute inset-0 w-full h-full object-fill z-0 opacity-50"
            />
            <span
              style={{ fontFamily: 'var(--font-bold)', fontSize: 'clamp(0.95rem, 4.1vw, 2.95rem)' }}
              className="relative z-[1] text-center text-[#7A5B4B] leading-[1.3]"
            >
              Sem Avisos no momento
            </span>
          </div>
        )}

        {avisos.map((aviso) => (
          <div
            key={aviso._id}
            className="relative w-[74.2%] flex-none min-h-[10.2vh] flex items-center justify-center gap-[5%] px-[5%] py-[2.1vh]"
          >
            <img
              src="/avisos/Ret%C3%A2ngulo%20bege.png"
              alt=""
              className="absolute inset-0 w-full h-full object-fill z-0"
            />
            <span
              style={{ fontFamily: 'var(--font-bold)', fontSize: 'clamp(0.95rem, 4.1vw, 2.95rem)' }}
              className={`relative z-[1] text-[#7A5B4B] leading-[1.3] whitespace-pre-line ${
                aviso.imagemUrl ? 'flex-1 text-left' : 'text-center'
              }`}
            >
              {aviso.texto}
            </span>
            {/* Anexo (normalmente um QR Code). O fundo branco garante que o
                código seja lido mesmo se a imagem enviada não tiver margem. */}
            {aviso.imagemUrl && (
              <div
                className="relative z-[1] flex-none w-[26%] aspect-square bg-white flex"
                style={{ borderRadius: '1.4vw', padding: '0.9vw' }}
              >
                <img src={aviso.imagemUrl} alt="" className="w-full h-full object-contain" />
              </div>
            )}
          </div>
        ))}
      </div>

      <NavVoltarInicio hrefVoltar="/?ativo=true" className="relative z-10 pb-[4.4vh]" />
    </div>
  );
}
