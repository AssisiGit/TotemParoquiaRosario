// app/TotemClient.tsx
'use client';

import { useState, useEffect } from 'react';
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

export default function TotemClient({ menuItens, config }: { menuItens: MenuItem[], config: ConfigTotem | null }) {
  const searchParams = useSearchParams();
  const veioDoInicio = searchParams.get('ativo') === 'true';

  const carrosselUrls = config?.carrosselUrls ?? [];
  const temCarrossel = carrosselUrls.length > 0;

  // 'menu' (interativo) -> 30s sem toque -> 'carrossel' (se houver imagens) ou 'repouso'
  // 'carrossel' -> toque -> 'repouso' (Toque para Iniciar)
  // 'repouso' -> toque -> 'menu'
  const [tela, setTela] = useState<Tela>(veioDoInicio ? 'menu' : 'repouso');

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const iniciarTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        // Só sai do Menu por inatividade. Se já estiver em carrossel/repouso, o toque é quem manda.
        setTela((telaAtual) => (telaAtual === 'menu' ? (temCarrossel ? 'carrossel' : 'repouso') : telaAtual));
      }, TEMPO_INATIVIDADE_MS);
    };

    const interacaoUsuario = () => {
      setTela((telaAtual) => {
        if (telaAtual === 'repouso') return 'menu';       // Toque para Iniciar -> Menu
        if (telaAtual === 'carrossel') return 'repouso';  // Carrossel -> Toque para Iniciar
        return 'menu';                                    // Já está no Menu, só reinicia o timer
      });
      iniciarTimer();
    };

    const eventos = ['touchstart', 'mousedown', 'click'];
    eventos.forEach((evento) => document.addEventListener(evento, interacaoUsuario));
    iniciarTimer();

    return () => {
      clearTimeout(timer);
      eventos.forEach((evento) => document.removeEventListener(evento, interacaoUsuario));
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
          tela === 'repouso' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Divino Espírito Santo em traço claro, atrás de tudo (mesmo recorte
            usado em Avisos e Redes Sociais) */}
        <img
          src="/avisos/vetor%20divino%20espirito.png"
          alt=""
          className="absolute left-1/2 -translate-x-1/2 top-[1.2vh] w-full h-auto z-0 pointer-events-none"
        />

        <div className="absolute inset-x-0 top-[9.3vh] z-[2] flex justify-center">
          <img src="/dizimo/TAU.png" alt="" style={{ width: '5.2vw' }} className="h-auto" />
        </div>

        <div
          style={{ fontFamily: 'var(--font-bold)', fontSize: 'clamp(1.2rem, 5.36vw, 3.86rem)' }}
          className="absolute inset-x-0 top-[17.3vh] z-[2] text-center text-[#491F14] leading-[1.2]"
        >
          Seja bem-vindo(a) ao
        </div>

        {/* Brasão: pomba com raios atrás, igreja na frente.
            `santuario logo.png` é só o traço da igreja — 68% do arquivo é
            transparente (as paredes são vazadas), então os raios apareciam
            atravessando o prédio e os dois recortes não liam como uma peça só.
            A máscara abaixo dissolve os raios na altura em que a nave começa
            (49% da altura da igreja), que é onde o mockup também os corta:
            eles abrem entre as torres e somem antes do corpo do prédio. */}
        <div className="absolute inset-x-0 top-[26.1vh] z-[2] flex justify-center">
          <img
            src="/looping/espirito%20santo.png"
            alt=""
            className="w-[44.5%] h-auto"
            style={{
              WebkitMaskImage: 'linear-gradient(to bottom, black 71%, transparent 78%)',
              maskImage: 'linear-gradient(to bottom, black 71%, transparent 78%)',
            }}
          />
        </div>
        <div className="absolute inset-x-0 top-[36.1vh] z-[3] flex justify-center">
          <img src="/looping/santuario%20logo.png" alt="Santuário Divino Espírito Santo" className="w-[42.2%] h-auto" />
        </div>

        {/* Marca escrita */}
        <div className="absolute inset-x-0 top-[58.7vh] z-[4] flex flex-col items-center">
          <img src="/looping/santuario.png" alt="" className="w-[64.4%] h-auto" />
          <img src="/looping/divino%20espirito%20santo.png" alt="" className="w-[63.2%] h-auto mt-[0.3vh]" />
          <img src="/looping/vila%20velha%20espirito%20santo.png" alt="" className="w-[50.4%] h-auto mt-[0.35vh]" />
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
