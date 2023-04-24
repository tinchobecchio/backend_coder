import { Router } from "express";
import CartManager from "../CartManager.js";

const cartRouter = new Router()
const cm = new CartManager('./carritos.txt')

// Crea un carrito nuevo
cartRouter.post('/', (req, res) => {
    try {
        cm.createCart()
        res.send('Carrito creado exitosamente.')
    } catch (error) {
        res.send(error)
    }
})

// Devuelve los productos de un carrito segun id
cartRouter.get('/:cid', async (req, res) => {
    try {
        const products = await cm.getCartProducts(parseInt(req.params.cid))
        products ? res.send(products) : res.status(404).send(`El carrito con id ${req.params.cid} no existe`)

    } catch (error) {
        res.send(error)
    }
})

// Agrega un producto a un carrito. Por body se le pasa un json con la propiedad quantity para designarle la cantidad
cartRouter.post('/:cid/product/:pid', (req, res) => {
    try {
        if(req.body.quantity !== undefined) {
            cm.addProductToCart(parseInt(req.params.cid), parseInt(req.params.pid), parseInt(req.body.quantity)) 
            res.send('El producto se agregó al carrito correctamente')
        } else {
            res.send('Error: Enviar una cantidad válida')
        }
    } catch (error) {
        console.log(error);
    }
})
 
export default cartRouter;