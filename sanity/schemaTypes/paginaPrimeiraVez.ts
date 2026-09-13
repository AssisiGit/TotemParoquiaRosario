// sanity/schemaTypes/paginaPrimeiraVez.ts
// Página "Primeira Vez Aqui". Ela usa uma única imagem (a foto que ocupa a tela
// inteira por trás do texto de boas-vindas), então esse é o único campo aqui.
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'paginaPrimeiraVez',
  title: 'Primeira Vez Aqui',
  type: 'document',
  fields: [
    defineField({
      name: 'imagem',
      title: 'Imagem da Página',
      description: 'Foto que ocupa a tela inteira desta página (o topo dela é esmaecido automaticamente para o texto ficar legível).',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { media: 'imagem' },
    prepare({ media }) {
      return { title: 'Primeira Vez Aqui', media };
    },
  },
});
