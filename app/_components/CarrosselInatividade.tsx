// app/_components/CarrosselInatividade.tsx
'use client';

import { useState, useEffect } from 'react';
import type { SlideCarrossel } from '@/sanity/lib/getConfigTotem';
import TelaEventos from './TelaEventos';

// Quanto tempo sem toque até o totem sair da tela atual.
// Vale para o Menu Inicial e para todas as páginas internas (ver ProtetorDeTela).
export const TEMPO_INATIVIDADE_MS = 20000;
// Quanto tempo cada imagem do carrossel fica na tela.
// Os dois são 20s de propósito: o usuário pediu o mesmo ritmo em todo o totem.
export const DURACAO_SLIDE_MS = 20000;

// Mesma altura dos botões Voltar/Início das telas internas
// (ALTURA_BOTAO em app/sobre-nos/_components/NavVoltarInicio.tsx), para a
// casinha aqui ter exatamente o mesmo tamanho que a das outras telas.
const ALTURA_BOTAO = 'clamp(3.1rem, 12.5vw, 8.6rem)';

// Carrossel exibido quando o totem fica 20s sem receber toque. Recebe os
// slides cadastrados no Sanity (campo "carrosselInatividade" em configTotem),
// sem limite de quantidade. Cada slide é uma imagem ou a tela de Eventos ao
// vivo (TelaEventos, sem os botões Voltar/Início).
export default function CarrosselInatividade({ slides }: { slides: SlideCarrossel[] }) {
  // O componente só é montado enquanto o carrossel está visível (tanto em
  // TotemClient quanto em ProtetorDeTela), então o índice já nasce em 0 a cada
  // vez que ele aparece — sem precisar de efeito para "resetar".
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const intervalo = setInterval(() => {
      setIndice((i) => (i + 1) % slides.length);
    }, DURACAO_SLIDE_MS);
    return () => clearInterval(intervalo);
  }, [slides.length]);

  return (
    <div className="relative w-full h-full">
      {slides.map((slide, i) => {
        const camada = `absolute inset-0 w-full h-full transition-opacity duration-1000 ${
          i === indice ? 'opacity-100' : 'opacity-0'
        }`;
        return slide.tipo === 'imagem' ? (
          <img key={slide.chave} src={slide.url} alt="" className={`${camada} object-cover`} />
        ) : (
          // `isolate`: os z-index de dentro da tela de Eventos ficam presos
          // nela e não disputam com a casinha nem com os outros slides.
          <div key={slide.chave} className={`${camada} isolate`}>
            <TelaEventos eventos={slide.eventos} fotoUrl={slide.fotoUrl} />
          </div>
        );
      })}

      {/* Indicação de toque: a mesma casinha dos botões "Início" das telas
          internas, no rodapé, para a pessoa entender que basta tocar para
          sair do carrossel.

          É SÓ indicação — `pointer-events-none` de propósito. Quem trata o
          toque é o listener no document (TotemClient em "/" e ProtetorDeTela
          nas demais rotas); se isto fosse um <Link>, o toque seria tratado
          duas vezes e o totem navegaria duas vezes. */}
      <div
        style={{ height: ALTURA_BOTAO }}
        className="absolute left-1/2 -translate-x-1/2 bottom-[4vh] z-10 aspect-[175/145] pointer-events-none animate-pulse"
      >
        <img
          src="/global/Retangulo%20da%20setinha.png"
          alt=""
          className="absolute inset-0 w-full h-full object-fill drop-shadow-lg"
        />
        <img
          src="/global/casa.png"
          alt="Toque para voltar ao início"
          className="absolute inset-0 m-auto w-[32%] h-auto object-contain"
        />
      </div>
    </div>
  );
}
