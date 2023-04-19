import { Router } from 'express'
import ProductManager from '../ProductManager.js'

const productRouter = new Router()
const pm = new ProductManager('./products.txt')

// Devuelve todos los productos o la cantidad deseada con limit
productRouter.get('/', async (req, res) => {
    try {
        const productos = await pm.getProducts()
        let { limit } = req.query
        res.send(limit ? productos.slice(0, limit) : JSON.stringify(productos))

    } catch (error) {
        res.send(error);
    }
})

// Devuelve el producto que coincide con el id
productRouter.get('/:pid', async (req, res) => {
    try {
        let producto = await pm.getProductById(parseInt(req.params.pid))
        !producto ? res.send(`El producto con id ${req.params.pid} no existe.`) : res.send(JSON.stringify(producto))
        
    } catch (error) {
        res.send(error);
    }
})

// Agrega un producto
productRouter.post('/', async (req,res) => {
    try {
        await pm.addProduct(req.body)
        res.send('Producto creado correctamente')

    } catch (error) {
        res.send(error);
    }
})

// Actualiza un producto
productRouter.put('/:pid', async (req,res) => {
    try {
        await pm.updateProduct(parseInt(req.params.pid), req.body)
        res.send('Producto actualizado correctamente')

    } catch (error) {
        res.send(error);
    }
})

// Elimina un producto
productRouter.delete('/:pid', async (req,res) => {
    try {
        await pm.deleteProduct(parseInt(req.params.pid))
        res.send('Producto eliminado correctamente')

    } catch (error) {
        res.send(error);
    }
})



export default productRouter