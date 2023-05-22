import { promises as fs} from 'fs'

export class CartManager {
    constructor(ruta) {
        this.path = ruta
        this.i = 1
    }

    // Devuelve los carritos. *No se usa en las rutas*
    async getCarts() {
        const consulta = await fs.readFile(this.path, 'utf-8')
        const respuesta = JSON.parse(consulta)
        return respuesta
    }

    // Crea un carrito nuevo
    async createCart() {
        const carts = await this.getCarts()
        const cart = {
            id: this.i,
            products: []
        }
        this.i++ // id autoincrementable

        carts.push(cart)
        await fs.writeFile(this.path, JSON.stringify(carts))
    }

    // Devuelve los productos de un carrito segun id
    async getCartProducts(id) {
        // Lee el archivo TXT y guarda el contenido en una variable
        const carts = await this.getCarts()

        // Busca el carrito con el id en el array
        const cart = carts.find(c => c.id === id)

        //Devuelve error si no lo encuentra
        if (!cart) {
            console.log(`El carrito con id ${id} no existe`)
            return

        // Devuelve los productos del carrito
        } else {
            return cart.products
        }
    }

    // Agrega un producto a un carrito segun ids y la cantidad que se le pase por req.body
    async addProductToCart(cid, pid, quantity) {
        // Guarda los productos que tenga el carrito en una variable
        const prods = await this.getCartProducts(cid)

        // Si el producto existe en el carrito solo le actualiza el quantity
        if(prods.some(p => p.product === pid)) {
            // El profe dijo que le podemos pisar la cantidad con la nueva o sumarsela
            prods.forEach(p => { if(p.product === pid) p.quantity = quantity }) // aca la pisa, sino seria p.quantity += quantity
        
        // Si el producto no existe en el carrito lo crea y lo agrega
        } else {
            const product = 
            { 
                product: pid,
                quantity: quantity
            }
            prods.push(product)
        }

        // Guarda los cambios en el archivo
        let carts = await this.getCarts()
        carts.forEach(c => {if(c.id === cid){
            c.products = prods
        }})
        await fs.writeFile(this.path, JSON.stringify(carts))
    }

}

export default CartManager