// app/sobre-nos/primeira-vez/page.tsx
import { getPaginaPrimeiraVez } from '@/sanity/lib/getPaginaPrimeiraVez';
import { NavVoltarInicio } from '../_components/NavVoltarInicio';

export const revalidate = 60;

export default async function PrimeiraVezPage() {
  const pagina = await getPaginaPrimeiraVez();

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#FBF6EE] select-none">

      {/* 1) FOTO DO SANITY — ocupa a tela inteira, atrás de tudo */}
      {pagina?.imagemUrl ? (
        <img
          src={pagina.imagemUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-300 flex items-end justify-center pb-[30vh] text-gray-600 text-center px-8">
          Cadastre a imagem desta página no Sanity (Primeira Vez Aqui)
        </div>
      )}

      {/* 2) Esmaecimento do topo: a foto vai sumindo até virar o bege do fundo */}
      <img
        src="/primeiravezaqui/sobreposi%C3%A7%C3%A3o%20branca.png"
        alt=""
        className="absolute inset-0 w-full h-full object-fill pointer-events-none"
      />

      {/* 3) Forma bege arredondada do rodapé, onde ficam os botões */}
      <img
        src="/primeiravezaqui/forma%20branca.png"
        alt=""
        className="absolute bottom-0 left-0 w-full h-auto pointer-events-none"
      />

      {/* 4) TEXTO DE BOAS-VINDAS */}
      <div className="absolute inset-x-0 top-0 z-10 flex flex-col items-center text-center px-6 pt-[6.2vh]">
        <p
          style={{ fontFamily: 'var(--font-medium)', fontSize: 'clamp(0.72rem, 4.4vw, 3rem)' }}
          className="uppercase tracking-[0.2em] text-[#3F3F3A] leading-none"
        >
          Primeira Vez Aqui
        </p>

        <h1
          style={{ fontFamily: 'var(--font-asah)', fontSize: 'clamp(1.7rem, 8.8vw, 6rem)' }}
          className="text-[#8B1E31] leading-tight mt-[1.1vh]"
        >
          Seja bem-vindo(a)!
        </h1>

        <p
          style={{ fontFamily: 'var(--font-regular)', fontSize: 'clamp(0.95rem, 5.2vw, 3.5rem)' }}
          className="text-[#3F1D12] leading-[1.3] mt-[1.3vh] max-w-[11em]"
        >
          Que alegria ter você conosco!
        </p>

        <p
          style={{ fontFamily: 'var(--font-bold)', fontSize: 'clamp(0.92rem, 5.1vw, 3.4rem)' }}
          className="text-[#A5714F] leading-[1.3] mt-[1.7vh] max-w-[13em]"
        >
          Aqui você encontra um espaço de fé, acolhida e oração.
        </p>
      </div>

      {/* 5) BOTÕES SOBRE A FORMA BEGE DO RODAPÉ */}
      <NavVoltarInicio hrefVoltar="/sobre-nos" className="absolute inset-x-0 bottom-[5.5vh] z-20" />

    </div>
  );
}
