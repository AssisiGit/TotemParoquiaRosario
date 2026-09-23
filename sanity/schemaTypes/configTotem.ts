import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'configTotem',
  title: 'Configurações Visuais (Imagens Fixas)',
  type: 'document',
  fields: [
    defineField({
      name: 'fotoSantuario',
      title: 'Foto Principal do Santuário (Topo)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'logoSantuario',
      title: 'Logo da Paróquia/Santuário',
      type: 'image',
      description: 'Esta imagem ficará no topo da foto principal.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'marcaDagua',
      title: 'Marca D\'água (Fundo)',
      type: 'image',
      description: 'Imagem com opacidade baixa que fica atrás dos botões.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'carrosselInatividade',
      title: 'Carrossel de Inatividade',
      description: 'Imagens exibidas em rotação quando o totem fica 20 segundos sem receber toque. Cada imagem fica 20 segundos na tela. Pode adicionar quantas quiser, sem limite. Arraste para reordenar. Se nenhuma imagem for adicionada, o totem mostra apenas a tela "Toque para Iniciar".',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
  ],
});
