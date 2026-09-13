// sanity/lib/getPaginaSobreNos.ts
// Busca a página cadastrada no Sanity para um botão específico do menu "Sobre Nós"
// (ex: 'quem-somos', 'fraternidade'). Cada botão tem seu próprio documento com
// imagem de fundo (cabeçalho) e imagem usada no conteúdo.

import { client } from './client';

export interface PaginaSobreNos {
  imagemFundoUrl?: string;
  imagemUsadaUrl?: string;
}

const QUERY_PAGINA_SOBRE_NOS = `*[_type == "paginaSobreNos" && botao == $botao][0] {
  "imagemFundoUrl": imagemFundo.asset->url,
  "imagemUsadaUrl": imagemUsada.asset->url
}`;

export async function getPaginaSobreNos(botao: string): Promise<PaginaSobreNos | null> {
  try {
    return await client.fetch(QUERY_PAGINA_SOBRE_NOS, { botao });
  } catch (error) {
    console.error(`Erro ao buscar paginaSobreNos (${botao}):`, error);
    return null;
  }
}
