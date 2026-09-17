// sanity/schemaTypes/evento.ts
// Cada documento aqui é UM evento da tela "Calendário de Eventos" (/eventos).
// Não é documento único: a secretaria cria/remove quantos quiser, e a ordem
// em que aparecem na tela é controlada pelo campo "Ordem".
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'evento',
  title: 'Evento',
  type: 'document',
  fields: [
    defineField({
      name: 'data',
      title: 'Data do evento',
      description:
        'Aparece em destaque (negrito), na primeira linha. Escreva já do jeito que deve aparecer na tela. Ex: "29 de Abril", "01 de Maio".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titulo',
      title: 'Nome do evento',
      description: 'Segunda linha. Ex: "Show com Frei Gilson", "Missa do Dia do Trabalhador".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'horario',
      title: 'Horário',
      description:
        'Terceira linha. Escreva já do jeito que deve aparecer. Ex: "19h às 21h", "a partir das 22h".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ordem',
      title: 'Ordem de Exibição (Número)',
      description:
        'Define a posição do evento na tela: 1 aparece primeiro, 2 em seguida, e assim por diante.',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    { title: 'Ordem de Exibição', name: 'ordemAsc', by: [{ field: 'ordem', direction: 'asc' }] },
  ],
  preview: {
    select: { data: 'data', titulo: 'titulo', horario: 'horario', ordem: 'ordem' },
    prepare({ data, titulo, horario, ordem }) {
      return {
        title: `${ordem ? `${ordem}. ` : ''}${data} — ${titulo}`,
        subtitle: horario,
      };
    },
  },
});
