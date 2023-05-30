import { Router } from "express";
import Cart from '../models/Cart.js';

const cartRouter = new Router()

// Crea un carrito nuevo
cartRouter.post('/', async (req, res) => {
    try {
        await Cart.create({})
        res.send('Carrito creado exitosamente.')
    } catch (error) {
        res.send(error)
    }
})

// Devuelve los productos de un carrito segun id
cartRouter.get('/:cid', async (req, res) => {
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
})

// Agrega un producto a un carrito. Por body se le pasa quantity
cartRouter.post('/:cid/product/:pid', async (req, res) => {
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
})

// Elimina un producto del carrito seleccionado
cartRouter.delete('/:cid/products/:pid', async (req, res) => {
    try {
            let { cid, pid } = req.params
            const carrito = await Cart.findOne({_id: cid})
            carrito.products.id(pid).deleteOne();
            await carrito.save()

            res.send('El producto se eliminó del carrito correctamente')

    } catch (error) {
        res.send(error);
    }
})

// Actualiza los productos de un carrito con un array de ids de productos dado (se lo paso por req.body)
cartRouter.put('/:cid', async (req, res) => {
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
})


// Actualiza la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
cartRouter.put('/:cid/products/:pid', async (req, res) => {
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
})

// Elimina todos los productos del carrito
cartRouter.delete('/:cid', async (req, res) => {
    try {
            const carrito = await Cart.findOne({_id: req.params.cid})
            carrito.products = [] // reinicio el carrito
            await carrito.save()

            res.send('Se eliminaron los productos correctamente')

    } catch (error) {
        res.send(error);
    }
})

export default cartRouter