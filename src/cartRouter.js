import { Router } from "express";
import { pm, cv } from './app.js'

export const cartRouter = Router()

cartRouter.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const selectedCart = cv.getCarritoById(parseInt(cid))
        res.json({ status: 'Contenido del carrito', productos: selectedCart })

    } catch (err) {
        res.json({
            status: 'Error al consultar',
            message: err.message
        })
    }
})

cartRouter.post('/', async (req, res) => {
    const { prodId } = req.body
    try {
        if (!pm.getById(parseInt(prodId))) throw new Error(`El producto con ID ${prodId} no existe`)
        const response = await cv.createCart({ prodId })
        res.json({ status: 'Carrito creado correctamente', productos: response })

    } catch (err) {
        res.json({
            status: 'Error al crear el carrito',
            message: err.message
        })
    }
})

cartRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        if (!pm.getById(parseInt(pid))) throw new Error(`El producto con ID ${pid} no existe`)
        const carrito = await cv.addProduct(cid, pid)
        res.json({ status: 'Producto agregado al carrito', messaje: carrito })

    } catch (err) {
        res.json({
            status: 'Error al agregar producto',
            messaje: err.message
        })

    }
})