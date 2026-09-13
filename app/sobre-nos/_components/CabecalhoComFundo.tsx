// app/sobre-nos/_components/CabecalhoComFundo.tsx

// Topo arredondado com foto de fundo + título, usado em todas as páginas internas
// do "Sobre Nós". A imagem de fundo vem do Sanity (cada página escolhe a sua).
//
// Medidas em vh/vw (com limites via clamp) porque o totem é uma tela grande em pé:
// medidas fixas em rem ficariam pequenas nele.
export function CabecalhoComFundo({
  titulo,
  imagemFundoUrl,
}: {
  titulo: string;
  imagemFundoUrl?: string;
}) {
  return (
    <div
      className="relative w-full h-[39vh] overflow-hidden shadow-xl"
      style={{ borderRadius: '0 0 clamp(1.6rem, 6vw, 4.2rem) clamp(1.6rem, 6vw, 4.2rem)' }}
    >
      {imagemFundoUrl ? (
        <img src={imagemFundoUrl} alt={titulo} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-center px-6">
          Cadastre a &quot;Imagem de Fundo&quot; desta página no Sanity
        </div>
      )}
      {/* Sobreposição escura para o texto branco aparecer melhor */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

      <div className="absolute inset-x-0 bottom-[2.2vh] w-full text-center px-4 z-[5]">
        <h1
          style={{ fontFamily: 'var(--font-asah)', fontSize: 'clamp(2.2rem, 10.5vw, 7.5rem)' }}
          className="text-white uppercase leading-none drop-shadow-lg"
        >
          {titulo}
        </h1>
      </div>
    </div>
  );
}
