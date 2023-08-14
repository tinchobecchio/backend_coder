import config from "../config/config.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import jwt from "jsonwebtoken";

// export const auth = (req,res,next) => {
//     if(!req.user) { // Si no hay un usuario logueado
//         // return res.status(401).json("Unauthorized");
//         return res.redirect('/')
//     }
//     next(); // si esta todo bien prosiga
// }

// export const authUser = (req,res,next) => {
//     try {
        
//         if(!req.user) { // Si no hay un usuario logueado
//             // return res.status(401).json("Unauthorized");
//             return res.redirect('/')
//         }
//         if (req.user.role !== "user") { // Si el rol no es usuario
//             // return res.status(403).json("Forbidden");
//             CustomError.createError({
//                 name: "Unathorized",
//                 cause: "Not allowed",
//                 message:"You don't have the authorization to perfom this action",
//                 code: EErrors.AUTHORIZATION_ERROR
//             })
//         }
//         next(); // si esta todo bien prosiga

//     } catch (error) {
//         next(error)
//     }
// }

// export const authAdmin = (req,res,next) => {
//     try {
//         if(!req.user) { // Si no hay un usuario logueado
//             // return res.status(401).json("Unauthorized");
//             return res.redirect('/')
//         }
//         if (req.user.role !== "admin") { // Si el rol no es admin
//             // return res.status(403).json("Forbidden");
//             CustomError.createError({
//                 name: "Unathorized",
//                 cause: "Not allowed",
//                 message:"You don't have the authorization to perfom this action",
//                 code: EErrors.AUTHORIZATION_ERROR
//             })
//         }

//         next(); // si esta todo bien prosiga

//     } catch (error) {
//         next(error)
//     }
// }

// export const authJWT = (req,res,next) => {
//     try {
//         // traemos la cookie
//         const token = req.cookies[config.jwt_cookie]
//         // error si no existe el token
//         if(!token) {
//             return res.status(401).json({error: 'No autenticado'})
//         }

//         // verificar el token
//         jwt.verify(token, config.jwt_secret, (err,data) => {
//             if(err) return res.status(403).json({error: 'No autorizado, token no válido'})
            
//             // si esta todo bien guardo el user en req.user
//             req.user = data
//             next()
//         })
//     } catch (error) {
//         console.log(error);
//     }
// }

export const customJWTPolicy = (roles) =>{
    return (req,res,next) =>{
        try {
            if(roles[0].toUpperCase()==="PUBLIC") return next(); // Si es ruta publica que pase directamente

            // extraer user de cookies y meterlo en el req.user
            const token = req.cookies[config.jwt_cookie]
            if(!token) {
                return res.status(401).json({error: 'No autenticado'})
            }
            jwt.verify(token, config.jwt_secret, (err,data) => {
                if(err) return res.status(403).json({error: 'No autorizado, token no válido'})
                req.user = data
            })
            
            // Aplicar politicas de autorizacion            
            // debe estar logueado
            if(!req.user) return res.status(401).send({status:"error",error:"Not authenticated"}) 
            
            // debe estar autorizado (su rol tiene que estar en el array de roles que se le pasa a la funcion)
            if(!roles.includes(req.user.role.toUpperCase())) return res.status(403).send({status:"error",error:"Not authorized"})

            next();
        } catch (error) {
            console.log(error);
        }
    }
}