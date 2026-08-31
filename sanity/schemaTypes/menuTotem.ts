import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'menuTotem',
  title: 'Menu do Totem',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título do Botão',
      type: 'string',
      validation: (Rule) => Rule.required(), // 👈 Agora o TypeScript já sabe o que é o Rule!
    }),
    defineField({
      name: 'icone',
      title: 'Ícone',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'ordem',
      title: 'Ordem de Exibição (Número)',
      type: 'number',
      description: 'Use números para ordenar (ex: 1 para o primeiro, 2 para o segundo...)',
    }),
    defineField({
      name: 'rota',
      title: 'Link / Destino',
      type: 'string',
      description: 'Para qual página esse botão vai levar? (ex: /sobre, /missas)',
    })
  ],
  orderings: [
    {
      title: 'Ordem de Exibição',
      name: 'ordemAsc',
      by: [{ field: 'ordem', direction: 'asc' }],
    },
  ],
});