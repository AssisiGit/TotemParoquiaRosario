import { type SchemaTypeDefinition } from 'sanity'
import menuTotem from './menuTotem'
import frade from './frade' 
import configTotem from './configTotem'
import paginaPrimeiraVez from './paginaPrimeiraVez'
import paginaQuemSomos from './paginaQuemSomos'
import paginaCarisma from './paginaCarisma'
import paginaSaoFrancisco from './paginaSaoFrancisco'
import paginaFraternidade from './paginaFraternidade'
import paginaMissas from './paginaMissas'
import paginaConfissoes from './paginaConfissoes'
import pastoral from './pastoral'
import evento from './evento'
import paginaEventos from './paginaEventos'
import aviso from './aviso'
import paginaDizimo from './paginaDizimo'
import paginaSecretaria from './paginaSecretaria'
import paginaRedesSociais from './paginaRedesSociais'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [menuTotem, frade, configTotem, paginaPrimeiraVez, paginaQuemSomos, paginaCarisma, paginaSaoFrancisco, paginaFraternidade, paginaMissas, paginaConfissoes, pastoral, evento, paginaEventos, aviso, paginaDizimo, paginaSecretaria, paginaRedesSociais],
}
