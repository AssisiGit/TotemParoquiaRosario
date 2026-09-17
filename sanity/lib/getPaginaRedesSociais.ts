// sanity/lib/getPaginaRedesSociais.ts
// Busca os três QR Codes da página de Redes Sociais. Qualquer um pode voltar
// vazio — nesse caso a página usa o QR Code que já está em public/redessociais/.

import { client } from './client';

export interface PaginaRedesSociais {
  qrFacebookUrl?: string;
  qrInstagramUrl?: string;
  qrSiteUrl?: string;
}

const QUERY = `*[_type == "paginaRedesSociais"][0] {
  "qrFacebookUrl": qrFacebook.asset->url,
  "qrInstagramUrl": qrInstagram.asset->url,
  "qrSiteUrl": qrSite.asset->url
}`;

export async function getPaginaRedesSociais(): Promise<PaginaRedesSociais | null> {
  try {
    return await client.fetch(QUERY);
  } catch (error) {
    console.error('Erro ao buscar paginaRedesSociais:', error);
    return null;
  }
}
