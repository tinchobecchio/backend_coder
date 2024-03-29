import CustomError from '../services/errors/CustomError.js'
import EErrors from '../services/errors/enums.js'
import { generateProductErrorInfo } from '../services/errors/info.js'
import { getAllProducts, getProdById, getProd, addNewProduct, updateProd, deleteProd } from '../services/products.service.js'

// Devuelve todos los productos o la cantidad deseada con limit
// ej url valida http://localhost:4000/api/products?limit=3&sort=1&page=2&category=alimentos&status=true
// esta ruta no la uso, en la vista de productos directamente llama al service para que traiga los prods sin el paginate
// para agregarle el cid a cada prod y asi añadirlo al carrito si lo clickea (problemas del handlebars)
export const getProducts = async (req,res,next) => {
    try {
        let { limit, sort, page, category, status } = req.query

        const productos = await getAllProducts(status, category, limit, page, sort)

        res.status(200).json({status: "success", payload: productos})
    } catch (error) {
        req.logger.error('Error trying to get products')
        res.status(400).json({error});
    }
}

// Devuelve el producto que coincide con el id
export const getProductById = async (req,res,next) => {
    try {
        const { pid } = req.params
        let producto = await getProdById(pid) // si no lo encuentra tira error y va al catch

        if(!producto) {
            CustomError.createError({
                name:"Getting product error",
                cause: 'The product ID is invalid',
                message: `The product with ID ${req.params.pid} doesn't exist.`,
                code:EErrors.INVALID_TYPES_ERROR
            })
        }

        return res.status(200).json({status: "success", payload: producto})

    } catch (error) {
        next(error)
    }
}

// Agrega un producto
export const addProduct = async (req,res,next) => {
    try {
        let {title, description, code, price, status, stock, category, thumbnails } = req.body

        // Validar que todos los campos sean obligatorios salvo thumbnails y status que se crea por defecto
        if (!title || !description || !code || !price || !stock || !category ) {
            CustomError.createError({
                name:"Product creation error",
                cause: generateProductErrorInfo({title, description, code, price, status, stock, category, thumbnails }),
                message:"Error trying to create a Product",
                code:EErrors.INVALID_TYPES_ERROR
            })
        }

        // Error si ya existe el producto con el code
        let producto = await getProd({code})
        if(producto) {
            CustomError.createError({
                name:"Product creation error",
                cause: "There is another product with the same code",
                message:"The product's code needs to be unique",
                code:EErrors.INVALID_TYPES_ERROR
            })
        }

        // Crea el producto
        const prod = { title, description, code, price, status, stock, category, thumbnails }
        // si el que lo crea es un usuario premium, se le agrega su email al campo owner (por defecto es admin)
        if(req.user.role === "premium"){
            prod.owner = req.user.email
        }
        const newProd = await addNewProduct(prod)
        return res.status(200).json({status: "success", payload: newProd})

    } catch (error) {
        next(error);
    }
}

// Actualiza un producto
export const updateProduct = async (req,res,next) => { // El premium solo puede modificar sus productos, el admin todos
    try {
        let {title, description, code, price, status, stock, category, thumbnails } = req.body
        let { pid } = req.params
        
        // si es un usuario premium y no es un producto suyo devuelve error
        const product = await getProdById(pid) 
        if(req.user.role === "premium" && product.owner !== req.user.email){
            CustomError.createError({
                name:"Updating product error",
                cause: "The product doesn't belong to the user",
                message:"You can't modify other's products",
                code:EErrors.AUTHORIZATION_ERROR
            })
        }

        // en caso que este todo bien lo modifica
        let obj = {title, description, code, price, status, stock, category, thumbnails }
        await updateProd(pid, obj)

        return res.status(200).json({status: "success", message:"The product has been updated successfully."})

    } catch (error) {
        next(error)
    }
}

// Elimina un producto
export const deleteProduct = async (req,res,next) => {// El premium solo puede borrar sus productos, el admin todos
    try {
        let { pid } = req.params

        // si es un usuario premium y no es un producto suyo devuelve error
        const product = await getProdById(pid) 
        if(req.user.role === "premium" && product.owner !== req.user.email){
            CustomError.createError({
                name:"Deleting product error",
                cause: "The product doesn't belong to the user",
                message:"You can't delete other's products",
                code:EErrors.AUTHORIZATION_ERROR
            })
        }

        // en caso de que sea su producto o sea el admin
        const prod = await deleteProd(pid)

        if(prod.deletedCount !== 1) { // si no lo pudo eliminar devuelve error
            CustomError.createError({
                name:"Deleting product error",
                cause: "Invalid Product ID",
                message:"The product's ID is not valid",
                code:EErrors.INVALID_TYPES_ERROR
            })
        }

        return res.status(200).json({status: "success", message: "The product has been deleted successfully."})
        
    } catch (error) {
        next(error)
    }
}