import { defineType, defineField, defineArrayMember } from 'sanity';
import { CalendarIcon } from '@sanity/icons';

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
      // Escondido: a logo do Menu Inicial passou a vir do código
      // (public/menuinicial/logotipo.svg), porque o Studio não aceitou o
      // arquivo novo. O campo continua no schema para não perder dados; se um
      // dia a logo voltar para o Sanity, é só tirar esta linha e voltar a ler
      // `logoSantuario` no getConfigTotem/TotemClient.
      hidden: true,
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
      description: 'Imagens exibidas em rotação quando o totem fica 20 segundos sem receber toque. Cada imagem fica 20 segundos na tela. Pode adicionar quantas quiser, sem limite. Arraste para reordenar. Para mostrar a lista de eventos (sempre atualizada, sem os botões Voltar/Início), use "Adicionar item" → "Tela de Eventos (Calendário)"; se não houver evento cadastrado, essa tela é pulada. Se nenhuma imagem for adicionada, o totem mostra apenas a tela "Toque para Iniciar".',
      type: 'array',
      of: [
        defineArrayMember({ type: 'image', options: { hotspot: true } }),
        // A tela de Eventos ao vivo como slide (ver TelaEventos). Não tem nada
        // para preencher: mostra a lista de "Eventos (Calendário)" e a foto de
        // "Eventos (Foto)". O Sanity exige ao menos um campo num objeto, por
        // isso este existe e fica escondido.
        defineArrayMember({
          type: 'object',
          name: 'telaEventos',
          title: 'Tela de Eventos (Calendário)',
          icon: CalendarIcon,
          fields: [defineField({ name: 'semCampos', type: 'boolean', hidden: true })],
          preview: {
            select: {},
            prepare: () => ({
              title: 'Tela de Eventos (Calendário)',
              subtitle: 'A lista de eventos cadastrada, sempre atualizada',
            }),
          },
        }),
      ],
    }),
  ],
});
