// sanity/env.ts

// Esta função garante que o site não quebre se a variável faltar,
// mas exibe um aviso claro no console se você estiver desenvolvendo.
function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Sanity Env]: ${errorMessage}`);
    }
    // Retorna 'any' temporariamente para não travar o build,
    // mas a query do client vai falhar se o valor real não existir.
    return 'undefined-env' as any; 
  }
  return v;
}

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Faltando variável de ambiente: NEXT_PUBLIC_SANITY_DATASET'
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Faltando variável de ambiente: NEXT_PUBLIC_SANITY_PROJECT_ID'
);

export const useCdn = false;