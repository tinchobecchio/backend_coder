
export const getSession = (req,res,next) => {
    if(req.session.login) {
        res.status(200).json({message: "Session active"})
    } else {
        res.status(401).json({message: "Session inactive"})
    }
}

export const login = async (req,res,next) => {
    try {
        // if (!req.user) { 
        //     return res.status(401).send({ status: "error", error: "Usuario invalido" })
        // }
        //Genero la sesion de mi usuario
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            gender: req.user.gender,
            email: req.user.email,
            role: req.user.role
        }
        req.session.login = true
        // res.status(200).send({ status: "success", payload: req.user })
        res.redirect('/products')

    } catch (error) {
        res.status(500).send({ status: "Error", error: error.message })
    }
}

export const destroySession = (req,res,next) => {
    if(req.session) {
        // req.session.destroy(() => res.status(200).json({message: "Session destroyed"}))
        req.session.destroy(() => res.redirect('/'))
    }
}

export const registerUser = async (req,res,next) => {
    // res.send({status: "success", message: "User created successfully"})
    res.redirect('/')
} 