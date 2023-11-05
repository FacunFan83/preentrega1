import { ProductManajer } from './productManajer.js'
import { CartManager } from './cartManajer.js'
export const pm = new ProductManajer
export const cv = new CartManager

await pm.init()
await cv.init()


