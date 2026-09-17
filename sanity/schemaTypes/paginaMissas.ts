// sanity/schemaTypes/paginaMissas.ts
// Página "Horário de Missas". Tem a foto que fica embaixo (padre elevando a
// hóstia) e os horários de cada dia, organizados em grupos para ficar fácil
// de editar quando o horário de alguma missa mudar.
import { defineType, defineField, defineArrayMember } from 'sanity';

// Monta o mesmo "formato" de grupo (título do dia + lista de horários, com
// observação opcional) para Terça a Sexta, Sábado, Domingo e a Quinta-feira do mês.
function grupoHorario({
  name,
  title,
  tituloPadrao,
  horariosPadrao,
  comObservacao,
  observacaoPadrao,
}: {
  name: string;
  title: string;
  tituloPadrao: string;
  horariosPadrao: string[];
  comObservacao?: boolean;
  observacaoPadrao?: string;
}) {
  return defineField({
    name,
    title,
    type: 'object',
    initialValue: comObservacao
      ? { titulo: tituloPadrao, horarios: horariosPadrao, observacao: observacaoPadrao }
      : { titulo: tituloPadrao, horarios: horariosPadrao },
    fields: [
      defineField({
        name: 'titulo',
        title: 'Nome do dia (como aparece na tela)',
        type: 'string',
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: 'horarios',
        title: 'Horários',
        description: 'Adicione, remova ou edite os horários deste dia. Ex: "12h", "19h30".',
        type: 'array',
        of: [defineArrayMember({ type: 'string' })],
        validation: (Rule) => Rule.required().min(1),
      }),
      ...(comObservacao
        ? [
            defineField({
              name: 'observacao',
              title: 'Observação (opcional)',
              description: 'Texto pequeno que aparece embaixo do horário, entre parênteses. Ex: "9h - Missa das Crianças".',
              type: 'string',
            }),
          ]
        : []),
    ],
  });
}

export default defineType({
  name: 'paginaMissas',
  title: 'Horário de Missas',
  type: 'document',
  fields: [
    defineField({
      name: 'imagem',
      title: 'Foto da Página',
      description: 'Foto exibida na parte de baixo desta página (atrás dos botões Voltar/Início).',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    grupoHorario({
      name: 'tercaSexta',
      title: 'Terça à Sexta-feira',
      tituloPadrao: 'Terça à Sexta-feira',
      horariosPadrao: ['12h', '19h'],
    }),
    grupoHorario({
      name: 'sabado',
      title: 'Sábado',
      tituloPadrao: 'Sábado',
      horariosPadrao: ['17h'],
    }),
    grupoHorario({
      name: 'domingo',
      title: 'Domingo',
      tituloPadrao: 'Domingo',
      horariosPadrao: ['7h', '9h', '11h', '17h', '19h'],
      comObservacao: true,
      observacaoPadrao: '9h - Missa das Crianças',
    }),
    grupoHorario({
      name: 'quintaDoMes',
      title: '1ª Quinta-feira do Mês',
      tituloPadrao: '1ª Quinta-feira do Mês',
      horariosPadrao: ['15h'],
      comObservacao: true,
      observacaoPadrao: 'Missa da Saúde e São Frei Galvão',
    }),
  ],
  preview: {
    select: { media: 'imagem' },
    prepare({ media }) {
      return { title: 'Horário de Missas', media };
    },
  },
});
