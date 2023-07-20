export const auth = (req,res,next) => {
    if(!req.user) { // Si no hay un usuario logueado
        // return res.status(401).json("Unauthorized");
        return res.redirect('/')
    }
    next(); // si esta todo bien prosiga
}

export const authUser = (req,res,next) => {
    if(!req.user) { // Si no hay un usuario logueado
        // return res.status(401).json("Unauthorized");
        return res.redirect('/')
    }
    if (req.user.role !== "user") { // Si el rol no es usuario
        return res.status(403).json("Forbidden");
    }
    next(); // si esta todo bien prosiga
}

export const authAdmin = (req,res,next) => {
    if(!req.user) { // Si no hay un usuario logueado
        // return res.status(401).json("Unauthorized");
        return res.redirect('/')
    }
    if (req.user.role !== "admin") { // Si el rol no es admin
        return res.status(403).json("Forbidden");
    }
    next(); // si esta todo bien prosiga
}