import express from 'express'
import ProductManager from './ProductManager.js'

const app = express()
const PORT = 8080
const pm = new ProductManager('./info.txt')

app.get('/products', async (req, res) => {
    const productos = await pm.getProducts()
    let { limit } = req.query
    res.send(limit ? productos.slice(0, limit) : JSON.stringify(productos))
})

app.get('/products/:pid', async (req, res) => {
    let producto = await pm.getProductById(parseInt(req.params.pid))
    !producto ? res.send(`El producto con id ${req.params.pid} no existe.`) : res.send(JSON.stringify(producto))
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))