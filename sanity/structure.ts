// sanity/structure.ts
import type {StructureResolver} from 'sanity/structure'

// Páginas que têm um documento único (não faz sentido criar vários).
// Cada uma aparece como um item só, já abrindo direto no formulário de edição.
const PAGINAS_UNICAS: { id: string; titulo: string }[] = [
  { id: 'paginaPrimeiraVez', titulo: 'Primeira Vez Aqui' },
  { id: 'paginaQuemSomos', titulo: 'Quem Somos' },
  { id: 'paginaCarisma', titulo: 'Carisma' },
  { id: 'paginaSaoFrancisco', titulo: 'São Francisco' },
  { id: 'paginaFraternidade', titulo: 'Fraternidade (Foto dos Frades Juntos)' },
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

// A lista de frades aparece logo abaixo da foto de grupo da Fraternidade.
// Antes ela caía no fim da barra lateral, longe da capa, e a secretaria não
// achava onde trocar a foto dos frades juntos (procurava em "Frades").
const FRADES = { id: 'frade', titulo: 'Frades (Fraternidade)' };

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Conteúdo do Totem')
    .items([
      ...PAGINAS_UNICAS.flatMap(({ id, titulo }) => {
        const item = S.listItem()
          .title(titulo)
          .id(id)
          .child(S.document().schemaType(id).documentId(id).title(titulo));
        if (id !== 'paginaFraternidade') return [item];
        return [
          item,
          S.listItem()
            .title(FRADES.titulo)
            .id(FRADES.id)
            .child(
              S.documentTypeList(FRADES.id)
                .title(FRADES.titulo)
                .defaultOrdering([{ field: 'ordem', direction: 'asc' }])
            ),
        ];
      }),
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
          !PAGINAS_UNICAS.some((p) => p.id === item.getId()) &&
          item.getId() !== FRADES.id
      ),
    ])
