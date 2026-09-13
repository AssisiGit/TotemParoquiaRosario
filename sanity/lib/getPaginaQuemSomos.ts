// sanity/lib/getPaginaQuemSomos.ts
// Busca a imagem única da página "Quem Somos".

import { client } from './client';

export interface PaginaQuemSomos {
  imagemUrl?: string;
}

const QUERY = `*[_type == "paginaQuemSomos"][0] {
  "imagemUrl": imagem.asset->url
}`;

export async function getPaginaQuemSomos(): Promise<PaginaQuemSomos | null> {
  try {
    return await client.fetch(QUERY);
  } catch (error) {
    console.error('Erro ao buscar paginaQuemSomos:', error);
    return null;
  }
}
