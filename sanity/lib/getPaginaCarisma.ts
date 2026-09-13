// sanity/lib/getPaginaCarisma.ts
// Busca a imagem única da página "Carisma".

import { client } from './client';

export interface PaginaCarisma {
  imagemUrl?: string;
}

const QUERY = `*[_type == "paginaCarisma"][0] {
  "imagemUrl": imagem.asset->url
}`;

export async function getPaginaCarisma(): Promise<PaginaCarisma | null> {
  try {
    return await client.fetch(QUERY);
  } catch (error) {
    console.error('Erro ao buscar paginaCarisma:', error);
    return null;
  }
}
