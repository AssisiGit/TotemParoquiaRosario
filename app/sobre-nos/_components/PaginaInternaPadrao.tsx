// app/sobre-nos/_components/PaginaInternaPadrao.tsx
import { getConfigTotem } from '@/sanity/lib/getConfigTotem';
import { CabecalhoComFundo } from './CabecalhoComFundo';
import { NavVoltarInicio } from './NavVoltarInicio';

// Modelo provisório para as telas do "Sobre Nós" que ainda não foram montadas
// (História, Carisma, São Francisco). Serve só para o botão não cair em uma
// página inexistente. Cada uma vai ganhar seu próprio layout e seu próprio tipo
// no Sanity, como já foi feito em "Primeira Vez Aqui" e "Quem Somos".
export async function PaginaInternaPadrao({ titulo }: { titulo: string }) {
  const config = await getConfigTotem();

  return (
    <div className="min-h-screen bg-[#F7F5EB] relative select-none overflow-hidden pb-12">
      {config?.marcaDaguaUrl && (
        <div
          className="absolute inset-0 opacity-[0.090] bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url(${config.marcaDaguaUrl})` }}
        ></div>
      )}

      <CabecalhoComFundo titulo={titulo} />

      <NavVoltarInicio hrefVoltar="/sobre-nos" />

      <div className="w-full px-[9%] mt-10 relative z-10 flex flex-col items-center text-center">
        <p className="text-[#5A3B2B]/70 text-base sm:text-lg italic">
          Esta tela ainda será montada.
        </p>
      </div>
    </div>
  );
}
