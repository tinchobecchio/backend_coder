import { getAllProducts, getProdById, getProd, addNewProduct, updateProd, deleteProd } from '../services/products.service.js'

// Devuelve todos los productos o la cantidad deseada con limit
// ej url valida http://localhost:4000/api/products?limit=3&sort=1&page=2&category=alimentos&status=true
export const getProducts = async (req,res,next) => {
    try {
        let { limit, sort, page, category, status } = req.query

        const productos = await getAllProducts(status, category, limit, page, sort)
        productos.status = "success"

        res.status(200).json(productos)
    } catch (error) {
        res.status(400).json({error});
    }
}

// Devuelve el producto que coincide con el id
export const getProductById = async (req,res,next) => {
    try {
        const { pid } = req.params
        let producto = await getProdById(pid) // si no lo encuentra tira error y va al catch

        if(!producto) {
            return res.status(400).send(`El producto con id ${req.params.pid} no existe.`)
        }

        return res.status(200).json(producto)

    } catch (error) {
        return res.status(400).json(error);
    }
}

// Agrega un producto
export const addProduct = async (req,res,next) => {
    try {
        let {title, description, code, price, status, stock, category, thumbnails } = req.body

        // Validar que todos los campos sean obligatorios salvo thumbnails y status que se crea por defecto
        if (!title || !description || !code || !price || !stock || !category ) {
            return res.status(400).json({error: `Todos los campos son obligatorios.`})
        }

        // Error si ya existe el producto con el code
        let producto = await getProd({code})
        if(producto) { 
            return res.status(400).json({error: `El producto con el code ${code} ya existe.`}) 
        }

        // Crea el producto
        const newProd = await addNewProduct({ title, description, code, price, status, stock, category, thumbnails })
        return res.status(200).json({message: `El producto se ha creado correctamente.`, newProd})

    } catch (error) {
        res.send(error);
    }
}

// Actualiza un producto
export const updateProduct = async (req,res,next) => {
    try {
        let {title, description, code, price, status, stock, category, thumbnails } = req.body
        let { pid } = req.params

        let obj = {title, description, code, price, status, stock, category, thumbnails }
        
        await updateProd(pid, obj)

        return res.status(200).json({message:'Producto actualizado correctamente'})

    } catch (error) {
        res.status(400).json(error);
    }
}

// Elimina un producto
export const deleteProduct = async (req,res,next) => {
    try {
        let { pid } = req.params
        const prod = await deleteProd(pid)
        console.log(prod);
        if(prod.deletedCount === 1) {
            return res.status(200).json({message: 'Producto eliminado correctamente'})
        }
        return res.status(400).json({error: `El id ${pid} no es válido.`}) 
        
    } catch (error) {
        return res.status(400).json({error})
    }
}