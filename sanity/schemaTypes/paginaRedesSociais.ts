// sanity/schemaTypes/paginaRedesSociais.ts
// Página "Redes Sociais" (/redesocial). Só os três QR Codes são editáveis —
// ícones, faixa vermelha e textos são fixos no código.
// Os três campos são opcionais: enquanto ficarem vazios, valem os QR Codes
// que já estão no totem (public/redessociais/), então nada quebra.
import { defineType, defineField } from 'sanity';

// Os três campos são iguais, muda só o nome/título/rede.
const qr = (name: string, title: string, rede: string) =>
  defineField({
    name,
    title,
    description:
      `Envie aqui a imagem do QR Code ${rede} (só o quadrado do código, sem moldura — a moldura branca é desenhada pela própria página). Use uma imagem quadrada e nítida. Enquanto este campo estiver vazio, continua valendo o QR Code atual do totem.`,
    type: 'image',
    options: { hotspot: false },
  });

export default defineType({
  name: 'paginaRedesSociais',
  title: 'Redes Sociais (QR Codes)',
  type: 'document',
  fields: [
    qr('qrFacebook', 'QR Code do Facebook', 'do Facebook'),
    qr('qrInstagram', 'QR Code do Instagram', 'do Instagram'),
    qr('qrSite', 'QR Code do site', 'do site da paróquia'),
  ],
  preview: {
    select: { media: 'qrFacebook' },
    prepare({ media }) {
      return { title: 'Redes Sociais (QR Codes)', media };
    },
  },
});
