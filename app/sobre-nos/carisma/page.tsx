// app/sobre-nos/carisma/page.tsx
import { getPaginaCarisma } from '@/sanity/lib/getPaginaCarisma';
import { NavVoltarInicio } from '../_components/NavVoltarInicio';

export const revalidate = 60;

const PARAGRAFOS = [
  'Inspirado em São Francisco de Assis, o Carisma Franciscano convida a viver o Evangelho de forma simples, fraterna e missionária.',
  'Sua espiritualidade valoriza a paz, o cuidado com a criação, o amor aos mais necessitados e o reconhecimento da presença de Deus em todas as pessoas e em toda a obra criada.',
  'Mais do que uma devoção, é um modo de viver a fé, seguindo os passos de Cristo com humildade, alegria e fraternidade.',
];

export default async function CarismaPage() {
  const pagina = await getPaginaCarisma();

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F7F5EB] select-none">

      {/* 1) FOTO (Sanity) — ocupa só a faixa de baixo da tela, para o texto
             ficar inteiro sobre o creme. O enquadramento (object-position)
             centraliza a foto nos frades: corta o teto escuro em cima e boa
             parte do tapete vermelho embaixo. */}
      {pagina?.imagemUrl ? (
        <div
          className="absolute inset-x-0 bottom-0 w-full h-[43vh] overflow-hidden"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 45%)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 45%)',
          }}
        >
          <img
            src={pagina.imagemUrl}
            alt=""
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 72%' }}
          />
        </div>
      ) : (
        <div className="absolute inset-x-0 top-0 h-[24vh] bg-gray-300 flex items-center justify-center text-gray-600 text-center px-8">
          Cadastre a imagem desta página no Sanity (Carisma)
        </div>
      )}

      {/* 3) TÍTULO E TEXTO */}
      <div className="absolute inset-x-0 top-[6.7vh] z-10 flex flex-col items-center text-center px-[13%]">
        <h1
          style={{ fontFamily: 'var(--font-asah)', fontSize: 'clamp(2.2rem, 9vw, 6.5rem)' }}
          className="uppercase text-[#8B1E31] leading-none"
        >
          Carisma
        </h1>

        <div className="mt-[3.8vh]">
          {PARAGRAFOS.map((texto, i) => (
            <p
              key={i}
              style={{
                fontFamily: 'var(--font-regular)',
                fontSize: 'clamp(0.84rem, 3.5vw, 2.52rem)',
                marginTop: i === 0 ? 0 : '3.4vh',
              }}
              className="text-[#241C14] leading-[1.42] max-w-[22em]"
            >
              {texto}
            </p>
          ))}
        </div>
      </div>

      {/* 4) BOTÕES SOBRE A FOTO */}
      <NavVoltarInicio hrefVoltar="/sobre-nos" className="absolute inset-x-0 bottom-[5vh] z-20" />

    </div>
  );
}
