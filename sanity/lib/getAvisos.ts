// sanity/lib/getAvisos.ts
// Busca os cartões da página "Avisos".
// Devolve uma LISTA (a secretaria cadastra quantos quiser no Studio),
// já ordenada pelo campo "ordem".

import { client } from './client';

export interface Aviso {
  _id: string;
  texto: string;
  imagemUrl?: string;
}

const QUERY = `*[_type == "aviso"] | order(ordem asc) {
  _id,
  texto,
  "imagemUrl": imagem.asset->url
}`;

export async function getAvisos(): Promise<Aviso[]> {
  try {
    return (await client.fetch<Aviso[]>(QUERY)) ?? [];
  } catch (error) {
    console.error('Erro ao buscar avisos:', error);
    return [];
  }
}
