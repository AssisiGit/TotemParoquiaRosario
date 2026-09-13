// sanity/schemaTypes/paginaCarisma.ts
// Página "Carisma". Usa uma única imagem: a foto que aparece na parte de
// baixo da tela (a de cima é coberta pelo degradê com o texto).
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'paginaCarisma',
  title: 'Carisma',
  type: 'document',
  fields: [
    defineField({
      name: 'imagem',
      title: 'Imagem da Página',
      description: 'Foto exibida na parte de baixo desta página, atrás do degradê.',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { media: 'imagem' },
    prepare({ media }) {
      return { title: 'Carisma', media };
    },
  },
});
