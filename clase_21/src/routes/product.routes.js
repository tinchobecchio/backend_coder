import { Router } from "express";
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct } from '../controllers/products.controller.js'

const productRouter = new Router()

productRouter.get('/', getProducts)
productRouter.get('/:pid', getProductById)
productRouter.post('/', addProduct)
productRouter.put('/:pid', updateProduct)
productRouter.delete('/:pid', deleteProduct)

export default productRouter