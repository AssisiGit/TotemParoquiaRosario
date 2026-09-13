// sanity/schemaTypes/paginaFraternidade.ts
// Página "Fraternidade" (lista de frades). Usa uma única imagem: a foto do
// cabeçalho, atrás do título "Fraternidade". A lista de frades em si vem do
// tipo "frade" (cada frade já é cadastrado separadamente).
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'paginaFraternidade',
  title: 'Fraternidade (Capa)',
  type: 'document',
  fields: [
    defineField({
      name: 'imagem',
      title: 'Imagem do Cabeçalho',
      description: 'Foto exibida no topo desta página, atrás do título "Fraternidade".',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { media: 'imagem' },
    prepare({ media }) {
      return { title: 'Fraternidade (Capa)', media };
    },
  },
});
