// app/_components/ProtetorDeTela.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import CarrosselInatividade, { TEMPO_INATIVIDADE_MS } from './CarrosselInatividade';

// Protetor de tela do totem, montado no layout — ou seja, vale em TODAS as
// páginas internas (Missas, Avisos, Sobre Nós, ...). Se o visitante sair do
// totem no meio da navegação, depois de 20s sem toque a tela passa a exibir
// o carrossel de avisos cadastrado no Sanity. O toque seguinte devolve o
// totem para a tela inicial ("Toque para Iniciar"), pronto para a próxima
// pessoa.
//
// Duas rotas ficam de fora:
//  - "/"        → o Menu Inicial tem a própria máquina de estados
//                 (menu -> carrossel -> "Toque para Iniciar") em TotemClient,
//                 e dois donos do mesmo timer brigariam entre si;
//  - "/studio"  → é o painel de edição do Sanity, não é tela de totem;
//                 ninguém quer o carrossel cobrindo o formulário no meio de
//                 um cadastro;
//  - "/diagnostico" → ferramenta de instalação, some sozinha se o protetor
//                 entrar no meio da leitura dos números.
export default function ProtetorDeTela({ imagens }: { imagens: string[] }) {
  const pathname = usePathname();
  const router = useRouter();

  const [mostrando, setMostrando] = useState(false);
  // O handler de toque roda fora do ciclo de render (listener no document),
  // então ele lê a visibilidade por ref para nunca pegar valor velho.
  const mostrandoRef = useRef(false);

  const ativo =
    pathname !== '/' && !pathname.startsWith('/studio') && pathname !== '/diagnostico';
  const temCarrossel = imagens.length > 0;

  useEffect(() => {
    const mostrar = (visivel: boolean) => {
      mostrandoRef.current = visivel;
      setMostrando(visivel);
    };

    // Ao trocar de rota o protetor recomeça do zero.
    mostrar(false);
    if (!ativo) return;

    let timer: ReturnType<typeof setTimeout>;

    const iniciarTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        // Sem imagens cadastradas no Sanity não há o que passar: nesse caso o
        // totem volta direto para a tela inicial.
        if (temCarrossel) mostrar(true);
        else router.push('/');
      }, TEMPO_INATIVIDADE_MS);
    };

    const interacaoUsuario = () => {
      if (mostrandoRef.current) {
        // Toque durante o carrossel: volta para o início. Não reinicia o
        // timer — daqui em diante quem manda é a tela inicial.
        mostrar(false);
        clearTimeout(timer);
        router.push('/');
        return;
      }
      iniciarTimer();
    };

    const eventos = ['touchstart', 'mousedown', 'click'];
    eventos.forEach((evento) => document.addEventListener(evento, interacaoUsuario));
    iniciarTimer();

    return () => {
      clearTimeout(timer);
      eventos.forEach((evento) => document.removeEventListener(evento, interacaoUsuario));
    };
  }, [ativo, pathname, temCarrossel, router]);

  if (!ativo) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black transition-opacity duration-700 cursor-pointer ${
        mostrando ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Só montamos o carrossel enquanto ele está de fato visível: assim ele
          sempre reinicia do slide 1. */}
      {mostrando && temCarrossel && <CarrosselInatividade imagens={imagens} />}
    </div>
  );
}
