import { Router } from "express";
import { getCarts, createCart, getCartProducts, addCartProduct, deleteCartProduct, updateArrayProducts, updateCartProductQuantity, resetCart } from '../controllers/cart.controller.js'

const cartRouter = new Router()

cartRouter.get('/', getCarts)
cartRouter.post('/', createCart)
cartRouter.get('/:cid', getCartProducts)
cartRouter.post('/:cid/product/:pid', addCartProduct)
cartRouter.delete('/:cid/products/:pid', deleteCartProduct)
cartRouter.put('/:cid', updateArrayProducts)
cartRouter.put('/:cid/products/:pid', updateCartProductQuantity)
cartRouter.delete('/:cid', resetCart)

export default cartRouter