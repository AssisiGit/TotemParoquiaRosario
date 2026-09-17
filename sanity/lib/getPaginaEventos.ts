// sanity/lib/getPaginaEventos.ts
// Busca a foto do rodapé da página "Calendário de Eventos".

import { client } from './client';

export interface PaginaEventos {
  fotoUrl?: string;
}

const QUERY = `*[_type == "paginaEventos"][0] {
  "fotoUrl": foto.asset->url
}`;

export async function getPaginaEventos(): Promise<PaginaEventos | null> {
  try {
    return await client.fetch(QUERY);
  } catch (error) {
    console.error('Erro ao buscar paginaEventos:', error);
    return null;
  }
}
