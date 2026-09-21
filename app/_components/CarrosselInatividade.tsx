// app/_components/CarrosselInatividade.tsx
'use client';

import { useState, useEffect } from 'react';

// Quanto tempo sem toque até o totem sair da tela atual.
// Vale para o Menu Inicial e para todas as páginas internas (ver ProtetorDeTela).
export const TEMPO_INATIVIDADE_MS = 30000;
// Quanto tempo cada imagem do carrossel fica na tela
export const DURACAO_SLIDE_MS = 6000;

// Carrossel de imagens exibido quando o totem fica 30s sem receber toque.
// Recebe até 8 URLs vindas do Sanity (campo "carrosselInatividade" em configTotem).
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
    </div>
  );
}
