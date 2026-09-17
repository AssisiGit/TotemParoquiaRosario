// sanity/schemaTypes/pastoral.ts
// Cada documento aqui é UM card amarelo da tela "Programações das Pastorais
// e Movimentos" (/pastorais). Diferente das outras páginas, este não é um
// documento único: a secretaria cria/remove quantos quiser, e a ordem na tela
// é controlada pelo campo "Ordem".
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'pastoral',
  title: 'Pastoral / Movimento',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Nome da pastoral ou movimento',
      description: 'Aparece na linha menor, no topo do card. Ex: "RCC", "Terço dos Homens".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'dia',
      title: 'Dia em que acontece',
      description: 'Ex: "Segunda-feiras", "Terça-feiras", "1ª Quinta-feira do mês,".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'horario',
      title: 'Horário',
      description:
        'Escreva já do jeito que deve aparecer depois do dia. Ex: "às 19:00", "às 19:30", "após a missa das 19:00". Na tela fica: "Segunda-feiras às 19:00".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'local',
      title: 'Local (opcional)',
      description:
        'Onde acontece. Ex: "Auditório", "Salão Paroquial". Aparece numa linha menor embaixo do horário. Deixe vazio se não quiser mostrar o local.',
      type: 'string',
    }),
    defineField({
      name: 'ordem',
      title: 'Ordem de Exibição (Número)',
      description:
        'Define a posição do card na tela: 1 aparece primeiro, 2 em seguida, e assim por diante.',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Ordem de Exibição',
      name: 'ordemAsc',
      by: [{ field: 'ordem', direction: 'asc' }],
    },
  ],
  preview: {
    select: { titulo: 'titulo', dia: 'dia', horario: 'horario', ordem: 'ordem' },
    prepare({ titulo, dia, horario, ordem }) {
      return {
        title: `${ordem ? `${ordem}. ` : ''}${titulo}`,
        subtitle: [dia, horario].filter(Boolean).join(' '),
      };
    },
  },
});
