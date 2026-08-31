import { type SchemaTypeDefinition } from 'sanity'
import menuTotem from './menuTotem'
import frade from './frade' 

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [menuTotem, frade], 
}