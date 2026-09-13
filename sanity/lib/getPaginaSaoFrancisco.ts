// sanity/lib/getPaginaSaoFrancisco.ts
// Busca a imagem única da página "São Francisco".

import { client } from './client';

export interface PaginaSaoFrancisco {
  imagemUrl?: string;
}

const QUERY = `*[_type == "paginaSaoFrancisco"][0] {
  "imagemUrl": imagem.asset->url
}`;

export async function getPaginaSaoFrancisco(): Promise<PaginaSaoFrancisco | null> {
  try {
    return await client.fetch(QUERY);
  } catch (error) {
    console.error('Erro ao buscar paginaSaoFrancisco:', error);
    return null;
  }
}
