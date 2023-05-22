import { Router } from "express";
import CartManagerDB from "../controllers/CartManagerDB.js";

const cartDBRouter = new Router()
const cm = new CartManagerDB()


// Crea un carrito nuevo
cartDBRouter.post('/', (req, res) => {
    try {
        cm.createCart()
        res.send('Carrito creado exitosamente.')
    } catch (error) {
        res.send(error)
    }
})

// Devuelve los productos de un carrito segun id
cartDBRouter.get('/:cid', async (req, res) => {
    try {
        const products = await cm.getCartProducts(req.params.cid)
        products ? res.send(products) : res.status(404).send(`El carrito con id ${req.params.cid} no existe`)
    } catch (error) {
        res.send(error)
    }
})

// Agrega un producto a un carrito. Por body se le pasa un json con la propiedad quantity para designarle la cantidad
cartDBRouter.post('/:cid/product/:pid', (req, res) => {
    try {
        if(req.body.quantity !== undefined) {
            cm.addProductToCart(req.params.cid, req.params.pid, req.body.quantity) 
            res.send('El producto se agregó al carrito correctamente')
        } else {
            res.send('Error: Enviar una cantidad válida')
        }
    } catch (error) {
        console.log(error);
    }
})

export default cartDBRouter