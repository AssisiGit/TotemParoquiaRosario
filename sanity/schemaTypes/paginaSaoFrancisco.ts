// sanity/schemaTypes/paginaSaoFrancisco.ts
// Página "São Francisco". Usa uma única imagem: a foto que ocupa a tela toda,
// atrás do texto branco.
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'paginaSaoFrancisco',
  title: 'São Francisco',
  type: 'document',
  fields: [
    defineField({
      name: 'imagem',
      title: 'Imagem da Página',
      description: 'Foto exibida atrás do texto (ocupa a tela toda).',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { media: 'imagem' },
    prepare({ media }) {
      return { title: 'São Francisco', media };
    },
  },
});
