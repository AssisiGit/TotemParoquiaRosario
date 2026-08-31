// sanity/structure.ts
import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Conteúdo do Totem')
    .items(S.documentTypeListItems())