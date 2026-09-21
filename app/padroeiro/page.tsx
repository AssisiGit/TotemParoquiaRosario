// app/padroeiro/page.tsx
import { NavVoltarInicio } from '../sobre-nos/_components/NavVoltarInicio';

// Esta página usa apenas assets estáticos (public/padroeiro) — sem Sanity.
// Não há foto aqui: a pomba do Divino Espírito Santo é uma ilustração do
// design (santuario.png) e os textos são fixos, então não faz sentido um
// schema para isso. Mesma decisão de "Nossa História".

// O conteúdo desta tela é fixo, mas o protetor de tela (carrossel de
// inatividade) é montado no layout e vem do Sanity — sem este revalidate a
// página ficaria com a lista de slides congelada no build.
export const revalidate = 60;

export default function PadroeiroPage() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F7F5EB] select-none">

      {/* 1) TÍTULO + SUBTÍTULO + DIVISOR + TEXTO */}
      <div className="relative z-10 w-full pt-[4.5vh] flex flex-col items-center text-center">
        <h1
          style={{ fontFamily: 'var(--font-asah)', fontSize: 'clamp(2.1rem, 8vw, 5.8rem)' }}
          className="text-[#8B1E31] leading-[1.12]"
        >
          Padroeiro<br />do Santuário
        </h1>

        <p
          style={{ fontFamily: 'var(--font-bold)', fontSize: 'clamp(1.06rem, 4.3vw, 3.1rem)' }}
          className="mt-[2.4vh] px-[8%] text-[#241C14] leading-[1.38]"
        >
          O Espírito Santo é a alma<br />da missão da Igreja.
        </p>

        {/* Barra dourada divisória (recorte real do design) */}
        <img
          src="/padroeiro/retangulo%20separa%C3%A7%C3%A3o.png"
          alt=""
          className="mt-[3.1vh] h-auto"
          style={{ width: '19.07vw' }}
        />

        <p
          style={{ fontFamily: 'var(--font-regular)', fontSize: 'clamp(1rem, 4.05vw, 2.92rem)' }}
          className="mt-[4vh] px-[15%] text-[#491F14] leading-[1.46]"
        >
          Padroeiro do nosso Santuário, o Divino Espírito Santo nos conduz pelos
          caminhos da fé, fortalece nossa esperança e nos inspira a viver o
          Evangelho com amor, coragem e fraternidade.
        </p>
      </div>

      {/* 2) POMBA (Divino Espírito Santo) + VÉU DEGRADÊ QUE A DISSOLVE NO FUNDO.
             Os dois são recortes reais do design; o degradê é transparente em
             cima e vai virando creme embaixo, então a pomba some suavemente. */}
      <img
        src="/padroeiro/santuario.png"
        alt=""
        className="absolute left-0 bottom-[1.5vh] w-full h-auto z-0 pointer-events-none"
      />
      <img
        src="/padroeiro/degrade%20branco.png"
        alt=""
        className="absolute left-0 bottom-0 w-full h-auto z-[1] pointer-events-none"
      />

      {/* 3) BOTÕES SOBRE A ILUSTRAÇÃO */}
      <NavVoltarInicio hrefVoltar="/?ativo=true" className="absolute inset-x-0 bottom-[4.2vh] z-20" />
    </div>
  );
}
