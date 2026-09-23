// app/dizimo/page.tsx
import { getPaginaDizimo } from '@/sanity/lib/getPaginaDizimo';
import { NavVoltarInicio } from '../sobre-nos/_components/NavVoltarInicio';

export const revalidate = 60;

// QR Code que já está no totem. Vale enquanto ninguém enviar outro pelo Sanity.
const QR_PADRAO = '/dizimo/qr%20code.png';

export default async function DizimoPage() {
  const pagina = await getPaginaDizimo();

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F7F5EB] select-none">
      {/* Coração recortado, atrás do título */}
      <img
        src="/dizimo/dizimo%20simbolo.png"
        alt=""
        className="absolute left-1/2 -translate-x-1/2 top-[6vh] w-[85%] h-auto z-[1]"
      />

      <img
        src="/dizimo/TAU.png"
        alt=""
        style={{ width: 'clamp(1.1rem, 4.9vw, 3.5rem)' }}
        className="relative z-[3] block mx-auto h-auto mt-[3.7vh]"
      />

      {/* Título sobre as duas faixas claras do recorte real.

          Os `top` centram as LETRAS em cada faixa (espaço igual em cima e
          embaixo da tinta), não a caixa de linha da fonte. Na Asah a caixa
          de linha centrada deixa o texto alto: "dizimista" não tem
          descendente, então as hastes do d/t saíam 2px por cima da faixa e
          sobravam 31px embaixo. "Seja um" ocupa a faixa inteira (do topo do
          S ao pé do j) e só precisou de 1px; o -0.3% em x compensa a faixa
          de cima, que no recorte fica 1,5px à esquerda do centro. */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[14.7vh] w-[65.6%] aspect-[677/263] z-[2]">
        <img
          src="/dizimo/fundo%20fonte.png"
          alt=""
          className="absolute inset-0 w-full h-full object-fill"
        />
        <span
          style={{ fontFamily: 'var(--font-asah)', fontSize: 'clamp(3rem, 12vw, 8.6rem)' }}
          className="absolute inset-x-0 top-[22.7%] -translate-y-1/2 -translate-x-[0.3%] text-center text-[#8B1E31] leading-none"
        >
          Seja um
        </span>
        <span
          style={{ fontFamily: 'var(--font-asah)', fontSize: 'clamp(3rem, 12vw, 8.6rem)' }}
          className="absolute inset-x-0 top-[82.2%] -translate-y-1/2 text-center text-[#8B1E31] leading-none"
        >
          dizimista
        </span>
      </div>

      {/* QR Code. A moldura vermelha/bege vem do recorte real; o código do
          Sanity (quando existir) é sobreposto na área branca interna. */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[34.4vh] w-[61.4%] aspect-square z-[4]">
        <img src={QR_PADRAO} alt="" className="absolute inset-0 w-full h-full object-contain" />
        {pagina?.qrCodeUrl && (
          <div className="absolute inset-[6%] bg-white rounded-[9%] flex items-center justify-center p-[9%]">
            <img
              src={pagina.qrCodeUrl}
              alt="QR Code do dízimo"
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 top-[74.5vh] z-[4] text-center px-[8%]">
        <div
          style={{ fontFamily: 'var(--font-regular)', fontSize: 'clamp(0.95rem, 4.27vw, 3.07rem)' }}
          className="text-[#491F14] leading-[1.36]"
        >
          O dízimo é um gesto de fé,
          <br />
          partilha e gratidão.
        </div>
        <div
          style={{ fontFamily: 'var(--font-bold)', fontSize: 'clamp(0.95rem, 4.27vw, 3.07rem)' }}
          className="mt-[0.55em] text-[#8B1E31] tracking-[0.09em]"
        >
          Paz e bem
        </div>
      </div>

      <NavVoltarInicio hrefVoltar="/?ativo=true" className="absolute inset-x-0 bottom-[4.4vh] z-10" />
    </div>
  );
}
