// app/studio/[[...tool]]/page.tsx
import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity.config'

export const dynamic = 'force-static'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  // A marca `studio-sanity` é o que faz o globals.css devolver a barra de
  // rolagem aqui dentro: o totem é só toque e não tem barra nenhuma, mas o
  // Studio é usado no computador, com mouse, e sem barra fica ruim de editar.
  return (
    <div className="studio-sanity">
      <NextStudio config={config} />
    </div>
  )
}
