import passport from 'passport'
import 'dotenv/config'
import userModel from '../models/Users.js'
import cartModel from '../models/Cart.js'
import { createHash, validatePassword } from '../utils/bcrypt.js'
import { Strategy as LocalStrategy} from 'passport-local'
import { Strategy as GitHubStrategy} from 'passport-github2'


const initializePassport = () => {

    // Register
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const {email} = req.body
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

                // Crea un carrito para el usuario cuando se registra y le asocia el id
                const cart = await cartModel.create({})
                newUser.cart = cart._id


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


    // Github
    passport.use('github', new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:4000/api/sessions/github/callback"
      },
      async (accessToken, refreshToken, profile, done) => {
        const {name,email} = profile._json
        try {
            const userDB = await userModel.findOne({email})
    
            if(userDB){
                return done(null,userDB)
            }
    
            const user = {
                first_name: name.split(' ')[0],
                last_name: name.split(' ')[1] || '',
                email,
                password: ' '
            }
    
            // Crea un carrito para el usuario cuando se registra y le asocia el id
            const cart = await cartModel.create({})
            user.cart = cart._id


            const newUserDB = await userModel.create(user)
            done(null,newUserDB);
    
        } catch (error) {
            done(error)
        }
    }));
}


export default initializePassport