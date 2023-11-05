import fs from 'fs/promises'
import { cart_path } from './config.js'

export class CartManager {
    static id = 0
    constructor() {
        this.carts = []
    }

    async init() {
        try {
            const fileContent = await this.#readfile()
            fileContent.forEach(el => {
                this.carts.push(el)
            })
            CartManager.id = this.carts[this.carts.length - 1].id
            console.log('Datos del carrito leidos correctamente')
        } catch (err) {
            console.log('No hay carritos guardados')
        }
    }

    async createCart(pid) {
        const newCart = new CartProducts()
        newCart.addProduct(pid)
        this.carts.push(newCart)
        await this.#writefile(this.carts)
        return this.carts
    }

    async addProduct(cid, pid) {
        const cartIndex = this.carts.findIndex(el => el.id === parseInt(cid))
        if (cartIndex === -1) throw new Error(`El carrito con ID ${cid} no existe`)
        console.log({
            Carrito: this.carts[cartIndex].products,
            CarritoID: cid,
            ProductoID: pid
        })
        const productIndex = this.carts[cartIndex].products.findIndex(el => el.prodId === parseInt(pid))
        if (productIndex === -1) {
            console.log('Producto Nuevo', productIndex)
            this.carts[cartIndex].products.push({ prodId: parseInt(pid), quantity: 1 })
        } else {
            this.carts[cartIndex].products[productIndex].quantity ++
            console.log('Producto Existente', productIndex)
        }
        await this.#writefile(this.carts)
        return this.carts[cartIndex]
    }

    getCarritoById (cid) {
        const selectedCart = this.carts.find(el => el.id === cid)
        if (!selectedCart) throw new Error (`El carrito con ID ${cid} no existe`)
        return selectedCart
    }

    async #readfile() {
        const fileContent = await fs.readFile(cart_path, 'utf-8')
        return JSON.parse(fileContent)
    }

    async #writefile(cart) {
        await fs.writeFile(cart_path, JSON.stringify(cart), 'utf-8')
    }
}

export class CartProducts {
    constructor() {
        this.id = ++CartManager.id
        this.products = []
    }
    addProduct({ prodId }) {
        this.products.push({
            prodId,
            quantity: 1
        })
    }

}