import { Router } from "express";
import { login, signUp, profile, products, errorLogin, errorSignUp, cart } from "../controllers/views.controller.js";
import { auth, authUser } from "../middlewares/auth.js";

import { mockingProds } from "../controllers/mocking.controller.js";

const viewsRouter = new Router()

viewsRouter.get('/', login)
viewsRouter.get('/signup', signUp)
viewsRouter.get('/profile', auth, profile)
viewsRouter.get('/products', auth, products)
viewsRouter.get('/errorLogin', errorLogin)
viewsRouter.get("/errorSignup", errorSignUp)
viewsRouter.get('/cart', authUser, cart)

//Desafio de mocking con faker
viewsRouter.get('/mockingproducts', mockingProds)

export default viewsRouter;