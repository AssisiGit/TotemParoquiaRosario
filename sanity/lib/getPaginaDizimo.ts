// sanity/lib/getPaginaDizimo.ts
// Busca o QR Code da página do dízimo. Pode voltar vazio — nesse caso a
// página usa o QR Code que já está em public/dizimo/.

import { client } from './client';

export interface PaginaDizimo {
  qrCodeUrl?: string;
}

const QUERY = `*[_type == "paginaDizimo"][0] {
  "qrCodeUrl": qrCode.asset->url
}`;

export async function getPaginaDizimo(): Promise<PaginaDizimo | null> {
  try {
    return await client.fetch(QUERY);
  } catch (error) {
    console.error('Erro ao buscar paginaDizimo:', error);
    return null;
  }
}
