import fs from 'fs/promises'
import { cart_path } from './config.js'

// Class del Manager de Carritos
export class CartManager {
    static id = 0
    constructor() {
        this.carts = []
    }

    /**
     * Inicializa el archivo cart.json y define el valor del siguiente ID
     */
    async init() {
        try {
            const fileContent = await this.#readfile()
            fileContent.forEach(el => {
                this.carts.push(el)
            })
            CartManager.id = this.carts[this.carts.length - 1].id
            console.log('Datos del carrito leidos correctamente') // Informa por consola cuando cargo el archivo
        } catch (err) {
            console.log('No hay carritos guardados') // Informa por consola que el archivo esta vacio
        }
    }

    /**
     * Crea un nuevo carrito a partir de un Id de producto
     * POST - http://localhost:8080/api/cart/
     * Recibe por BODY el param "prodId" con el ID del producto a agregar
     * @param {number} pid 
     * @returns Carrito agregado
     */
    async createCart(pid) {
        const newCart = new CartProducts()
        newCart.addProduct(pid)
        this.carts.push(newCart)
        await this.#writefile(this.carts)
        return newCart
    }

    /**
     * Agrega un producto a un carrito existente.
     * POST - http://localhost:8080/api/cart/1/product/2
     * @param {number} cid 
     * @param {number} pid 
     * @returns {object} Actualiza al cliente el contenido del carrito
     * @throws Error
     */
    async addProduct(cid, pid) {
        const cartIndex = this.carts.findIndex(el => el.id === parseInt(cid)) // consulta el index del carrito
        if (cartIndex === -1) throw new Error(`El carrito con ID ${cid} no existe`) // Si no existe, devuelve error
        const productIndex = this.carts[cartIndex].products.findIndex(el => el.prodId === parseInt(pid)) // consulta si el producto ya existe en el carrito
        if (productIndex === -1) {
            // Producto Nuevo. Cantidad por defecto 1
            this.carts[cartIndex].products.push({ prodId: parseInt(pid), quantity: 1 })
        } else {
            // Producto existente. Actualiza cantidad
            this.carts[cartIndex].products[productIndex].quantity ++
        }
        await this.#writefile(this.carts)
        return this.carts[cartIndex]
    }

    /**
     * Consulta un carrito por ID de carrtio
     * GET - http://localhost:8080/api/cart/1
     * @param {number} cid 
     * @returns {object} Contenido del carrito
     */
    getCarritoById (cid) {
        const selectedCart = this.carts.find(el => el.id === cid) // busca por id del carrito consultado
        if (!selectedCart) throw new Error (`El carrito con ID ${cid} no existe`)
        return selectedCart
    }

    /**
     * Lee el contenido del archivo
     * @returns {object}
     */
    async #readfile() {
        const fileContent = await fs.readFile(cart_path, 'utf-8')
        return JSON.parse(fileContent)
    }

    /**
     * Recibe el array de CM y lo guarda en el archivo
     * @param {object} cart 
     */
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