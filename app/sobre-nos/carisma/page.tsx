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
             ficar inteiro sobre o creme.
             O arquivo tem 1080x1872 e, medido nele: teto escuro até 57,5%,
             o banner da Festa da Penha de 57,5% a 68%, os frades de 66% a
             85% e o tapete vermelho puro de 85,6% até o fim. Como a faixa é
             mais baixa que o arquivo, o `object-cover` não amplia nada — o
             que o `object-position` faz é escolher QUAL pedaço aparece. Com
             94% a janela vai de 44,7% a 97,1% do arquivo, então os frades
             terminam em 88,2% da TELA e sobra tapete embaixo deles, que é
             onde os botões pousam (antes, com 72%, a janela parava em 84,3%
             do arquivo: os frades iam até a borda da tela e os botões caíam
             em cima deles). */}
      {pagina?.imagemUrl ? (
        <div
          className="absolute inset-x-0 bottom-0 w-full h-[51vh] overflow-hidden"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 22%)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 22%)',
          }}
        >
          <img
            src={pagina.imagemUrl}
            alt=""
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 94%' }}
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
                fontSize: 'clamp(0.77rem, 3.2vw, 2.3rem)',
                marginTop: i === 0 ? 0 : '2.5vh',
              }}
              className="text-[#241C14] leading-[1.42] max-w-[22em]"
            >
              {texto}
            </p>
          ))}
        </div>
      </div>

      {/* 4) BOTÕES SOBRE A FOTO */}
      <NavVoltarInicio hrefVoltar="/sobre-nos" className="absolute inset-x-0 bottom-[2.7vh] z-20" />

    </div>
  );
}
