// sanity/lib/getPaginaFraternidade.ts
// Busca a imagem única do cabeçalho da página "Fraternidade".

import { client } from './client';

export interface PaginaFraternidade {
  imagemUrl?: string;
}

const QUERY = `*[_type == "paginaFraternidade"][0] {
  "imagemUrl": imagem.asset->url
}`;

export async function getPaginaFraternidade(): Promise<PaginaFraternidade | null> {
  try {
    return await client.fetch(QUERY);
  } catch (error) {
    console.error('Erro ao buscar paginaFraternidade:', error);
    return null;
  }
}
