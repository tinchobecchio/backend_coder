import express from 'express'
import { engine } from 'express-handlebars'
import { __dirname, __filename } from './path.js'
import * as path from 'path'
import productRouter from './routes/product.routes.js'
import cartRouter from './routes/cart.routes.js'
import viewsRouter from './routes/views.routes.js'
import { Server } from 'socket.io'

// Configuraciones
const app = express()
const PORT = 8080

// Server HTTP
const httpServer = app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

// Config
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views') )

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Socket.io
const io = new Server(httpServer, { cors: { origin: '*'}})

app.use((req, res, next) => {
  req.io = io
  return next()
});

// Routes
app.use('/', express.static(__dirname + '/public'))
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

// HBS
app.use('/', viewsRouter)

