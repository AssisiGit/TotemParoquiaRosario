// app/sobre-nos/quem-somos/page.tsx
import { getPaginaQuemSomos } from '@/sanity/lib/getPaginaQuemSomos';
import { NavVoltarInicio } from '../_components/NavVoltarInicio';

export const revalidate = 60;

const TEXTO =
  'O Santuário do Divino Espírito Santo, integrante da Paróquia Nossa Senhora do Rosário ' +
  '(composta por 10 comunidades), é um espaço de fé, oração e renovação. Inspirado pelos ' +
  'valores franciscanos de fraternidade, simplicidade e paz, o local acolhe a todos como ' +
  'família, oferecendo um refúgio para o encontro com Deus, consigo mesmo e com a comunidade.';

export default async function QuemSomosPage() {
  const pagina = await getPaginaQuemSomos();

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F7F5EB] select-none">

      {/* 1) FOTO DO SANTUÁRIO (Sanity) — aparece no topo, atrás do arco */}
      {pagina?.imagemUrl ? (
        <img src={pagina.imagemUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-x-0 top-0 h-[24vh] bg-gray-300 flex items-center justify-center text-gray-600 text-center px-8">
          Cadastre a imagem desta página no Sanity (Quem Somos)
        </div>
      )}

      {/* 2) Arco bege que cobre a parte de baixo da foto.
             O recorte tem 1080x1475, então a largura cheia faz o topo do arco
             cair em ~23vh. O design quer o arco começando em ~33vh, por isso
             ele é empurrado 9.8vh para baixo — a parte que sai da tela é só a
             faixa lisa de baixo, que continua cobrindo até a borda. */}
      <img
        src="/quemsomos/forma%20branca.png"
        alt=""
        className="absolute left-0 w-full h-auto pointer-events-none"
        style={{ bottom: '-9.8vh' }}
      />

      {/* 3) Marca d'água do Cristo, atrás do texto */}
      <img
        src="/quemsomos/jesus.png"
        alt=""
        className="absolute left-0 top-[51%] w-[67%] h-auto pointer-events-none"
      />

      {/* 4) TÍTULO E TEXTO */}
      <div className="absolute inset-x-0 top-[39.3vh] z-10 flex flex-col items-center text-center px-6">
        <h1
          style={{ fontFamily: 'var(--font-asah)', fontSize: 'clamp(2rem, 11.6vw, 8rem)' }}
          className="uppercase text-[#8B1E31] leading-[1.02]"
        >
          Quem
          <br />
          Somos
        </h1>

        <p
          style={{ fontFamily: 'var(--font-regular)', fontSize: 'clamp(0.78rem, 3.52vw, 2.4rem)' }}
          className="text-[#2C0705] leading-[1.51] mt-[4.5vh] max-w-[20em]"
        >
          {TEXTO}
        </p>
      </div>

      {/* 5) BOTÕES SOBRE O ARCO BEGE */}
      <NavVoltarInicio hrefVoltar="/sobre-nos" className="absolute inset-x-0 bottom-[5.3vh] z-20" />

    </div>
  );
}
