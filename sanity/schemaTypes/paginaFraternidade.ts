// sanity/schemaTypes/paginaFraternidade.ts
// Página "Fraternidade" (lista de frades). Usa uma única imagem: a foto do
// cabeçalho, atrás do título "Fraternidade". A lista de frades em si vem do
// tipo "frade" (cada frade já é cadastrado separadamente).
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'paginaFraternidade',
  title: 'Fraternidade (Foto dos Frades Juntos)',
  type: 'document',
  fields: [
    defineField({
      name: 'imagem',
      title: 'Imagem do Cabeçalho',
      description: 'Foto dos frades juntos, exibida no topo da tela Fraternidade, atrás do título "Fraternidade". (A foto de cada frade fica no cadastro dele, em "Frades (Fraternidade)".)',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { media: 'imagem' },
    prepare({ media }) {
      return { title: 'Fraternidade (Foto dos Frades Juntos)', media };
    },
  },
});
