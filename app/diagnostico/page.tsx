// app/diagnostico/page.tsx
'use client';

// Página de diagnóstico do totem — NÃO faz parte do menu, é ferramenta de
// instalação. Abra http://<endereco-do-totem>/diagnostico na própria TV para
// descobrir o tamanho que o navegador daquele aparelho realmente reporta.
//
// O painel da TV ser 4K não decide nada sozinho: quem define o tamanho que o
// CSS enxerga é o navegador. O design do totem foi feito para 1080x1920.
//
// Fica de fora do protetor de tela (ver ProtetorDeTela), senão a página sumiria
// sozinha em 30s no meio da leitura.

import { useEffect, useState } from 'react';

interface Medidas {
  larguraCss: number;
  alturaCss: number;
  dpr: number;
  telaLargura: number;
  telaAltura: number;
  tituloPx: number;
}

export default function DiagnosticoPage() {
  const [m, setM] = useState<Medidas | null>(null);

  useEffect(() => {
    const medir = () => {
      // Referência: é o mesmo clamp() do título da tela de Missas. Se ele
      // travar no limite máximo, toda a tipografia do totem trava junto.
      const sonda = document.getElementById('sonda-titulo');
      setM({
        larguraCss: window.innerWidth,
        alturaCss: window.innerHeight,
        dpr: window.devicePixelRatio,
        telaLargura: window.screen.width,
        telaAltura: window.screen.height,
        tituloPx: sonda ? parseFloat(getComputedStyle(sonda).fontSize) : 0,
      });
    };
    medir();
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, []);

  // Proporção do design: 1080x1920 = 0.5625
  const proporcao = m ? m.larguraCss / m.alturaCss : 0;
  const proporcaoOk = Math.abs(proporcao - 0.5625) < 0.03;
  // O clamp do título pede 10.1vw. Se o valor aplicado ficar bem abaixo disso,
  // é porque bateu no limite máximo e a tipografia encolheu em proporção.
  const tituloVw = m && m.larguraCss ? (m.tituloPx / m.larguraCss) * 100 : 0;
  const tipografiaOk = tituloVw > 9.5;
  // Navegador fora de tela cheia come altura (barra de endereço, abas...).
  const telaCheia = m && m.telaAltura ? m.alturaCss >= m.telaAltura * 0.95 : true;

  const tudoOk = proporcaoOk && tipografiaOk && telaCheia;

  return (
    <div className="min-h-screen w-full bg-[#F7F5EB] text-[#491F14] px-[6%] py-[4vh] select-none">
      {/* Sonda invisível que carrega o mesmo clamp() dos títulos do totem */}
      <span
        id="sonda-titulo"
        aria-hidden
        className="absolute opacity-0 pointer-events-none"
        style={{ fontFamily: 'var(--font-asah)', fontSize: 'clamp(2.5rem, 10.1vw, 7.27rem)' }}
      >
        A
      </span>

      <h1
        style={{ fontFamily: 'var(--font-asah)', fontSize: 'clamp(1.8rem, 7vw, 5rem)' }}
        className="text-[#8B1E31] uppercase leading-none"
      >
        Diagnóstico do Totem
      </h1>

      {!m ? (
        <p style={{ fontFamily: 'var(--font-regular)' }} className="mt-[3vh]">
          Medindo...
        </p>
      ) : (
        <div style={{ fontFamily: 'var(--font-regular)', fontSize: 'clamp(0.9rem, 3.4vw, 2.4rem)' }} className="mt-[3vh]">
          <Linha rotulo="Tamanho que o navegador enxerga" valor={`${m.larguraCss} x ${m.alturaCss}`} destaque />
          <Linha rotulo="Design do totem foi feito para" valor="1080 x 1920" />
          <Linha rotulo="Densidade de pixel (DPR)" valor={String(m.dpr)} />
          <Linha
            rotulo="Resolução física da tela"
            valor={m.telaAltura ? `${m.telaLargura} x ${m.telaAltura}` : 'não informada pelo navegador'}
          />
          <Linha rotulo="Proporção" valor={`${proporcao.toFixed(3)} (o design pede 0.563)`} />
          <Linha rotulo="Tamanho aplicado ao título" valor={`${m.tituloPx.toFixed(0)}px = ${tituloVw.toFixed(1)}vw (o design pede 10.1vw)`} />

          <div
            className="mt-[4vh] rounded-[2vw] px-[5%] py-[3vh]"
            style={{ background: tudoOk ? '#1E6B3A' : '#8B1E31', color: '#F7F5EB' }}
          >
            <p style={{ fontFamily: 'var(--font-bold)', fontSize: 'clamp(1.1rem, 4.6vw, 3.3rem)' }} className="leading-tight">
              {tudoOk ? 'Encaixe perfeito — nada a ajustar.' : 'Precisa de ajuste:'}
            </p>
            {!tudoOk && (
              <ul style={{ fontFamily: 'var(--font-regular)', fontSize: 'clamp(0.85rem, 3.2vw, 2.3rem)' }} className="mt-[1.5vh] list-disc pl-[1.2em] leading-snug">
                {!telaCheia && (
                  <li>
                    O navegador não está em tela cheia: sobram {m.telaAltura - m.alturaCss}px de
                    altura comidos pela barra. Use F11 ou o modo quiosque.
                  </li>
                )}
                {!proporcaoOk && (
                  <li>
                    A tela não está na proporção 9:16 do design. Confira se a TV está em
                    modo retrato e se o aparelho está enviando a imagem girada.
                  </li>
                )}
                {!tipografiaOk && (
                  <li>
                    A tipografia está travando no limite: o título sai com {tituloVw.toFixed(1)}vw
                    em vez de 10.1vw. Passe estes números para o Claude levantar os limites dos clamp().
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Linha({ rotulo, valor, destaque = false }: { rotulo: string; valor: string; destaque?: boolean }) {
  return (
    <div className="flex flex-wrap justify-between gap-x-4 border-b border-[#491F14]/15 py-[1.2vh]">
      <span className="text-[#7A5B4B]">{rotulo}</span>
      <span style={{ fontFamily: destaque ? 'var(--font-bold)' : 'var(--font-medium)' }}>{valor}</span>
    </div>
  );
}
