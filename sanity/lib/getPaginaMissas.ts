// sanity/lib/getPaginaMissas.ts
// Busca a foto e os horários da página "Horário de Missas".

import { client } from './client';

export interface GrupoHorario {
  titulo: string;
  horarios: string[];
  observacao?: string;
}

export interface PaginaMissas {
  imagemUrl?: string;
  tercaSexta: GrupoHorario;
  sabado: GrupoHorario;
  domingo: GrupoHorario;
  quintaDoMes: GrupoHorario;
}

const CAMPOS_GRUPO = `{ titulo, horarios, observacao }`;

const QUERY = `*[_type == "paginaMissas"][0] {
  "imagemUrl": imagem.asset->url,
  tercaSexta ${CAMPOS_GRUPO},
  sabado ${CAMPOS_GRUPO},
  domingo ${CAMPOS_GRUPO},
  quintaDoMes ${CAMPOS_GRUPO}
}`;

export async function getPaginaMissas(): Promise<PaginaMissas | null> {
  try {
    return await client.fetch(QUERY);
  } catch (error) {
    console.error('Erro ao buscar paginaMissas:', error);
    return null;
  }
}

// Junta os horários em uma frase natural: ["7h","9h","11h"] -> "7h, 9h e 11h".
export function formatarHorarios(horarios?: string[]): string {
  if (!horarios || horarios.length === 0) return '';
  if (horarios.length === 1) return horarios[0];
  return `${horarios.slice(0, -1).join(', ')} e ${horarios[horarios.length - 1]}`;
}
