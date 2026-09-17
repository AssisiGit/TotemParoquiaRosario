// sanity/lib/getPastorais.ts
// Busca os cards da página "Programações das Pastorais e Movimentos".
// Diferente dos outros helpers, aqui a query devolve uma LISTA (a secretaria
// cadastra quantos quiser no Studio), já ordenada pelo campo "ordem".

import { client } from './client';

export interface Pastoral {
  _id: string;
  titulo: string;
  dia: string;
  horario: string;
  local?: string;
}

const QUERY = `*[_type == "pastoral"] | order(ordem asc, titulo asc) {
  _id,
  titulo,
  dia,
  horario,
  local
}`;

export async function getPastorais(): Promise<Pastoral[]> {
  try {
    return (await client.fetch<Pastoral[]>(QUERY)) ?? [];
  } catch (error) {
    console.error('Erro ao buscar pastorais:', error);
    return [];
  }
}
