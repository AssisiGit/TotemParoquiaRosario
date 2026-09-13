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

export async function getConfigTotem(): Promise<ConfigTotem | null> {
  try {
    return await client.fetch(QUERY_CONFIG_TOTEM);
  } catch (error) {
    console.error('Erro ao buscar configTotem:', error);
    return null;
  }
}
