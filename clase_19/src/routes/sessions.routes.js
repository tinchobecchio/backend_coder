import { Router } from "express";
import { getSession, login, destroySession, registerUser } from '../controllers/session.controller.js'
import passport from 'passport'

const sessionsRouter = new Router()

sessionsRouter.get('/', getSession)
sessionsRouter.post('/signup', passport.authenticate("register", { 
    failureRedirect: '/errorSignup' 
}), registerUser)
sessionsRouter.post('/login', passport.authenticate("login", { 
    failureRedirect: '/errorLogin'
}), login)
sessionsRouter.get('/logout', destroySession)

export default sessionsRouter;