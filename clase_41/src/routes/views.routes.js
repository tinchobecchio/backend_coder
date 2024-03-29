import { Router } from "express";
import { login, signUp, profile, products, errorLogin, errorSignUp, cart, resetPass, resetPassMailSent, resetPassError, newPass } from "../controllers/views.controller.js";
import { customJWTPolicy } from "../middlewares/auth.js";

import { mockingProds } from "../controllers/mocking.controller.js";

const viewsRouter = new Router()

viewsRouter.get('/', customJWTPolicy(["PUBLIC"]), login)
viewsRouter.get('/signup', customJWTPolicy(["PUBLIC"]), signUp)
viewsRouter.get('/errorLogin', customJWTPolicy(["PUBLIC"]), errorLogin)
viewsRouter.get("/errorSignup", customJWTPolicy(["PUBLIC"]),errorSignUp)
viewsRouter.get('/profile', customJWTPolicy(["USER","PREMIUM","ADMIN"]), profile)
viewsRouter.get('/products', customJWTPolicy(["USER","PREMIUM","ADMIN"]), products)
viewsRouter.get('/cart', customJWTPolicy(["USER","PREMIUM"]), cart)

//Desafio de mocking con faker
viewsRouter.get('/mockingproducts', mockingProds)

// Reset pass
// estas rutas son publicas ya que no tenemos ningun usuario logueado,
// es alguien sin loguear que quiere restablecer la contraseña
// si son PUBLIC el middleware devuelve next directamente
viewsRouter.get('/resetpass', customJWTPolicy(["PUBLIC"]), resetPass)
viewsRouter.get('/resetpass/mailsent', customJWTPolicy(["PUBLIC"]), resetPassMailSent)
viewsRouter.get('/resetpass/mailerror', customJWTPolicy(["PUBLIC"]), resetPassError)
viewsRouter.get('/resetpass/newpass/:token', customJWTPolicy(["PUBLIC"]), newPass)

export default viewsRouter;