import { Router } from "express";
import { pm } from './app.js'

export const productsRouter = Router()

productsRouter.get('/', (req, res) => {
    const limit = req.query.limit
    let productos = pm.getAll()
    if (limit) { productos = productos.slice(0, limit) }
    res.json(productos)
})

productsRouter.get('/:pid', (req, res) => {
    try {
        const product = pm.getById(req.params.pid)
        if (!product) throw new Error(`El producto de ID ${req.params.pid} no existe`)
        res.json(product)
    } catch (err) {
        res.json({
            error: 'ID NO ENCONTRADO',
            message: err.message
        })
    }
})

// title, description, code, price, status, stock, category, thumb
productsRouter.post('/', async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body
        if (!title || !description || !code || !price || !stock || !category) throw new Error('Todos los campos son obligatorios')
        const newProd = await pm.addProduct(req.body)
        res.json({
            message: 'Producto Correcto',
            Producto: newProd
        })

    } catch (err) {
        res.json({
            error: 'Carga Invalida',
            message: err.message
        })
    }
})

productsRouter.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const updData = req.body
        const updProd = await pm.updProduct(pid, updData)
        res.json({
            status: 'Producto Actualizado',
            product: updProd
        })

    } catch (err) {
        res.json({
            error: 'Error al actualizar',
            message: err.message
        })
    }
})

productsRouter.delete('/:pid', async (req, res) => {
    const { pid } = req.params
    try {
        await pm.delProduct(pid)
        res.json({
            status: `Producto eliminado`,
            message: `El producto con ID ${pid} fue eliminado`
        })
    } catch (err) {
        res.json({
            status: 'Error al eliminar un producto',
            message: err.message
        })
    }
})
