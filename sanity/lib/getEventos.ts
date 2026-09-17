// sanity/lib/getEventos.ts
// Busca os eventos da página "Calendário de Eventos".
// Devolve uma LISTA (a secretaria cadastra quantos quiser no Studio),
// já ordenada pelo campo "ordem".

import { client } from './client';

export interface Evento {
  _id: string;
  data: string;
  titulo: string;
  horario: string;
}

const QUERY = `*[_type == "evento"] | order(ordem asc, data asc) {
  _id,
  data,
  titulo,
  horario
}`;

export async function getEventos(): Promise<Evento[]> {
  try {
    return (await client.fetch<Evento[]>(QUERY)) ?? [];
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    return [];
  }
}
