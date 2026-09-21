// app/sobre-nos/_components/NavVoltarInicio.tsx
import Link from 'next/link';

// Linha com os botões "Voltar" e "Início", usando os recortes reais do design
// (public/global). O container de cada botão tem o mesmo formato (aspect-ratio)
// da imagem original, então ela nunca é esticada/distorcida.
//
// Tamanhos em vw (com limites via clamp) porque o totem é uma tela grande em pé:
// medidas fixas em px ficariam minúsculas nele. Assim o botão mantém a mesma
// proporção do design em qualquer resolução.
const ALTURA_BOTAO = 'clamp(3.1rem, 12.5vw, 8.6rem)';
const TEXTO_INICIO = 'clamp(0.8rem, 4.9vw, 3.4rem)';

export function NavVoltarInicio({
  hrefVoltar,
  className = 'relative z-10 mt-8',
}: {
  hrefVoltar: string;
  // Controla posicionamento/espaçamento (ex: 'absolute inset-x-0 bottom-[5.5vh] z-20'
  // para sobrepor os botões em cima de uma foto). Substitui o padrão inteiro.
  className?: string;
}) {
  return (
    <div className={`w-full shrink-0 flex justify-between items-center px-[9%] ${className}`}>
      {/* Botão Voltar */}
      <Link
        href={hrefVoltar}
        style={{ height: ALTURA_BOTAO }}
        className="relative block aspect-[175/145] active:scale-95 transition-transform"
      >
        <img src="/global/Retangulo%20da%20setinha.png" alt="" className="absolute inset-0 w-full h-full object-fill drop-shadow-lg" />
        <img src="/global/seta.png" alt="Voltar" className="absolute inset-0 m-auto w-[34%] h-auto object-contain" />
      </Link>

      {/* Botão Início */}
      <Link
        href="/?ativo=true"
        style={{ height: ALTURA_BOTAO, fontSize: TEXTO_INICIO }}
        className="relative block aspect-[376/145] active:scale-95 transition-transform"
      >
        <img src="/global/Retangulo%20da%20casa.png" alt="" className="absolute inset-0 w-full h-full object-fill drop-shadow-lg" />
        <span
          style={{ fontFamily: 'var(--font-bold)' }}
          className="absolute inset-0 flex items-center justify-center gap-[0.5em] text-white tracking-wide"
        >
          <img src="/global/casa.png" alt="" className="w-[1.35em] h-[1.35em] object-contain" />
          INÍCIO
        </span>
      </Link>
    </div>
  );
}
