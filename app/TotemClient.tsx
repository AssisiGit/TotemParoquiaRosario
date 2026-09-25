// app/TotemClient.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { ConfigTotem } from '../sanity/lib/getConfigTotem';
import CarrosselInatividade, { TEMPO_INATIVIDADE_MS } from './_components/CarrosselInatividade';

interface MenuItem {
  _id: string;
  titulo: string;
  iconeUrl?: string;
  rota?: string;
}

type Tela = 'menu' | 'carrossel' | 'repouso';

// Quanto tempo, depois do toque no looping, a camada do looping continua
// recebendo os toques: é o fade de saída dela (duration-700) com folga.
const TRAVA_SAIDA_REPOUSO_MS = 800;

export default function TotemClient({ menuItens, config }: { menuItens: MenuItem[], config: ConfigTotem | null }) {
  const searchParams = useSearchParams();
  const veioDoInicio = searchParams.get('ativo') === 'true';

  const carrosselUrls = config?.carrosselUrls ?? [];
  const temCarrossel = carrosselUrls.length > 0;

  // 'menu' (interativo) -> 20s sem toque -> 'carrossel' (se houver imagens) ou 'repouso'
  // 'carrossel' -> toque -> 'repouso' (Toque para Iniciar)
  // 'repouso' -> toque -> 'menu'
  const [tela, setTela] = useState<Tela>(veioDoInicio ? 'menu' : 'repouso');

  // O menu leva 700ms para aparecer, mas já aceita toque desde o início do
  // fade. Um segundo toque apressado no looping abria a tela do botão que
  // estivesse por baixo, sem a pessoa nem ter visto o menu. Enquanto isto
  // está ligado, a camada do looping (sumindo) continua segurando os toques.
  const [saindoDoRepouso, setSaindoDoRepouso] = useState(false);

  // O handler de toque vive fora do render (listener no document) e lê a
  // tela atual por aqui.
  const telaRef = useRef<Tela>(tela);
  useEffect(() => {
    telaRef.current = tela;
  }, [tela]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let timerTrava: ReturnType<typeof setTimeout>;

    const iniciarTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        // Só sai do Menu por inatividade. Se já estiver em carrossel/repouso, o toque é quem manda.
        setTela((telaAtual) => (telaAtual === 'menu' ? (temCarrossel ? 'carrossel' : 'repouso') : telaAtual));
      }, TEMPO_INATIVIDADE_MS);
    };

    // Troca de tela SÓ no `click`. Um toque só dispara três eventos em
    // sequência (touchstart, mousedown emulado e click); quando os três
    // trocavam de tela, um toque no carrossel ia para o looping e, no mesmo
    // toque, do looping para o menu — o looping nem aparecia. O click vem
    // uma vez por toque e por último, já entregue à camada que estava
    // visível, então também não "vaza" para o botão do menu por baixo.
    const aoTocar = () => {
      if (telaRef.current === 'repouso') {
        setSaindoDoRepouso(true);
        clearTimeout(timerTrava);
        timerTrava = setTimeout(() => setSaindoDoRepouso(false), TRAVA_SAIDA_REPOUSO_MS);
      }
      setTela((telaAtual) => {
        if (telaAtual === 'repouso') return 'menu';       // Toque para Iniciar -> Menu
        if (telaAtual === 'carrossel') return 'repouso';  // Carrossel -> Toque para Iniciar
        return 'menu';                                    // Já está no Menu, só reinicia o timer
      });
      iniciarTimer();
    };

    // Qualquer encostar de dedo (inclusive arrastar uma lista, que não gera
    // click) mantém o totem acordado.
    const eventosTimer = ['pointerdown', 'touchstart'];
    eventosTimer.forEach((evento) => document.addEventListener(evento, iniciarTimer));
    document.addEventListener('click', aoTocar);
    iniciarTimer();

    return () => {
      clearTimeout(timer);
      clearTimeout(timerTrava);
      eventosTimer.forEach((evento) => document.removeEventListener(evento, iniciarTimer));
      document.removeEventListener('click', aoTocar);
    };
  }, [temCarrossel]);

  return (
    <div className="relative w-full h-screen bg-[#F7F5EB] overflow-hidden select-none">

      {/* TELA 1: DESCANSO / TOQUE PARA INICIAR
          Montada com os recortes reais de public/looping. Cada bloco é
          posicionado por `top` em vh, na mesma proporção do design — por isso
          não usa fluxo/margens aqui. */}
      <div
        className={`absolute inset-0 z-50 bg-[#F7F5EB] overflow-hidden transition-opacity duration-700 cursor-pointer ${
          tela === 'repouso' ? 'opacity-100' : 'opacity-0'
        } ${tela === 'repouso' || saindoDoRepouso ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        {/* Divino Espírito Santo em traço claro, atrás de tudo (mesmo recorte
            usado em Avisos e Redes Sociais) */}
        <img
          src="/avisos/vetor%20divino%20espirito.png"
          alt=""
          className="absolute left-1/2 -translate-x-1/2 top-[1.2vh] w-full h-auto z-0 pointer-events-none"
        />

        {/* TAU: 7.6vw (~82px) no mockup — estava 5.2vw, ~30% menor */}
        <div className="absolute inset-x-0 top-[8.1vh] z-[2] flex justify-center">
          <img src="/dizimo/TAU.png" alt="" style={{ width: '7.6vw' }} className="h-auto" />
        </div>

        <div
          style={{ fontFamily: 'var(--font-bold)', fontSize: 'clamp(1.2rem, 5.36vw, 3.86rem)' }}
          className="absolute inset-x-0 top-[17.3vh] z-[2] text-center text-[#491F14] leading-[1.2]"
        >
          Seja bem-vindo(a) ao
        </div>

        {/* Brasão: raios atrás, igreja na frente — três camadas empilhadas.

            Os dois recortes foram desenhados para se encaixar: a parte de
            baixo de `espirito santo.png` tem um vão no formato exato da
            igreja, com uma folga uniforme em volta. O encaixe só acontece numa escala e numa
            posição: a igreja desenhada a 120% da escala dos raios, 94px (do
            arquivo dos raios) para a esquerda e 552px para baixo. Tirado do
            mockup e conferido pela folga, que dá ~20px constantes em volta
            da torre da esquerda e da ala da direita.

            Por isso a igreja fica DENTRO da caixa dos raios, com tudo em %
            da própria caixa (left/width da largura, top da altura): as duas
            peças escalam juntas e não se desencaixam em tela nenhuma. Antes
            cada uma tinha o seu `top` em vh e a sua largura em %, a igreja
            estava 13% pequena demais em relação aos raios e nenhum ajuste
            de posição resolvia.

            Os números de fora vêm do mockup: raios com 36,6% da largura da
            tela, começando em 24,6vh. No mockup o brasão não fica centrado
            pela caixa: a pomba está ~14px à direita do eixo da tela (e a
            igreja ~7px à esquerda), por isso `left-[33%]` e não um
            `justify-center`. */}
        <div className="absolute left-[33%] top-[24.6vh] w-[36.6%] z-[2]">
          <img src="/looping/espirito%20santo.png" alt="" className="block w-full h-auto" />

          {/* Preenchimento creme da igreja: as paredes do traço são vazadas
              e sem isso o traço claro do fundo aparece por dentro do prédio.
              Este arquivo NÃO é arte nova: é a silhueta do próprio
              `santuario logo.png`, com o miolo fechado, pintada na cor de
              fundo (#F7F5EB). Foi gerado assim, e dá para refazer a qualquer
              momento:

              magick "santuario logo.png" -alpha extract -threshold 40% m.png
              magick m.png -morphology Close Disk:10 f.png
              magick f.png -bordercolor black -border 1 -fill white \
                     -draw 'color 0,0 floodfill' -shave 1x1 o.png
              magick f.png o.png -compose Difference -composite -negate \
                     -threshold 50% d.png
              magick m.png d.png -compose Lighten -composite s.png
              magick -size 846x726 xc:"#F7F5EB" s.png -alpha off \
                     -compose CopyOpacity -composite "santuario logo preenchido.png"

              Se o designer mandar a versão da igreja já com o fundo creme
              embutido, é só trocar por ela e apagar esta camada.

              `max-w-none` é obrigatório nas duas camadas da igreja: ela é
              mais larga que a caixa (109,9%) e o `max-width: 100%` que o
              Tailwind põe em todo <img> a encolheria sem avisar. */}
          <img
            src="/looping/santuario%20logo%20preenchido.png"
            alt=""
            className="absolute max-w-none h-auto"
            style={{ left: '-10.2%', top: '52.8%', width: '109.9%' }}
          />
          <img
            src="/looping/santuario%20logo.png"
            alt="Santuário Divino Espírito Santo"
            className="absolute max-w-none h-auto"
            style={{ left: '-10.2%', top: '52.8%', width: '109.9%' }}
          />
        </div>

        {/* Marca escrita. Tamanhos e espaços medidos no mockup em 23/09/2026:
            "SANTUÁRIO" começa ~10px abaixo da base da igreja.

            Os dois `-translate-x` não são engano: no mockup a linha
            "····· VILA VELHA | ES ·····" fica ~15px à esquerda do eixo e a
            lente ~6px, enquanto SANTUÁRIO e DIVINO ESPÍRITO SANTO estão
            centrados. Para centralizar, é só tirar os dois. */}
        <div className="absolute inset-x-0 top-[56.8vh] z-[4] flex flex-col items-center">
          <img src="/looping/santuario.png" alt="" className="w-[66.6%] h-auto" />
          <img src="/looping/divino%20espirito%20santo.png" alt="" className="w-[63.2%] h-auto mt-[0.6vh]" />
          <img src="/looping/vila%20velha%20espirito%20santo.png" alt="" className="w-[51.6%] h-auto mt-[0.87vh] -translate-x-[1.4vw]" />
          {/* Lente dourada (`sublinhado.png`). Ela estava sem uso no projeto:
              numa auditoria anterior eu concluí que não aparecia no mockup, e
              estava errado — no mockup ela fecha a marca, logo abaixo de
              "VILA VELHA | ES". */}
          <img src="/looping/sublinhado.png" alt="" className="w-[33%] h-auto mt-[1.07vh] -translate-x-[0.6vw]" />
        </div>

        {/* Chamada para o toque. O pulsar fica só aqui, para o brasão não piscar. */}
        <div
          style={{ fontFamily: 'var(--font-bold)', fontSize: 'clamp(1.5rem, 6.72vw, 4.84rem)' }}
          className="absolute inset-x-0 top-[78.9vh] z-[2] text-center text-[#491F14] leading-[1.2] animate-pulse"
        >
          Toque para Iniciar
        </div>
        <div className="absolute inset-x-0 top-[86vh] z-[2] flex justify-center animate-pulse">
          <div
            className="aspect-square rounded-full flex items-center justify-center"
            style={{ width: '7vw', border: '0.55vw solid #C49334' }}
          >
            <div className="w-[46%] h-[46%] rounded-full bg-[#C49334]" />
          </div>
        </div>
      </div>

      {/* TELA 1B: CARROSSEL DE INATIVIDADE (aparece antes do "Toque para Iniciar", só se houver imagens no Sanity) */}
      <div
        className={`absolute inset-0 z-40 bg-black transition-opacity duration-700 cursor-pointer ${
          tela === 'carrossel' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Só montamos o carrossel quando ele está de fato visível: assim ele sempre reinicia do slide 1 */}
        {tela === 'carrossel' && temCarrossel && <CarrosselInatividade imagens={carrosselUrls} />}
      </div>

      {/* TELA 2: MENU INICIAL (INTERATIVO) */}
      <div className={`w-full h-full flex flex-col transition-opacity duration-700 ${tela === 'menu' ? 'opacity-100' : 'opacity-0'}`}>
        
{/* CABEÇALHO COM A FOTO DO SANTUÁRIO */}
        <div className="h-[35%] sm:h-[39%] shrink-0 w-full bg-gray-300 relative shadow-md overflow-hidden">
          {config?.fotoSantuarioUrl ? (
            <img src={config.fotoSantuarioUrl} alt="Santuário" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">Foto do Santuário</div>
          )}
          
          {/* EFEITO DE LUZ BRANCA (Glow) NO EXTREMO CANTO */}
          {config?.logoSantuarioUrl && (
             // Usamos valores negativos maiores (-top-24 e -right-24) para empurrar o "miolo" da luz para a quina
             <div className="absolute -top-16 -right-16 sm:-top-[13vw] sm:-right-[13vw] w-48 h-48 sm:w-[40vw] sm:h-[40vw] bg-white/80 blur-[60px] rounded-full z-10 pointer-events-none"></div>
          )}

          {/* LOGO SOBREPOSTA NO EXTREMO CANTO DIREITO */}
          {config?.logoSantuarioUrl && (
             // Reduzimos de top-10/right-10 para top-4/right-4 para colar na borda
             <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20">
               <img
                 src={config.logoSantuarioUrl}
                 alt="Logo Santuário"
                 // Altura em vw (e não px fixos) para a logo crescer junto com a tela do totem
                 style={{ height: 'clamp(3rem, 13.5vw, 18rem)' }}
                 className="object-contain drop-shadow-xl"
               />
             </div>
          )}
          
          {/* Degradê inferior da foto (Ajustado com a nova cor de fundo #F7F5EB) */}
          <div className="absolute inset-x-0 bottom-0 h-24 sm:h-32 bg-gradient-to-t from-[#F7F5EB] to-transparent z-10"></div>
        </div>

        {/* ÁREA DOS BOTÕES */}
        {/* A Mágica 2: 'overflow-y-auto' permite rolar a tela se a tela for pequena */}
        <div className="flex-1 overflow-y-auto bg-[#F7F5EB] pt-8 sm:pt-10 px-4 sm:px-6 pb-24 flex flex-col items-center relative">
          
      {/* Marca d'água de fundo atrás dos botões */}
          {config?.marcaDaguaUrl && (
            <div 
              // Removi o bg-cover e bg-center daqui para controlarmos ali embaixo
              className="absolute inset-0 opacity-200 pointer-events-none bg-no-repeat"
              style={{ 
                backgroundImage: `url(${config.marcaDaguaUrl})`,
                backgroundPosition: 'center 80%', // 👈 AQUI ESTÁ O SEGREDO!
                backgroundSize: '90%' // 👈 Controla o tamanho da imagem na tela
              }}
            ></div>
          )}

          <h2
            style={{ fontFamily: 'var(--font-asah)', fontSize: 'clamp(1.6rem, 7vw, 5rem)' }}
            className="text-[#8B1E31] mb-8 sm:mb-12 uppercase tracking-[0.06em] leading-[1.1] relative z-10"
          >
            Menu Inicial
          </h2>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-2 gap-y-6 sm:gap-x-6 sm:gap-y-10 w-full max-w-4xl justify-items-center relative z-10">
            {menuItens.map((item) => (
              <Link 
                href={item.rota || '#'} 
                key={item._id} 
                className="flex flex-col items-center group active:scale-95 transition-transform cursor-pointer"
              >
                {/* Imagens levemente menores no celular (w-28), mas grandes no Totem (sm:w-40) */}
                <div className="w-28 h-28 sm:w-[17.5vw] sm:h-[17.5vw] flex items-center justify-center mb-2 sm:mb-[1.4vh] relative transition-transform group-hover:scale-105">
                   {item.iconeUrl ? (
                      <img 
                        src={item.iconeUrl} 
                        alt={item.titulo} 
                        className="w-full h-full object-contain drop-shadow-xl" 
                      />
                   ) : (
                      <span className="text-gray-400 text-sm">Sem Ícone</span>
                   )}
                </div>
                
                <span
                  style={{ fontFamily: 'var(--font-bold)', fontSize: 'clamp(0.625rem, 2.96vw, 4rem)' }}
                  className="text-[#5A3B2B] tracking-wide text-center uppercase leading-tight"
                >
                  {item.titulo}
                </span>
              </Link>
            ))} 
          </div>

        </div>
      </div>
    </div>
  );
}
