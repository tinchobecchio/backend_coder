import { promises as fs} from 'fs'

export class ProductManager {
    constructor(ruta) {
        this.path = ruta
        this.i = 1
    }

    // Agregar un producto al array del archivo
    async addProduct(product) {
        // Leer el archivo TXT y guardar el contenido en una constante
        const productos = await this.getProducts()

        // Extraigo las variables del product para validar despues
        let {title, description, code, price, status, stock, category, thumbnails } = product

        // Validar que no se repita el campo code
        if(productos.some(p => p.code === code) ) { 
            console.log('El code se repite')
            return ({error: 'El code se repite'})

        // Validar que todos los campos sean obligatorios salvo thumbnails
        } else if (!title || !description || !code || !price || !status || !stock || !category ) {
            console.log('Todos los campos son obligatorios');
            return ({error: 'Todos los campos son obligatorios'})

        } else {
            // Al agregarlo debe crearse con un id autoincrementable
            product.id = this.i
            this.i++

            //Agregar el producto al array productos
            productos.push(product)

            // Guardar el array en el archivo 
            await fs.writeFile(this.path, JSON.stringify(productos))
        }
    }

    // Devuelve el array con los productos del archivo
    async getProducts() {
        const consulta = await fs.readFile(this.path, 'utf-8')
        const respuesta = JSON.parse(consulta)
        return respuesta
    }

    // Busca un producto por id en el arreglo
    async getProductById(id) {

        // Leer el archivo TXT y guardar el contenido en una variable
        const productos = await this.getProducts()

        // Buscar el producto en el array
        const product = productos.find(p => p.id === id)

        //Devuelve error si no lo encuentra
        if (!product) {
            console.log('No se encuentra el producto')
            return
        // Devolver el producto en formato objeto si lo encuentra
        } else {
            return product
        }
    }

    // Actualizar un producto en el TXT dado el id y un objeto con el campo y el nuevo valor
    async updateProduct(id, cambios) {
        // Guarda los campos que se van a cambiar en un array
        const keysCambios = Object.keys(cambios)

        // Guarda el array de productos en una constante
        const productos = await this.getProducts()

        // Actualiza los campos del producto que tenga el id dado con los nuevos valores
        productos.forEach(p => {
            if(p.id === id) keysCambios.forEach(key => p[key] = cambios[key]) 
        })

        // Guardar el array actualizado en el archivo
        await fs.writeFile(this.path, JSON.stringify(productos))
    }

    // Borra un producto dado un id
    async deleteProduct(id) {
        // Chequeo que exista el producto con ese ID
        await this.getProductById(id) // Si no lo encuentra devuelve error

        // Guardo el array del archivo en una constante
        const productos = await this.getProducts()

        // Filtrar los que no coinciden con el id
        const nuevo = productos.filter(product => product.id !== id)
        
        // Guardar el nuevo array en el archivo
        await fs.writeFile(this.path, JSON.stringify(nuevo))
    }
}

export default ProductManager