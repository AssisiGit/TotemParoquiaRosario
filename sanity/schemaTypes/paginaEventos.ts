// sanity/schemaTypes/paginaEventos.ts
// Página "Calendário de Eventos" (/eventos). Aqui fica só a FOTO grande que
// aparece embaixo, em formato de arco. A lista de eventos em si vem do tipo
// "evento" (cada evento é cadastrado separadamente).
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'paginaEventos',
  title: 'Eventos (Foto)',
  type: 'document',
  fields: [
    defineField({
      name: 'foto',
      title: 'Foto do rodapé',
      description:
        'Foto grande que aparece na parte de baixo da tela de Eventos, com o topo em formato de arco. Troque sempre que quiser ilustrar com uma festa/evento mais recente.',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { media: 'foto' },
    prepare({ media }) {
      return { title: 'Eventos (Foto)', media };
    },
  },
});
