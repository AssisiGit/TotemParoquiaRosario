// app/redesocial/page.tsx
// Rota "redesocial" (sem hífen) porque é assim que o botão está cadastrado no
// menuTotem do Sanity.
import { getPaginaRedesSociais } from '@/sanity/lib/getPaginaRedesSociais';
import { NavVoltarInicio } from '../sobre-nos/_components/NavVoltarInicio';

export const revalidate = 60;

export default async function RedesSociaisPage() {
  const pagina = await getPaginaRedesSociais();

  // Cada coluna: ícone da rede + QR Code. O QR vem do Sanity quando enviado;
  // senão vale o que já está no totem.
  const colunas = [
    {
      chave: 'facebook',
      icone: '/redessociais/facebook.png',
      alt: 'Facebook',
      qr: pagina?.qrFacebookUrl ?? '/redessociais/Qr%20Code%20Facebook.png',
    },
    {
      chave: 'instagram',
      icone: '/redessociais/instagram.png',
      alt: 'Instagram',
      qr: pagina?.qrInstagramUrl ?? '/redessociais/Qr%20Code%20Instagram.png',
    },
    {
      chave: 'site',
      icone: '/redessociais/site.png',
      alt: 'Site da paróquia',
      qr: pagina?.qrSiteUrl ?? '/redessociais/site%20qr%20code.png',
    },
  ];

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F7F5EB] select-none">
      {/* Divino Espírito Santo em traço claro, atrás de tudo (mesmo recorte
          usado na página de Avisos) */}
      <img
        src="/avisos/vetor%20divino%20espirito.png"
        alt=""
        className="absolute left-1/2 -translate-x-1/2 top-[1.2vh] w-full h-auto z-0 pointer-events-none"
      />

      <img
        src="/dizimo/TAU.png"
        alt=""
        style={{ width: 'clamp(1.15rem, 5.2vw, 3.7rem)' }}
        className="relative z-[2] block mx-auto h-auto mt-[6.9vh]"
      />

      <h1
        style={{ fontFamily: 'var(--font-asah)', fontSize: 'clamp(2.1rem, 9.52vw, 6.85rem)' }}
        className="relative z-[2] text-center text-[#8B1E31] leading-none mt-[2.4vh]"
      >
        Redes Sociais
      </h1>

      <div
        style={{ fontFamily: 'var(--font-bold)', fontSize: 'clamp(1.14rem, 5.05vw, 3.64rem)' }}
        className="relative z-[2] text-center text-[#491F14] leading-[1.32] mt-[2.1vh] px-[8%]"
      >
        Siga nossos perfis no
        <br />
        Facebook e Instagram
      </div>

      {/* Faixa vermelha de ponta a ponta, com os ícones e os QR Codes */}
      <div className="absolute inset-x-0 top-[37.7vh] h-[30vh] bg-[#8B1E31] z-[3] flex flex-col items-center pt-[4.27vh]">
        <div className="w-full grid grid-cols-3 items-end justify-items-center px-[1%]">
          {colunas.map((c) => (
            <img
              key={c.chave}
              src={c.icone}
              alt={c.alt}
              style={{ height: 'clamp(1.9rem, 9.4vw, 6.75rem)' }}
              className="w-auto object-contain"
            />
          ))}
        </div>
        <div className="w-full grid grid-cols-3 items-start justify-items-center px-[1%] mt-[2.27vh]">
          {colunas.map((c) => (
            <div
              key={c.chave}
              className="w-[65.7%] aspect-square flex bg-transparent"
              style={{
                border: '0.36vw solid #fff',
                borderRadius: '1.9vw',
                padding: '0.35vw',
              }}
            >
              <img src={c.qr} alt="" className="w-full h-full object-contain" />
            </div>
          ))}
        </div>
      </div>

      <div
        style={{ fontFamily: 'var(--font-bold)', fontSize: 'clamp(1.15rem, 5.07vw, 3.65rem)' }}
        className="absolute inset-x-0 top-[74.2vh] z-[2] text-center text-[#491F14] leading-[1.32] px-[8%]"
      >
        Fique por dentro de tudo
        <br />
        que acontece!
      </div>

      <NavVoltarInicio hrefVoltar="/?ativo=true" className="absolute inset-x-0 bottom-[4.6vh] z-10" />
    </div>
  );
}
