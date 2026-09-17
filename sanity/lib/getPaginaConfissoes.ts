// sanity/lib/getPaginaConfissoes.ts
// Busca as duas fotos da página "Confissões".

import { client } from './client';

export interface PaginaConfissoes {
  fotoFundoUrl?: string;
  fotoPrincipalUrl?: string;
}

const QUERY = `*[_type == "paginaConfissoes"][0] {
  "fotoFundoUrl": fotoFundo.asset->url,
  "fotoPrincipalUrl": fotoPrincipal.asset->url
}`;

export async function getPaginaConfissoes(): Promise<PaginaConfissoes | null> {
  try {
    return await client.fetch(QUERY);
  } catch (error) {
    console.error('Erro ao buscar paginaConfissoes:', error);
    return null;
  }
}
