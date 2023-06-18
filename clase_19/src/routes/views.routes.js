import { Router } from "express";

const viewsRouter = new Router()


// Login '/'
viewsRouter.get('/',(req,res,next) => {
    // Si ya esta logueado lo manda a la vista de productos
    if(req.user) {
       return res.redirect('/products')
    }  
    // Si no esta logueado muestra el formulario de login
    res.render('login', { 
        title: 'Login'
    })
})
 
// Registro
viewsRouter.get('/signup',(req,res,next) => {
    // Si ya esta logueado lo manda a la vista de productos
    if(req.user) {
        return res.redirect('/products')
    }  
    // Si no esta logueado muestra el formulario de signup
    res.render('signup', {
        title: 'Sign up'
    })
})

// Perfil
viewsRouter.get('/profile',(req,res,next) => {
    if(req.user) {
        const user = req.user
        return res.render('profile', {
            title: 'Perfil',
            first_name: user.first_name,
            last_name: user.last_name,
            gender: user.gender,
            age: user.age,
            role: user.role
        })
    } else {
        return res.redirect('/')
    }

})

// Vista de productos
viewsRouter.get('/products',async (req,res,next) => {
    // Si esta logueado le muestra la vista de productos
    if(req.user) {
        const user = req.user
        let productos
        await fetch('http://localhost:4000/api/products')
        .then(res => res.json())
        .then(data => {
            productos = data.docs
        })
        .catch(err => console.error(err))

        return res.render('products', {
            title: 'Productos',
            first_name: user.first_name,
            last_name: user.last_name,
            products: productos,
            role: user.role 
        })
    } else {
    // Si no esta logueado lo manda al login
        return res.redirect('/') 
    }
})

viewsRouter.get('/errorLogin',async (req,res,next) => {
    res.render('errorLogin', {
        title: 'Error Login',})
})

viewsRouter.get("/errorSignup", (req, res, next) => {
    res.render("errorSignup", {
        title: "Error Signup"
    })
})


export default viewsRouter;