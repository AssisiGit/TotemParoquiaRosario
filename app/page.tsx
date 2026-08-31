// app/page.tsx
import { Suspense } from 'react';
import { client } from '../sanity/lib/client'; 
import TotemClient from './TotemClient';

// Atualiza o cache do totem a cada 60 segundos se houver mudanças
export const revalidate = 60; 

async function getMenuTotem() {
  // Busca os botões ordenados pelo número e já extrai a URL da imagem
  const query = `*[_type == "menuTotem"] | order(ordem asc) {
    _id,
    titulo,
    "iconeUrl": icone.asset->url,
    rota
  }`;
  
  try {
    const dados = await client.fetch(query);
    return dados;
  } catch (error) {
    console.error("Erro ao buscar o menu do totem no Sanity:", error);
    return [];
  }
}

export default async function Page() {
  // Puxa os dados da função acima
  const menuItens = await getMenuTotem();
  
  // Envia a lista para a tela do Totem renderizar
  return (
<Suspense fallback={<div className="w-full h-screen bg-[#FDFBF7] flex items-center justify-center text-[#8B1E31] text-2xl">Carregando Totem...</div>}>
      <TotemClient menuItens={menuItens} />
    </Suspense>
  );
}