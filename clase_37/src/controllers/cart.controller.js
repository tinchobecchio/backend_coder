import { 
    findAllCarts, 
    createNewCart, 
    getProducts, 
    addProduct, 
    deleteProduct, 
    updateArrayProds, 
    updateProductQuantity, 
    resetCartProds } from '../services/cart.service.js';
import { getProdById } from '../services/products.service.js';
import {createTicket} from '../services/ticket.service.js'
import { __dirname } from '../utils/path.js';

// Devuelve todos los carritos
export const getCarts = async (req,res,next) => {
    try {
        const carts = await findAllCarts()
        res.send(carts)
    } catch (error) {
        req.logger.error('Error trying to get carts')
        res.send(error)
    }
}

// Crea un carrito nuevo
export const createCart = async (req,res,next) => {
    try {
        await createNewCart()
        res.send('Carrito creado exitosamente.')
    } catch (error) {
        req.logger.error('Error trying to create a cart')
        res.send(error)
    }
}

// Devuelve los productos de un carrito segun id
export const getCartProducts = async (req,res,next) => {
    try {
        const {cid} = req.params
        const products = await getProducts(cid)

        //Devuelve error si no lo encuentra
        if (!products.length) {
            return res.status(404).json({message: `Cart ${cid} not founded or is empty`, payload: []})
        }

        return res.status(200).json({message: `Cart ${cid} founded`, payload: products})

    } catch (error) {
        req.logger.error('Error trying to get cart products')
        res.status(500).json({message: error.message})
    }
}

// Agrega un producto a un carrito. Por body se le pasa quantity
export const addCartProduct = async (req,res) => { // premium no puede agregar prods suyos
    try {
        const {pid, cid} = req.params
        const quantity = req.body.quantity

        // si es un usuario premium y ES un producto suyo devuelve error
        const product = await getProdById(pid) 
        if(req.user.role === "premium" && product.owner === req.user.email){
            return res.status(403).json({error: 'You are not allowed to add your own product to the cart'})
        }

        if(quantity>0){
            
            const carrito = await addProduct(cid,pid,quantity)
            
            if(!carrito) {
                return res.status(404).json({error: 'Cart not found'})
            }
            
            return res.status(200).json({message: 'Product added to cart', cart: carrito})
        }
        else {
            return res.status(400).json({error: 'Invalid quantity'})
        }
        
    } catch (error) {
        req.logger.error('Error trying to add a product in the cart')
        res.status(400).json({error: 'Error trying to add a product in the cart'});
    }
}

// Elimina un producto del carrito seleccionado
export const deleteCartProduct = async (req,res,next) => {
    try {
        let { cid, pid } = req.params
        const carrito = await deleteProduct(cid, pid)
        return res.status(200).json({message: 'Product deleted from cart', cart: carrito})

    } catch (error) {
        req.logger.error('Error trying to delete a product from the cart')
        return res.send(error);
    }
}

// Actualiza los productos de un carrito con un array de ids de productos dado (se lo paso por req.body)
export const updateArrayProducts = async (req,res,next) => {
    try {
        const { cid } = req.params
        const { array } = req.body // el arreglo viene en el body como {"array":["646bc84ff89d0072c10920b4","646bc784f89d0072c10920ac"]}

        const carrito = await updateArrayProds(cid, array)

        return res.status(200).json({message: 'Cart updated', cart: carrito})

    } catch (error) {
        req.logger.error('Error trying to update a product from the cart')
        return res.status(400).json({message: error});
    }
}

// Actualiza la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
export const updateCartProductQuantity = async (req,res,next) => {
    try {
        let { cid, pid } = req.params
        let { quantity } = req.body

        const carrito = await updateProductQuantity(cid,pid,quantity)

        return res.status(200).json({message: 'Quantity updated', cart: carrito})

    } catch (error) {
        req.logger.error('Error trying to update the quantity of a product from the cart')
        return res.status(400).json({message: error});
    }
}

// Elimina todos los productos del carrito
export const resetCart = async (req,res,next) => {
    try {
        const { cid } = req.params
        const carrito = await resetCartProds(cid)

        return res.status(200).json({message: 'Cart reseted', cart: carrito})

    } catch (error) {
        req.logger.error('Error trying to delete all products from the cart')
        return res.status(400).json({message: error});
    }
}


// Genera un ticket de compra con los items del carrito que estan en stock
export const purchase = async (req,res,next) => {
    try {
        const { cid } = req.params
        const { email } = req.user
        const newTicket = await createTicket(cid, email)
        
        if(newTicket.ticket){
            // mandar mail
            const URL = `http://localhost:4000/api/mail/ticket`
            fetch(URL, {
                    method: 'POST',
                    body: JSON.stringify(newTicket),
                    headers: {"Content-type": "application/json; charset=UTF-8"}
                })
            .then(response => response.json())
            .then(res => req.logger.info(res))
            .catch(err => req.logger.info(err))
        }

        return res.status(200).json({'order':newTicket})

    } catch (error) {
        req.logger.error('Error in the purchase process')
        return res.status(400).json({message: error});
    }
}