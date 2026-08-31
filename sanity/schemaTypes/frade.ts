// sanity/schemaTypes/frade.ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'frade',
  title: 'Frades (Fraternidade)',
  type: 'document',
  fields: [
    defineField({
      name: 'nome',
      title: 'Nome do Frade',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    
    // 👇 AQUI ESTÁ A MÁGICA DA DATA COMPLETA 👇
    defineField({
      name: 'dataNascimento',
      title: 'Data de Nascimento',
      type: 'date',
      options: {
        dateFormat: 'DD-MM-YYYY', // Formato brasileiro no painel
      },
      description: 'Escolha o dia, mês e ano de nascimento.',
    }),
    
    defineField({
      name: 'origem',
      title: 'Cidade e Estado de Origem',
      type: 'string',
      description: 'Ex: São Paulo - SP',
    }),
    defineField({
      name: 'descricao',
      title: 'Descrição / Biografia',
      type: 'text',
      description: 'Breve história ou descrição do frade.',
    }),
    defineField({
      name: 'foto',
      title: 'Foto do Frade',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'ordem',
      title: 'Ordem de Exibição',
      type: 'number',
      description: 'Para organizar quem aparece primeiro (1, 2, 3...)',
    }),
  ],
  orderings: [
    {
      title: 'Ordem de Exibição',
      name: 'ordemAsc',
      by: [{ field: 'ordem', direction: 'asc' }],
    },
  ],
});