// sanity/lib/getPaginaPrimeiraVez.ts
// Busca a imagem única da página "Primeira Vez Aqui".

import { client } from './client';

export interface PaginaPrimeiraVez {
  imagemUrl?: string;
}

const QUERY = `*[_type == "paginaPrimeiraVez"][0] {
  "imagemUrl": imagem.asset->url
}`;

export async function getPaginaPrimeiraVez(): Promise<PaginaPrimeiraVez | null> {
  try {
    return await client.fetch(QUERY);
  } catch (error) {
    console.error('Erro ao buscar paginaPrimeiraVez:', error);
    return null;
  }
}
