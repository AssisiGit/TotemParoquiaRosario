import { type SchemaTypeDefinition } from 'sanity'
import menuTotem from './menuTotem'
import frade from './frade' 
import configTotem from './configTotem'
import paginaPrimeiraVez from './paginaPrimeiraVez'
import paginaQuemSomos from './paginaQuemSomos'
import paginaCarisma from './paginaCarisma'
import paginaSaoFrancisco from './paginaSaoFrancisco'
import paginaFraternidade from './paginaFraternidade'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [menuTotem, frade, configTotem, paginaPrimeiraVez, paginaQuemSomos, paginaCarisma, paginaSaoFrancisco, paginaFraternidade],
}
