// app/TotemClient.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { ConfigTotem } from '../sanity/lib/getConfigTotem';

interface MenuItem {
  _id: string;
  titulo: string;
  iconeUrl?: string;
  rota?: string;
}

// Quanto tempo sem toque até sair do Menu (para o carrossel, ou direto para "Toque para Iniciar")
const TEMPO_INATIVIDADE_MS = 30000;
// Quanto tempo cada imagem do carrossel fica na tela
const DURACAO_SLIDE_MS = 6000;

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

        {/* Brasão: pomba com raios atrás, igreja na frente */}
        <div className="absolute inset-x-0 top-[26.1vh] z-[2] flex justify-center">
          <img src="/looping/espirito%20santo.png" alt="" className="w-[44.5%] h-auto" />
        </div>
        <div className="absolute inset-x-0 top-[37.5vh] z-[3] flex justify-center">
          <img src="/looping/santuario%20logo.png" alt="Santuário Divino Espírito Santo" className="w-[39.3%] h-auto" />
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
        <div className="h-[35%] sm:h-[45%] shrink-0 w-full bg-gray-300 relative shadow-md overflow-hidden">
          {config?.fotoSantuarioUrl ? (
            <img src={config.fotoSantuarioUrl} alt="Santuário" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">Foto do Santuário</div>
          )}
          
          {/* EFEITO DE LUZ BRANCA (Glow) NO EXTREMO CANTO */}
          {config?.logoSantuarioUrl && (
             // Usamos valores negativos maiores (-top-24 e -right-24) para empurrar o "miolo" da luz para a quina
             <div className="absolute -top-16 -right-16 sm:-top-24 sm:-right-24 w-48 h-48 sm:w-72 sm:h-72 bg-white/80 blur-[60px] rounded-full z-10 pointer-events-none"></div>
          )}

          {/* LOGO SOBREPOSTA NO EXTREMO CANTO DIREITO */}
          {config?.logoSantuarioUrl && (
             // Reduzimos de top-10/right-10 para top-4/right-4 para colar na borda
             <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20">
               <img src={config.logoSantuarioUrl} alt="Logo Santuário" className="h-12 sm:h-20 object-contain drop-shadow-xl" />
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
                <div className="w-28 h-28 sm:w-40 sm:h-40 flex items-center justify-center mb-2 sm:mb-4 relative transition-transform group-hover:scale-105">
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
                  style={{ fontFamily: 'var(--font-bold)' }}
                  className="text-[#5A3B2B] text-[10px] sm:text-base tracking-wide text-center uppercase"
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

// Carrossel de imagens exibido quando o totem fica 30s sem receber toque.
// Recebe até 8 URLs vindas do Sanity (campo "carrosselInatividade" em configTotem).
function CarrosselInatividade({ imagens }: { imagens: string[] }) {
  // O componente só existe na árvore enquanto o carrossel está visível (ver TotemClient acima),
  // então o índice já nasce em 0 a cada vez que ele aparece — sem precisar de efeito para "resetar".
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    if (imagens.length < 2) return;
    const intervalo = setInterval(() => {
      setIndice((i) => (i + 1) % imagens.length);
    }, DURACAO_SLIDE_MS);
    return () => clearInterval(intervalo);
  }, [imagens.length]);

  return (
    <div className="relative w-full h-full">
      {imagens.map((url, i) => (
        <img
          key={url + i}
          src={url}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            i === indice ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
}
