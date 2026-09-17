// sanity/schemaTypes/paginaSecretaria.ts
// Página "Secretaria" (/secretaria). Horários de atendimento, telefones e o
// WhatsApp são todos editáveis aqui. A foto tem um valor padrão no código
// (public/secretaria/foto.png) e só precisa ser preenchida se quiserem trocar.
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'paginaSecretaria',
  title: 'Secretaria',
  type: 'document',
  fields: [
    defineField({
      name: 'horarios',
      title: 'Horários de atendimento',
      description:
        'Cada item é um bloco na tela: em cima os dias (letra menor) e embaixo o horário (letra grande, em vermelho). Dá para adicionar, remover e arrastar para reordenar.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'dias',
              title: 'Dias',
              description: 'Ex: "Segunda à Quinta das", "Sexta-feira de", "Sábado das".',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'horario',
              title: 'Horário',
              description: 'Ex: "08h às 18h".',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'dias', subtitle: 'horario' },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'telefones',
      title: 'Telefones fixos',
      description:
        'Um telefone por item — cada um vira uma linha com o ícone dourado. Ex: "(27) 3329-1266". Dá para adicionar e remover à vontade.',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'whatsappTexto',
      title: 'WhatsApp — texto do convite',
      description:
        'O texto menor dentro do cartão vermelho, em cima do número. Ex: "Entre em contato através do nosso telefone:". Se quiser quebrar a linha num ponto específico, é só dar Enter ali.',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'whatsappNumero',
      title: 'WhatsApp — número',
      description: 'O número em destaque dentro do cartão vermelho. Ex: "(27) 99633-9178".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'foto',
      title: 'Foto da secretaria (opcional)',
      description:
        'Foto que aparece do lado direito da tela, dissolvida no fundo. Só preencha se quiser trocar a foto atual — enquanto estiver vazio, continua valendo a foto que já está no totem.',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { media: 'foto', tel: 'whatsappNumero' },
    prepare({ media, tel }) {
      return { title: 'Secretaria', subtitle: tel, media };
    },
  },
});
