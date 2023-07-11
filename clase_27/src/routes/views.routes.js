import { Router } from "express";
import { login, signUp, profile, products, errorLogin, errorSignUp } from "../controllers/views.controller.js";

const viewsRouter = new Router()

viewsRouter.get('/', login)
viewsRouter.get('/signup', signUp)
viewsRouter.get('/profile', profile)
viewsRouter.get('/products', products)
viewsRouter.get('/errorLogin', errorLogin)
viewsRouter.get("/errorSignup", errorSignUp)


export default viewsRouter;