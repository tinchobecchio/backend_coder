import Cart from '../models/Cart.js';

export class CartManagerDB {

    // Crea un carrito nuevo
    async createCart() {
        try {
            await Cart.create({})
        } catch (error) {
            console.log(error);
        }
    }

    // Devuelve los productos de un carrito segun id
    async getCartProducts(id) {
        // Busca el carrito con el id
        const cart = await Cart.findOne({_id: id})

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
        const carrito = await Cart.findOne({_id: cid})
        const nuevoProducto = {
            id_prod: pid,
            cant: quantity
        }
        carrito.products.push(nuevoProducto)
        carrito.save()
    }
}

export default CartManagerDB