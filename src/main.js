import express from 'express'
import { PORT } from './config.js'
import { productsRouter } from './productsRouter.js'
import { cartRouter } from './cartRouter.js'

const app = express()

app.use(express.json())
app.use('/api/products',productsRouter)
app.use('/api/cart', cartRouter)

app.listen(PORT, () => {
    console.log(
        `Concectado al puerto: ${PORT}`
    )
})
