// sanity/lib/getConfigTotem.ts
// Busca as "Configurações Visuais" (documento único configTotem) no Sanity.
// Centralizamos aqui porque várias telas do totem (Menu Inicial, Sobre Nós, etc.)
// usam as mesmas imagens fixas (foto do santuário, marca d'água) — assim,
// quem edita no Sanity muda uma vez e atualiza em todas as telas de uma vez só.

import { client } from './client';
import { getEventos, type Evento } from './getEventos';
import { getPaginaEventos } from './getPaginaEventos';

// Um slide do carrossel de inatividade. Ou é uma imagem que a secretaria
// enviou, ou é a tela de Eventos "ao vivo": a mesma lista da página /eventos,
// sem os botões Voltar/Início, sempre atualizada com o que está cadastrado.
export type SlideCarrossel =
  | { chave: string; tipo: 'imagem'; url: string }
  | { chave: string; tipo: 'eventos'; eventos: Evento[]; fotoUrl?: string };

export interface ConfigTotem {
  fotoSantuarioUrl?: string;
  marcaDaguaUrl?: string;
  carrossel: SlideCarrossel[];
}

// Como o documento vem do Sanity, antes de virar a lista de slides.
interface ConfigTotemBruta {
  fotoSantuarioUrl?: string;
  marcaDaguaUrl?: string;
  carrossel?: { _key: string; _type: string; url?: string }[];
}

const QUERY_CONFIG_TOTEM = `*[_type == "configTotem"][0] {
  "fotoSantuarioUrl": fotoSantuario.asset->url,
  "marcaDaguaUrl": marcaDagua.asset->url,
  "carrossel": carrosselInatividade[]{ _key, _type, "url": asset->url }
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
    const config: ConfigTotemBruta | null = await client.fetch(QUERY_CONFIG_TOTEM);
    if (!config) return null;
    const itens = config.carrossel ?? [];

    // A lista de eventos só é buscada se a secretaria pôs a "Tela de Eventos"
    // no carrossel (item "telaEventos" do schema configTotem).
    const temEventos = itens.some((item) => item._type === 'telaEventos');
    const [eventos, paginaEventos] = temEventos
      ? await Promise.all([getEventos(), getPaginaEventos()])
      : [[], null];

    const carrossel = itens.flatMap((item): SlideCarrossel[] => {
      if (item._type === 'telaEventos') {
        // Sem evento cadastrado não há o que mostrar: o slide é pulado.
        return eventos.length > 0
          ? [{ chave: item._key, tipo: 'eventos', eventos, fotoUrl: paginaEventos?.fotoUrl }]
          : [];
      }
      return item.url ? [{ chave: item._key, tipo: 'imagem', url: dimensionarParaOTotem(item.url) }] : [];
    });

    return { fotoSantuarioUrl: config.fotoSantuarioUrl, marcaDaguaUrl: config.marcaDaguaUrl, carrossel };
  } catch (error) {
    console.error('Erro ao buscar configTotem:', error);
    return null;
  }
}
