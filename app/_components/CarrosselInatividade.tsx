// app/_components/CarrosselInatividade.tsx
'use client';

import { useState, useEffect } from 'react';

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

// Carrossel de imagens exibido quando o totem fica 20s sem receber toque.
// Recebe as URLs cadastradas no Sanity (campo "carrosselInatividade" em
// configTotem) — sem limite de quantidade: o carrossel passa quantas a
// secretaria cadastrar.
export default function CarrosselInatividade({ imagens }: { imagens: string[] }) {
  // O componente só é montado enquanto o carrossel está visível (tanto em
  // TotemClient quanto em ProtetorDeTela), então o índice já nasce em 0 a cada
  // vez que ele aparece — sem precisar de efeito para "resetar".
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
