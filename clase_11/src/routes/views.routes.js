import express from 'express';
import ProductManager from '../ProductManager.js'

const viewsRouter = express.Router()
const pm = new ProductManager('./products.txt')

// Vista del home sin sockets
viewsRouter.get('/', async (req, res) => {
    try {
        const productos = await pm.getProducts()
        if (productos) {
            res.render('home', {
                title: 'Home',
                products: productos
            })   
        } else {
            res.send('No se encontraron productos')
        }
    } catch (error) {
        console.log(error);
    }
})

// Vista de /realtimeproducts con sockets para que se actualice en tiempo real
viewsRouter.get('/realtimeproducts', async (req, res) => {
    try {
        // cuando entra a /realtimeproducts se da el connection y le manda los productos por socket
        req.io.on('connection', async(socket) => {

            console.log('Cliente conectado');

            const products = await pm.getProducts()
            req.io.emit('listado', {products: products})
        })

        // muestra la plantilla de realtimeproducts
        res.render('realTimeProducts', {
            title: 'realtimeproducts'
        })   
    } catch (error) {
        console.log(error)
    }

})

export default viewsRouter;