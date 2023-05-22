import { Router } from "express";
import ProductManagerDB from "../controllers/ProductManagerDB.js";

const productDBRouter = new Router()
const pm = new ProductManagerDB()

// Devuelve todos los productos o la cantidad deseada con limit
productDBRouter.get('/', async (req, res, next) => {
    try {
        const productos = await pm.getProducts()
        let { limit } = req.query
        
        // No se si tengo que dejarlo como un res.json o ponerle la vista con los productos
        // res.json(limit ? productos.slice(0, limit) : productos)
        res.render('home', {
            title: 'Productos',
            products: limit ? productos.slice(0, limit) : productos
        })
    } catch (error) {
        res.send(error);
    }

})

// Devuelve el producto que coincide con el id
productDBRouter.get('/:pid', async (req, res) => {
    try {
        let producto = await pm.getProductById(req.params.pid)
        console.log(producto);
        !producto 
            ? res.status(400).send(`El producto con id ${req.params.pid} no existe.`) 
            // : res.send(producto)
            : res.render('home', {
                title: 'Productos',
                products: producto
            })
    } catch (error) {
        res.send(error);
    }
})

// Agrega un producto
productDBRouter.post('/', async (req,res) => {
    try {
        const creado = await pm.addProduct(req.body)
        if(creado) { // si tiene algo es un mensaje de error por no pasar validacion
            res.status(400).send(creado)
        } else {
            res.send('Producto creado correctamente')
        }

    } catch (error) {
        res.send(error);
    }
})

// Actualiza un producto
productDBRouter.put('/:pid', async (req,res) => {
    try {
        await pm.updateProduct(req.params.pid, req.body)
        res.send('Producto actualizado correctamente')

    } catch (error) {
        res.send(error);
    }
})

// Elimina un producto
productDBRouter.delete('/:pid', async (req,res) => {
    try {
        let eliminado = await pm.deleteProduct(req.params.pid)
        !eliminado 
            ? res.status(400).send(`Error: el id ${req.params.pid} no existe.`) 
            : res.send('Producto eliminado correctamente')
    } catch (error) {
        res.send(error);
    }
})

export default productDBRouter