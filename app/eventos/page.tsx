// app/eventos/page.tsx
import { getEventos } from '@/sanity/lib/getEventos';
import { getPaginaEventos } from '@/sanity/lib/getPaginaEventos';
import TelaEventos from '../_components/TelaEventos';
import { NavVoltarInicio } from '../sobre-nos/_components/NavVoltarInicio';

export const revalidate = 60;

export default async function EventosPage() {
  // Duas coisas vêm do Sanity: a lista de eventos (tipo "evento", um documento
  // por evento) e a foto do rodapé (documento único "Eventos (Foto)").
  // O desenho da tela fica em TelaEventos, que também é usado como slide do
  // carrossel de inatividade (lá sem os botões).
  const [eventos, pagina] = await Promise.all([getEventos(), getPaginaEventos()]);

  return (
    <TelaEventos eventos={eventos} fotoUrl={pagina?.fotoUrl}>
      <NavVoltarInicio hrefVoltar="/?ativo=true" className="absolute inset-x-0 bottom-[4.6vh] z-10" />
    </TelaEventos>
  );
}
