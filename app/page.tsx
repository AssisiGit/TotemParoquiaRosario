// app/page.tsx
import { Suspense } from 'react';
import { client } from '../sanity/lib/client'; 
import { getConfigTotem } from '../sanity/lib/getConfigTotem';
import TotemClient from './TotemClient';

export const revalidate = 60; 

async function getMenuTotem() {
  const query = `*[_type == "menuTotem"] | order(ordem asc) {
    _id,
    titulo,
    "iconeUrl": icone.asset->url,
    rota
  }`;
  try {
    return await client.fetch(query);
  } catch (error) {
    return [];
  }
}

export default async function Page() {
  const menuItens = await getMenuTotem();
  const configTotem = await getConfigTotem(); // Puxa as configs do Sanity (mesmas de todas as telas)
  
  return (
    <Suspense fallback={<div className="w-full h-screen bg-[#FDFBF7] flex items-center justify-center text-[#8B1E31] text-2xl">Carregando Totem...</div>}>
      {/* Passamos as configurações como uma nova propriedade para a tela visual */}
      <TotemClient menuItens={menuItens} config={configTotem} />
    </Suspense>
  );
}
