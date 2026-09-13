// app/sobre-nos/historia/page.tsx
import { NavVoltarInicio } from '../_components/NavVoltarInicio';

// Esta página usa apenas assets estáticos (public/nossahistoria) — sem Sanity.
// A imagem de fundo (ilustração do santuário) não deve mudar tão cedo, então
// não há schema/menu para ela, diferente de "Primeira Vez Aqui" e "Quem Somos".

const PARAGRAFOS = [
  'Desde sua inauguração em 1967, o Santuário do Divino Espírito Santo tornou-se um lugar de encontro, oração e esperança para inúmeras pessoas que buscam fortalecer sua caminhada com Deus.',
  'Como Santuário Franciscano, vivemos a espiritualidade da fraternidade, acolhendo cada peregrino com a simplicidade e a paz que marcaram a vida de São Francisco de Assis.',
  'Ao longo dos anos, este espaço tem sido testemunha de orações, agradecimentos, recomeços e experiências profundas de fé, mantendo viva sua missão de acolher, evangelizar e conduzir corações ao encontro com Deus.',
];

export default function HistoriaPage() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F8F5EB] select-none">

      {/* 1) Ilustração do santuário — imagem estática, ocupa a tela toda */}
      <img
        src="/nossahistoria/fundo.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* 2) Título */}
      <h1
        style={{ fontFamily: 'var(--font-asah)', fontSize: 'clamp(1.9rem, 8.3vw, 6.1rem)' }}
        className="absolute left-[9%] top-[8.4vh] z-[5] uppercase text-[#8B1E31] leading-[1.05]"
      >
        Nossa
        <br />
        História
      </h1>

      {/* 3) Cartão branco (fundo do texto) — estático, cobre o restante da tela */}
      <div className="absolute left-[9%] right-[9%] top-[40.5vh] bottom-0 z-[8] overflow-hidden">
        <img
          src="/nossahistoria/retangulo%20branco.png"
          alt=""
          className="w-full h-full object-cover object-top"
        />
      </div>

      {/* 4) Texto sobre o cartão */}
      <div
        className="absolute left-[9%] right-[9%] top-[40.5vh] bottom-0 z-10 flex flex-col items-center text-center"
        style={{ paddingTop: '3.1vh', paddingLeft: '3%', paddingRight: '3%' }}
      >
        {PARAGRAFOS.map((texto, i) => (
          <p
            key={i}
            style={{
              fontFamily: 'var(--font-regular)',
              fontSize: 'clamp(0.62rem, 2.55vw, 1.85rem)',
              marginTop: i === 0 ? 0 : '3vh',
            }}
            className="text-[#523229] leading-[1.42] max-w-[26em]"
          >
            {texto}
          </p>
        ))}
      </div>

      {/* 5) Navegação */}
      <NavVoltarInicio hrefVoltar="/sobre-nos" className="absolute inset-x-0 bottom-[5vh] z-20" />

    </div>
  );
}
