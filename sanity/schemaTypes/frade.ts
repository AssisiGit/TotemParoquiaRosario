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
      name: 'corCabecalho',
      title: 'Cor do cabeçalho',
      description:
        'Cor do fundo atrás da foto, no topo da tela deste frade. O design alterna entre dourado e vinho de um frade para outro — escolha aqui qual usar.',
      type: 'string',
      options: {
        list: [
          { title: 'Dourado', value: 'dourado' },
          { title: 'Vinho', value: 'vinho' },
        ],
        layout: 'radio',
      },
      initialValue: 'dourado',
    }),
    defineField({
      name: 'descerFoto',
      title: 'Descer a foto (%)',
      description:
        'Deixe vazio na maioria dos casos. Use só se o hábito parecer cortado no canto de baixo do cabeçalho: a foto desce e o pedaço de baixo fica escondido pela borda. Entre 5 e 8 costuma bastar.',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(30),
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