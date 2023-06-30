import mongoose from 'mongoose';
import 'dotenv/config'

// Conexion a la base de datos
mongoose.connect(process.env.URL_MONGODB_ATLAS)
.then(() => console.log('DB is connected'))
.catch((err) => console.log('Error en mongodb atlas:',err))