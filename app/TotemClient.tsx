'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'; // 👈 Importe isso

interface MenuItem {
  _id: string;
  titulo: string;
  iconeUrl?: string;
  rota?: string;
}

export default function TotemClient({ menuItens }: { menuItens: MenuItem[] }) {
  const searchParams = useSearchParams();
  const veioDoInicio = searchParams.get('ativo') === 'true';

  // Se veio do botão início, já começa com inativo = false (tela interativa aberta)
  const [inativo, setInativo] = useState(!veioDoInicio);

  // Lógica de inatividade (60 Segundos)
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const interacaoUsuario = () => {
      setInativo(false); 
      clearTimeout(timer); 
      timer = setTimeout(() => {
        setInativo(true); 
      }, 60000); 
    };

    const eventos = ['touchstart', 'mousedown', 'click'];
    eventos.forEach((evento) => document.addEventListener(evento, interacaoUsuario));

    return () => {
      clearTimeout(timer);
      eventos.forEach((evento) => document.removeEventListener(evento, interacaoUsuario));
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#FDFBF7] overflow-hidden select-none">
      
      {/* TELA 1: DESCANSO / LOOPING */}
      <div 
        className={`absolute inset-0 z-50 bg-[#FDFBF7] flex flex-col items-center justify-center transition-opacity duration-700 cursor-pointer ${
          inativo ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 opacity-10 bg-[url('/fundo-marca-dagua.png')] bg-cover bg-center"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center px-8">
          <p className="text-2xl font-bold text-[#5A3B2B] mb-6 uppercase tracking-widest">
            Seja bem-vindo(a) ao
          </p>
          
          <div className="w-64 h-64 bg-gray-200 rounded-lg mb-8 flex items-center justify-center border-4 border-[#C79C45]">
            <span className="text-gray-500">Sua Logo Aqui</span>
          </div>

          <h1 className="text-5xl font-serif font-bold text-[#8B1E31] mb-2 uppercase tracking-wide">
            Paróquia
          </h1>
          <p className="text-xl text-[#5A3B2B] tracking-widest mb-16">
            ••••• NOME DA PARÓQUIA •••••
          </p>

          <div className="animate-pulse flex flex-col items-center">
            <p className="text-4xl font-bold text-[#5A3B2B] mb-6">Toque para Iniciar</p>
            <div className="w-12 h-12 rounded-full border-4 border-[#C79C45] bg-[#C79C45]/20 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-[#C79C45]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* TELA 2: MENU INICIAL (INTERATIVO) */}
      <div className={`w-full h-full flex flex-col transition-opacity duration-700 ${inativo ? 'opacity-0' : 'opacity-100'}`}>
        
        <div className="h-[35%] w-full bg-gray-300 relative shadow-md">
          <img src="https://via.placeholder.com/800x400" alt="Igreja" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        <div className="flex-1 bg-[#FDFBF7] pt-10 px-6 pb-12 flex flex-col items-center">
          <h2 className="text-4xl font-serif font-bold text-[#8B1E31] mb-12 uppercase tracking-widest">
            Menu Inicial
          </h2>

          {/* Restaurei a DIV da Grade (Grid) aqui para alinhar os botões lado a lado */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-6 gap-y-10 w-full max-w-4xl justify-items-center">
            {menuItens.map((item) => (
              
              <Link 
                href={item.rota || '#'} 
                key={item._id} 
                className="flex flex-col items-center group active:scale-95 transition-transform cursor-pointer"
              >
                
                <div className="w-24 h-32 sm:w-28 sm:h-36 bg-[#4A3022] rounded-t-full rounded-b-xl border-[3px] border-[#C79C45] flex items-center justify-center shadow-lg mb-4 relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-t-full"></div>
                   
                   {/* Renderiza a imagem que a secretaria subiu no Sanity */}
                   {item.iconeUrl ? (
                      <img src={item.iconeUrl} alt={item.titulo} className="w-14 h-14 object-contain relative z-10 drop-shadow-md" />
                   ) : (
                      <span className="text-white relative z-10 text-sm">Sem Ícone</span>
                   )}
                </div>
                
                <span className="text-[#5A3B2B] font-bold text-sm sm:text-base tracking-wide text-center uppercase">
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