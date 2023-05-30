import { Router } from "express";
import Producto from '../models/Products.js';

const productRouter = new Router()

// Devuelve todos los productos o la cantidad deseada con limit
// ej url valida http://localhost:4000/api/products?limit=3&sort=1&page=2&category=alimentos&status=true
productRouter.get('/', async (req, res, next) => {
    try {
        let { limit, sort, page, category, status } = req.query

        let sorter = {}
        sort ? sorter = {price: sort} : sorter = {price: 0}

        let query = {}
        category ? query.category = category : null
        status ? query.status = status : null

        const productos = await Producto.paginate(query,{limit: limit ?? 10, page: page ?? 1, sort: sorter})
        productos.status = "success"
        
        res.json(productos)
    } catch (error) {
        res.send(error);
    }

})

// Devuelve el producto que coincide con el id
productRouter.get('/:pid', async (req, res) => {
    try {
        let producto = await Producto.find({_id: req.params.pid}) // si no lo encuentra tira error y va al catch
        res.send(producto)

    } catch (error) {
        if(error.name === "CastError") { // si pasó mal el id 
            res.status(400).send(`El producto con id ${req.params.pid} no existe.`) 
        } else { 
            res.send(error);
        }
    }
})

// Agrega un producto
productRouter.post('/', async (req,res) => {
    try {
        let {title, description, code, price, status, stock, category, thumbnails } = req.body

        // Revisar que no haya otro producto con el mismo codigo
        let producto = await Producto.findOne({code})
        if(producto) { 
            res.status(400).send(`El producto con el code ${code} ya existe.`) 
        }

        // Validar que todos los campos sean obligatorios salvo thumbnails y status que se crea por defecto
        else if (!title || !description || !code || !price || !stock || !category ) {
            res.status(400).send(`Todos los campos son obligatorios.`)
        }
        else {
            // Crea el producto
            Producto.create({ title, description, code, price, status, stock, category, thumbnails })
            res.send(`El producto se ha creado correctamente.`)
        }

    } catch (error) {
        res.send(error);
    }
})

// Actualiza un producto
productRouter.put('/:pid', async (req,res) => {
    try {
        let {title, description, code, price, status, stock, category, thumbnails } = req.body

        await Producto.findOneAndUpdate({_id: req.params.pid},{title, description, code, price, status, stock, category, thumbnails })

        res.send('Producto actualizado correctamente')

    } catch (error) {
        res.send(error);
    }
})

// Elimina un producto
productRouter.delete('/:pid', async (req,res) => {
    try {
        await Producto.findOneAndDelete({_id: req.params.pid})
        res.send('Producto eliminado correctamente')
        
    } catch (error) {
        if(error.name === "CastError") { // si pasó mal el id 
            res.status(400).send(`El id ${req.params.pid} no es válido.`) 
        } else { 
            res.send(error);
        }
    }
})

export default productRouter