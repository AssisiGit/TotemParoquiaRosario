// sanity/schemaTypes/paginaDizimo.ts
// Página "Seja um dizimista" (/dizimo). Só o QR Code é editável — o resto
// (coração, TAU, título e a frase do rodapé) é fixo no código.
// Se o campo ficar vazio, a página usa o QR Code que já está no totem
// (public/dizimo/qr code.png), então nada quebra enquanto ninguém mexer.
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'paginaDizimo',
  title: 'Dízimo (QR Code)',
  type: 'document',
  fields: [
    defineField({
      name: 'qrCode',
      title: 'QR Code do dízimo',
      description:
        'Envie aqui a imagem do QR Code (só o quadrado do código, sem moldura — a moldura vermelha e bege é desenhada pela própria página). Use uma imagem quadrada e nítida. Enquanto este campo estiver vazio, continua valendo o QR Code atual do totem.',
      type: 'image',
      options: { hotspot: false },
    }),
  ],
  preview: {
    select: { media: 'qrCode' },
    prepare({ media }) {
      return { title: 'Dízimo (QR Code)', media };
    },
  },
});
