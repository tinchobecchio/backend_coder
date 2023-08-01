import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";

export const auth = (req,res,next) => {
    if(!req.user) { // Si no hay un usuario logueado
        // return res.status(401).json("Unauthorized");
        return res.redirect('/')
    }
    next(); // si esta todo bien prosiga
}

export const authUser = (req,res,next) => {
    try {
        
        if(!req.user) { // Si no hay un usuario logueado
            // return res.status(401).json("Unauthorized");
            return res.redirect('/')
        }
        if (req.user.role !== "user") { // Si el rol no es usuario
            // return res.status(403).json("Forbidden");
            CustomError.createError({
                name: "Unathorized",
                cause: "Not allowed",
                message:"You don't have the authorization to perfom this action",
                code: EErrors.AUTHORIZATION_ERROR
            })
        }
        next(); // si esta todo bien prosiga

    } catch (error) {
        next(error)
    }
}

export const authAdmin = (req,res,next) => {
    try {
        if(!req.user) { // Si no hay un usuario logueado
            // return res.status(401).json("Unauthorized");
            return res.redirect('/')
        }
        if (req.user.role !== "admin") { // Si el rol no es admin
            // return res.status(403).json("Forbidden");
            CustomError.createError({
                name: "Unathorized",
                cause: "Not allowed",
                message:"You don't have the authorization to perfom this action",
                code: EErrors.AUTHORIZATION_ERROR
            })
        }

        next(); // si esta todo bien prosiga

    } catch (error) {
        next(error)
    }
}