// sanity/schemaTypes/paginaQuemSomos.ts
// Página "Quem Somos". Usa uma única imagem: a foto que aparece no topo,
// atrás do arco bege.
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'paginaQuemSomos',
  title: 'Quem Somos',
  type: 'document',
  fields: [
    defineField({
      name: 'imagem',
      title: 'Imagem da Página',
      description: 'Foto exibida no topo desta página (a parte de baixo dela fica coberta pelo arco bege).',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { media: 'imagem' },
    prepare({ media }) {
      return { title: 'Quem Somos', media };
    },
  },
});
