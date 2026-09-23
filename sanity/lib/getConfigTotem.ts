// sanity/lib/getConfigTotem.ts
// Busca as "Configurações Visuais" (documento único configTotem) no Sanity.
// Centralizamos aqui porque várias telas do totem (Menu Inicial, Sobre Nós, etc.)
// usam as mesmas imagens fixas (foto do santuário, logo, marca d'água) — assim,
// quem edita no Sanity muda uma vez e atualiza em todas as telas de uma vez só.

import { client } from './client';

export interface ConfigTotem {
  fotoSantuarioUrl?: string;
  logoSantuarioUrl?: string;
  marcaDaguaUrl?: string;
  carrosselUrls?: string[];
}

const QUERY_CONFIG_TOTEM = `*[_type == "configTotem"][0] {
  "fotoSantuarioUrl": fotoSantuario.asset->url,
  "logoSantuarioUrl": logoSantuario.asset->url,
  "marcaDaguaUrl": marcaDagua.asset->url,
  "carrosselUrls": carrosselInatividade[].asset->url
}`;

// O carrossel de inatividade não tem limite de quantidade de imagens (a
// secretaria cadastra quantas quiser), e as fotos costumam vir direto do
// celular, com vários megabytes cada. Como TODAS ficam montadas ao mesmo
// tempo para o fade funcionar, pedimos ao CDN do Sanity a versão já no
// tamanho da tela em vez do arquivo original.
//
// 2160 e não 1080 de propósito: a configuração recomendada do totem é a TV em
// 4K com escala de 200%, ou seja, o navegador enxerga 1080 de largura mas
// desenha em 2160 pixels reais (DPR 2). Pedir 1080 deixaria a foto borrada
// nessa tela. `auto=format` entrega webp quando o navegador aceita.
//
// `fit=max` é obrigatório aqui: sem ele o CDN AMPLIA as imagens menores que
// 2160 para chegar na largura pedida, e o arquivo fica maior que o original
// sem ganhar nitidez nenhuma (medido na foto já cadastrada: 144KB de origem
// viravam 203KB; com fit=max caem para 82KB). Com ele, 2160 vira um teto: só
// reduz, nunca amplia.
const LARGURA_CARROSSEL = 2160;

function dimensionarParaOTotem(url: string): string {
  if (!url || url.includes('?')) return url;
  return `${url}?w=${LARGURA_CARROSSEL}&q=75&fit=max&auto=format`;
}

export async function getConfigTotem(): Promise<ConfigTotem | null> {
  try {
    const config: ConfigTotem | null = await client.fetch(QUERY_CONFIG_TOTEM);
    if (!config) return null;
    return {
      ...config,
      carrosselUrls: config.carrosselUrls?.filter(Boolean).map(dimensionarParaOTotem),
    };
  } catch (error) {
    console.error('Erro ao buscar configTotem:', error);
    return null;
  }
}
