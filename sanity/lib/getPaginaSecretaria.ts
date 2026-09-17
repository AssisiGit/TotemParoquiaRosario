// sanity/lib/getPaginaSecretaria.ts
// Busca horários, telefones e WhatsApp da página da Secretaria.
// A foto é opcional: se vier vazia, a página usa a de public/secretaria/.

import { client } from './client';

export interface HorarioSecretaria {
  dias: string;
  horario: string;
}

export interface PaginaSecretaria {
  horarios?: HorarioSecretaria[];
  telefones?: string[];
  whatsappTexto?: string;
  whatsappNumero?: string;
  fotoUrl?: string;
}

const QUERY = `*[_type == "paginaSecretaria"][0] {
  horarios[] { dias, horario },
  telefones,
  whatsappTexto,
  whatsappNumero,
  "fotoUrl": foto.asset->url
}`;

export async function getPaginaSecretaria(): Promise<PaginaSecretaria | null> {
  try {
    return await client.fetch(QUERY);
  } catch (error) {
    console.error('Erro ao buscar paginaSecretaria:', error);
    return null;
  }
}
