// sanity/schemaTypes/aviso.ts
// Cada documento aqui é UM cartão bege da tela "Avisos" (/avisos).
// A secretaria cria/remove quantos quiser; a ordem na tela vem do campo "Ordem".
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'aviso',
  title: 'Aviso',
  type: 'document',
  fields: [
    defineField({
      name: 'texto',
      title: 'Texto do aviso',
      description:
        'O recado que aparece dentro do cartão bege. Ex: "Matrículas abertas para crisma 2027". O cartão cresce sozinho se o texto for mais longo, mas frases curtas ficam melhores na tela do totem.',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imagem',
      title: 'Imagem ou QR Code (opcional)',
      description:
        'Aparece do lado direito do texto, dentro de um quadrado branco. Serve principalmente para QR Code — ex: um aviso de "Matrículas abertas para o curso de noivos" com o QR Code que leva direto para o formulário de inscrição. Envie a imagem quadrada; para QR Code, use só o quadrado do código. Deixe vazio se o aviso for só texto.',
      type: 'image',
      options: { hotspot: false },
    }),
    defineField({
      name: 'ordem',
      title: 'Ordem de Exibição (Número)',
      description:
        'Define a posição do aviso na tela: 1 aparece primeiro, 2 em seguida, e assim por diante.',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    { title: 'Ordem de Exibição', name: 'ordemAsc', by: [{ field: 'ordem', direction: 'asc' }] },
  ],
  preview: {
    select: { texto: 'texto', ordem: 'ordem', media: 'imagem' },
    prepare({ texto, ordem, media }) {
      return { title: `${ordem ? `${ordem}. ` : ''}${texto ?? ''}`, media };
    },
  },
});
