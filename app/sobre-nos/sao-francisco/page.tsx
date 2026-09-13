// app/sobre-nos/sao-francisco/page.tsx
import { getPaginaSaoFrancisco } from '@/sanity/lib/getPaginaSaoFrancisco';
import { NavVoltarInicio } from '../_components/NavVoltarInicio';

export const revalidate = 60;

const PARAGRAFOS = [
  'Conhecido como o santo da paz e da fraternidade, São Francisco de Assis dedicou sua vida a seguir os ensinamentos de Jesus com alegria, humildade e profundo amor por todas as criaturas.',
  'Seu exemplo atravessa os séculos, inspirando homens e mulheres a viverem uma fé mais próxima, generosa e comprometida com o Evangelho.',
  'Neste Santuário, sua vida continua sendo um convite à conversão, à confiança em Deus e ao amor ao próximo.',
];

export default async function SaoFranciscoPage() {
  const pagina = await getPaginaSaoFrancisco();

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#222] select-none">

      {/* 1) FOTO (Sanity) — ocupa a tela toda */}
      {pagina?.imagemUrl ? (
        <img src={pagina.imagemUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-x-0 top-0 h-[24vh] bg-gray-300 flex items-center justify-center text-gray-600 text-center px-8">
          Cadastre a imagem desta página no Sanity (São Francisco)
        </div>
      )}

      {/* 2) Escurecido leve no topo, pra garantir leitura do texto branco
             mesmo se a foto cadastrada for mais clara */}
      <div
        className="absolute inset-x-0 top-0 h-[70vh] pointer-events-none z-[5]"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0))' }}
      />

      {/* 3) TÍTULO E TEXTO */}
      <div className="absolute inset-x-0 top-[5.9vh] z-10 flex flex-col items-center text-center px-[11%]">
        <h1
          style={{ fontFamily: 'var(--font-asah)', fontSize: 'clamp(2.2rem, 9.3vw, 6.7rem)' }}
          className="uppercase text-white leading-none"
        >
          São Francisco
        </h1>

        <div className="mt-[4.5vh]">
          {PARAGRAFOS.map((texto, i) => (
            <p
              key={i}
              style={{
                fontFamily: 'var(--font-regular)',
                fontSize: 'clamp(0.72rem, 3vw, 2.1rem)',
                marginTop: i === 0 ? 0 : '3.2vh',
              }}
              className="text-white leading-[1.42] max-w-[18.5em]"
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
