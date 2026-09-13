// sanity/structure.ts
import type {StructureResolver} from 'sanity/structure'

// Páginas que têm um documento único (não faz sentido criar vários).
// Cada uma aparece como um item só, já abrindo direto no formulário de edição.
const PAGINAS_UNICAS: { id: string; titulo: string }[] = [
  { id: 'paginaPrimeiraVez', titulo: 'Primeira Vez Aqui' },
  { id: 'paginaQuemSomos', titulo: 'Quem Somos' },
  { id: 'paginaCarisma', titulo: 'Carisma' },
  { id: 'paginaSaoFrancisco', titulo: 'São Francisco' },
  { id: 'paginaFraternidade', titulo: 'Fraternidade (Capa)' },
]

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Conteúdo do Totem')
    .items([
      ...PAGINAS_UNICAS.map(({ id, titulo }) =>
        S.listItem()
          .title(titulo)
          .id(id)
          .child(S.document().schemaType(id).documentId(id).title(titulo))
      ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !PAGINAS_UNICAS.some((p) => p.id === item.getId())
      ),
    ])
