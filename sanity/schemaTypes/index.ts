import { type SchemaTypeDefinition } from 'sanity'
import category from './category'
import product from './product'
import review from './review'
import order from './order'
import banner from './banner'


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [category, product, review, order,banner],
}
