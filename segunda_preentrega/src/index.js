import 'dotenv/config'
import express from 'express'
import { engine } from 'express-handlebars'
import * as path from 'path'
import { __dirname, __filename } from './path.js'
import mongoose from 'mongoose'
import productRouter from './routes/product.routes.js'
import cartRouter from './routes/cart.routes.js'
import chatRouter from './routes/chat.routes.js'
import { Server } from 'socket.io'
import MessageManager from "./controllers/MessageManager.js";

// Configuraciones 
const app = express()

// Server HTTP
const httpServer = app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`))

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.resolve(__dirname, './public'))) // static files

// Configuraciones HBS
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))

// Conexion a la base de datos
mongoose.connect(process.env.URL_MONGODB_ATLAS)
.then(() => console.log('DB is connected'))
.catch((err) => console.log('Error en mongodb atlas:',err))

// RUTAS
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/chat', chatRouter)


// Socket.io
// Tuve que poner toda la logica aca en vez de en el chat.routes con el req.io 
// porque cada vez que actualizaba la pagina se creaba otra conexion y me duplicaba los mensajes y los usuarios
const io = new Server(httpServer, { cors: { origin: '*'}})

const msg = new MessageManager()

let clients = []
io.on('connection', socket => {
    console.log('Nuevo cliente conectado')
    
    socket.on('authOk', async (data) => { // cuando el usuario se autentico correctamente 
        let messages = await msg.getMessages() // trae los mensajes de la base de datos
        io.emit('messageLogs', messages) // le manda los mensajes del chat

        let text = `${data.user} se ha conectado`
        socket.broadcast.emit('newConnection', text) // avisa al resto que se conecto

        clients.unshift(data)
    
        if(clients.length > 9) {
            let listado = clients.slice(0,9)
            io.emit('onlineConnections', listado)
        } else {
            io.emit('onlineConnections', clients)
        }

    })
    socket.on('message', async (data) => { // cuando escucha un nuevo mensaje
        try {
            await msg.createMsg(data.user, data.message)
            let messages = await msg.getMessages() // trae los mensajes de la base de datos
            io.emit('messageLogs', messages) // emite un messageLogs con el array messages
        } catch (error) {
            console.log(error);
        }
    })

})
