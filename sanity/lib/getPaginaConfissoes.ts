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

// As duas fotos precisam de transparência (o esmaecido é o alfa do arquivo).
// Sem parâmetro, o CDN do Sanity entrega WebP convertido em PNG (5,6MB cada
// nas fotos atuais); com `auto=format` o Chrome recebe WebP com alfa (~1MB).
// `q=90` porque o padrão do CDN é 75 e estas fotos ocupam a tela inteira.
function comFormatoLeve(url?: string): string | undefined {
  if (!url || url.includes('?')) return url;
  return `${url}?auto=format&q=90`;
}

export async function getPaginaConfissoes(): Promise<PaginaConfissoes | null> {
  try {
    const pagina: PaginaConfissoes | null = await client.fetch(QUERY);
    if (!pagina) return null;
    return {
      fotoFundoUrl: comFormatoLeve(pagina.fotoFundoUrl),
      fotoPrincipalUrl: comFormatoLeve(pagina.fotoPrincipalUrl),
    };
  } catch (error) {
    console.error('Erro ao buscar paginaConfissoes:', error);
    return null;
  }
}
