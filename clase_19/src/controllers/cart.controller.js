import Cart from '../models/Cart.js';

// Devuelve todos los carritos
export const getCarts = async (req,res,next) => {
    try {
        const carts = await Cart.find({})
        res.send(carts)
    } catch (error) {
        res.send(error)
    }
}

// Crea un carrito nuevo
export const createCart = async (req,res,next) => {
    try {
        await Cart.create({})
        res.send('Carrito creado exitosamente.')
    } catch (error) {
        res.send(error)
    }
}

// Devuelve los productos de un carrito segun id
export const getCartProducts = async (req,res,next) => {
    try {
        // Busca el carrito con el id
        const cart = await Cart.findOne({_id: req.params.cid})

        //Devuelve error si no lo encuentra
        if (!cart) {
            res.status(404).send(`El carrito con id ${req.params.cid} no existe`)

        // Devuelve los productos del carrito
        } else {
            let productos = await cart.populate('products.id_prod') // populate para mostrar los productos completos
            res.send(productos)
        }

    } catch (error) {
        if(error.name === "CastError") { // si pasó mal el id 
            res.status(400).send(`El id ${req.params.cid} no es válido.`) 
        } else { 
            res.send(error);
        }
    }
}

// Agrega un producto a un carrito. Por body se le pasa quantity
export const addCartProduct = async (req,res,next) => {
    try {
        if(req.body.quantity !== undefined) {
            const carrito = await Cart.findOne({_id: req.params.cid})
            
            const nuevoProducto = {
                id_prod: req.params.pid,
                cant: req.body.quantity
            }

            carrito.products.push(nuevoProducto)
            carrito.save()

            res.send('El producto se agregó al carrito correctamente')
        } else {
            res.send('Error: Enviar una cantidad válida')
        }
    } catch (error) {
        res.send(error);
    }
}

// Elimina un producto del carrito seleccionado
export const deleteCartProduct = async (req,res,next) => {
    try {
            let { cid, pid } = req.params
            const carrito = await Cart.findOne({_id: cid})
            carrito.products.id(pid).deleteOne();
            await carrito.save()

            res.send('El producto se eliminó del carrito correctamente')

    } catch (error) {
        res.send(error);
    }
}

// Actualiza los productos de un carrito con un array de ids de productos dado (se lo paso por req.body)
export const updateArrayProducts = async (req,res,next) => {
    try {
            const carrito = await Cart.findOne({_id: req.params.cid})
            carrito.products = [] // reinicio el carrito
            
            let arrayProds = req.body // ["646bc84ff89d0072c10920b4","646bc784f89d0072c10920ac"]
            arrayProds.forEach(idProd => { // con cada id creo un prod 
                const nuevoProducto = {
                    id_prod: idProd,
                    cant: 1
                }
                carrito.products.push(nuevoProducto) // y lo agrego al array de products
            })

            await carrito.save()

            res.send('El carrito se actualizó correctamente')

    } catch (error) {
        res.send(error);
    }
}

// Actualiza la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
export const updateCartProductQuantity = async (req,res,next) => {
    try {
        let { cid, pid } = req.params
        let { quantity } = req.body

        const carrito = await Cart.findOne({_id: cid})
        carrito.products.id(pid).cant = quantity // como uso el metodo .id() le paso el _id no el id_prod 
        
        await carrito.save()

        res.send('La cantidad se actualizó correctamente')

    } catch (error) {
        res.send(error);
    }
}

// Elimina todos los productos del carrito
export const resetCart = async (req,res,next) => {
    try {
            const carrito = await Cart.findOne({_id: req.params.cid})
            carrito.products = [] // reinicio el carrito
            await carrito.save()

            res.send('Se eliminaron los productos correctamente')

    } catch (error) {
        res.send(error);
    }
}