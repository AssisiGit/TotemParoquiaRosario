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
  { id: 'paginaMissas', titulo: 'Horário de Missas' },
  { id: 'paginaConfissoes', titulo: 'Confissões' },
  { id: 'paginaEventos', titulo: 'Eventos (Foto)' },
  { id: 'paginaDizimo', titulo: 'Dízimo (QR Code)' },
  { id: 'paginaSecretaria', titulo: 'Secretaria' },
  { id: 'paginaRedesSociais', titulo: 'Redes Sociais (QR Codes)' },
]

// Páginas cujo conteúdo é uma lista de itens que a secretaria cadastra à
// vontade (cada item vira um card na tela do totem).
const LISTAS: { id: string; titulo: string }[] = [
  { id: 'pastoral', titulo: 'Pastorais e Movimentos' },
  { id: 'evento', titulo: 'Eventos (Calendário)' },
  { id: 'aviso', titulo: 'Avisos' },
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
      // Estas são LISTAS (a secretaria cadastra/remove vários itens), por isso
      // não entram em PAGINAS_UNICAS: cada uma abre uma lista com botão de
      // criar novo, já ordenada pelo campo "ordem".
      ...LISTAS.map(({ id, titulo }) =>
        S.listItem()
          .title(titulo)
          .id(id)
          .child(
            S.documentTypeList(id)
              .title(titulo)
              .defaultOrdering([{ field: 'ordem', direction: 'asc' }])
          )
      ),
      ...S.documentTypeListItems().filter(
        (item) =>
          !LISTAS.some((l) => l.id === item.getId()) &&
          !PAGINAS_UNICAS.some((p) => p.id === item.getId())
      ),
    ])
