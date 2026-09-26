// sanity/schemaTypes/paginaConfissoes.ts
// Página "Confissões". Tem duas fotos: uma de fundo (atrás do título e dos
// horários, lá em cima) e uma principal (a foto nítida, embaixo da tela).
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'paginaConfissoes',
  title: 'Confissões',
  type: 'document',
  fields: [
    defineField({
      name: 'fotoFundo',
      title: 'Foto de Fundo (topo)',
      description: 'Foto que aparece esmaecida atrás do título "Confissões" e dos horários, no topo da tela. Precisa ser PNG (ou WebP) com transparência: o esmaecido vem do próprio arquivo. Foto em JPEG aparece com manchas pretas.',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fotoPrincipal',
      title: 'Foto Principal (parte de baixo)',
      description: 'Foto nítida exibida na parte de baixo desta página (atrás dos botões Voltar/Início). Precisa ser PNG (ou WebP) com transparência no topo, onde ela se dissolve no fundo. Foto em JPEG aparece com uma faixa preta.',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { media: 'fotoPrincipal' },
    prepare({ media }) {
      return { title: 'Confissões', media };
    },
  },
});
