// app/sobre-nos/historia/page.tsx
import { NavVoltarInicio } from '../_components/NavVoltarInicio';

// Esta página usa apenas assets estáticos (public/nossahistoria) — sem Sanity.
// A imagem de fundo (ilustração do santuário) não deve mudar tão cedo, então
// não há schema/menu para ela, diferente de "Primeira Vez Aqui" e "Quem Somos".

// O conteúdo desta tela é fixo, mas o protetor de tela (carrossel de
// inatividade) é montado no layout e vem do Sanity — sem este revalidate a
// página ficaria com a lista de slides congelada no build.
export const revalidate = 60;

const PARAGRAFOS = [
  'Desde sua inauguração em 1967, o Santuário do Divino Espírito Santo tornou-se um lugar de encontro, oração e esperança para inúmeras pessoas que buscam fortalecer sua caminhada com Deus.',
  'Como Santuário Franciscano, vivemos a espiritualidade da fraternidade, acolhendo cada peregrino com a simplicidade e a paz que marcaram a vida de São Francisco de Assis.',
  'Ao longo dos anos, este espaço tem sido testemunha de orações, agradecimentos, recomeços e experiências profundas de fé, mantendo viva sua missão de acolher, evangelizar e conduzir corações ao encontro com Deus.',
];

export default function HistoriaPage() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F7F5EB] select-none">

      {/* 1) Ilustração do santuário — imagem estática, ocupa a tela toda.
             O recorte já vem em 1080x1920 (1:1 com a tela), com a ponta da
             torre da esquerda em y=47 (2,45% da tela) e a da direita em y=171
             (8,91%). Essa diferença entre as duas pontas é a régua que
             calibra o mockup: medindo-as lá, as duas dão o mesmo desvio, e o
             desenho precisa descer 4,2vh em relação ao arquivo. O que sai
             embaixo fica atrás do cartão de texto. */}
      <img
        src="/nossahistoria/fundo.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: 'translateY(4.2vh)' }}
      />

      {/* 2) Título */}
      <h1
        style={{ fontFamily: 'var(--font-asah)', fontSize: 'clamp(2.3rem, 10vw, 7.4rem)' }}
        className="absolute left-[7%] top-[8.4vh] z-[5] uppercase text-[#8B1E31] leading-[1.05]"
      >
        Nossa
        <br />
        História
      </h1>

      {/* 3) Cartão branco (fundo do texto) — estático, cobre o restante da tela */}
      <div className="absolute left-[7%] right-[7%] top-[42.4vh] bottom-[10.8vh] z-[8]">
        <img
          src="/nossahistoria/retangulo%20branco.png"
          alt=""
          className="w-full h-full object-fill"
        />
      </div>

      {/* 4) Texto sobre o cartão */}
      <div
        className="absolute left-[7%] right-[7%] top-[42.4vh] bottom-[10.8vh] z-10 flex flex-col items-center text-center"
        style={{ paddingTop: '2.3vh', paddingLeft: '3%', paddingRight: '3%' }}
      >
        {PARAGRAFOS.map((texto, i) => (
          <p
            key={i}
            style={{
              fontFamily: 'var(--font-regular)',
              fontSize: 'clamp(0.73rem, 3vw, 2.18rem)',
              marginTop: i === 0 ? 0 : '2.2vh',
            }}
            className="text-[#523229] leading-[1.42] max-w-[24em]"
          >
            {texto}
          </p>
        ))}
      </div>

      {/* 5) Navegação */}
      <NavVoltarInicio hrefVoltar="/sobre-nos" className="absolute inset-x-0 bottom-[2.7vh] z-20" />

    </div>
  );
}
