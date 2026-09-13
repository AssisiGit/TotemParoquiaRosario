// app/sobre-nos/_components/BotaoDourado.tsx
import Link from 'next/link';

// Botão dourado em pílula, usando o recorte real do design (public/sobrenos).
// O container mantém exatamente a proporção da imagem (aspect-[858/145]),
// então a pílula nunca fica esticada nem cortada, seja qual for a largura da tela.
//
// Texto em clamp() (vw) em vez de rem fixo, porque o totem é uma tela grande em pé.
export function BotaoDourado({
  href,
  numero,
  titulo,
}: {
  href: string;
  numero: string;
  titulo: string;
}) {
  return (
    <Link href={href} className="group relative w-full aspect-[858/145] active:scale-95 transition-transform block">
      <img src="/sobrenos/retangulo%20amarel.png" alt="" className="absolute inset-0 w-full h-full object-fill drop-shadow-md" />
      <span
        style={{ fontFamily: 'var(--font-bold)', fontSize: 'clamp(0.85rem, 4.2vw, 3rem)' }}
        className="absolute inset-0 flex items-center px-[7%] text-white"
      >
        <span className="mr-[0.5em] drop-shadow-md">{numero}</span>
        <span className="uppercase tracking-wide drop-shadow-md">{titulo}</span>
      </span>
    </Link>
  );
}
