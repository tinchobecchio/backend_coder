import Cart from '../persistencia/models/Cart.js';
import { findAllCarts, createNewCart, getProducts, addProduct, deleteProduct, updateArrayProds, updateProductQuantity, resetCartProds } from '../services/cart.service.js';

// Devuelve todos los carritos
export const getCarts = async (req,res,next) => {
    try {
        const carts = await findAllCarts()
        res.send(carts)
    } catch (error) {
        res.send(error)
    }
}

// Crea un carrito nuevo
export const createCart = async (req,res,next) => {
    try {
        await createNewCart()
        res.send('Carrito creado exitosamente.')
    } catch (error) {
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
            return res.status(404).send(`El carrito con id ${cid} no existe o se encuentra vacío`)
        }

        return res.status(200).send(products)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

// Agrega un producto a un carrito. Por body se le pasa quantity
export const addCartProduct = async (req,res) => {
    try {
        const {pid, cid} = req.params
        const {quantity} = req.body

        if(quantity == undefined) {
            return res.status(400).json({error: 'Invalid quantity'})
        }

        const carrito = await addProduct(cid,pid,quantity)
        
        if(!carrito) {
            return res.status(404).json({error: 'Cart not found'})
        }

        return res.status(200).json({message: 'Product added to cart', cart: carrito})

    } catch (error) {
        res.send(error);
    }
}

// Elimina un producto del carrito seleccionado
export const deleteCartProduct = async (req,res,next) => {
    try {
        let { cid, pid } = req.params
        const carrito = await deleteProduct(cid, pid)
        return res.status(200).json({message: 'Product deleted from cart', cart: carrito})

    } catch (error) {
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
        return res.status(400).json({message: error});
    }
}