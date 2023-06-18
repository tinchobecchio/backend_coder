import local from 'passport-local'
import passport from 'passport'
import userModel from '../models/Users.js'
import { createHash, validatePassword } from '../utils/bcrypt.js'

const LocalStrategy = local.Strategy

const initializePassport = () => {

    // Register
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const {first_name, last_name, email, gender, age} = req.body
            try {
                const user = await userModel.findOne({email: email})

                if(user) {
                    return done(null, false) // Usuario ya registrado
                }

                // Nuevo usuario
                const passwordHash = createHash(password)
                const newUser = {
                    ...req.body,
                    password: passwordHash
                }
                // Rol de administrador
                if(email === 'adminCoder@coder.com') {
                    newUser.role = 'admin'
                }

                const userCreated = await userModel.create(newUser)
                

                return done(null, userCreated)

            } catch (error) {
                return done(error)
            }
        }
    ))

    //Config de sessions
        //Inicializar la session
    passport.serializeUser((user, done) => {
        done(null,user._id)
    })

        // Eliminar la session del user
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null,user)
    })

    // Login
    passport.use('login', new LocalStrategy(
        { usernameField: 'email' }, 
        async (username, password, done) => {
            try {
                const user = await userModel.findOne({email: username})

                if(!user) { // No se encuentra el usuario
                    return done(null, false)
                }

                if(!validatePassword(password, user.password)) { 
                    return done(null, false) // Contraseña invalida
                }

                return done(null, user)// Usuario Logueado


            } catch (error) {
                return done(error)
            }
        }
    ))
}


export default initializePassport