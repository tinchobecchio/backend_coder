
import { promises as fs} from 'fs'

export class ProductManager {
    constructor(ruta) {
        this.path = ruta
        this.i = 1
    }

    // Agregar un producto al array del archivo
    async addProduct(product) {
        // Extraigo las variables del product
        let {title, description, price, thumbnail, code, stock} = product

        // Leer el archivo TXT y guardar el contenido en una constante
        const productos = await this.getProducts()

        // Validar que no se repita el campo code
        if(productos.some(p => p.code === code) ) {
            throw new Error('El code se repite')

        // Validar que todos los campos sean obligatorios
        } else if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error('Todos los campos son obligatorios');
        
        } else {
            // Al agregarlo debe crearse con un id autoincrementable
            product.id = this.i
            this.i++

            //Agregar el producto al array de la variable 
            productos.push(product)

            // Guardar el array de la variable en el archivo sobrescribiendolo
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

    // Actualizar un producto en el TXT dado el id, el campo y el nuevo valor
    async updateProduct(id, campo, valorNuevo) {
        
        // Guardo el array del archivo en una constante
        const productos = await this.getProducts()

        // Recorro los productos y si coincide con el id le cambio el campo por el valor deseado
        const actualizado = productos.map(product => {
            if(product.id === id) { 
                product[campo] = valorNuevo 
                return product
            } else {
                return product
            }
        })
        
        // Guardar el array actualizado en el archivo
        await fs.writeFile(this.path, JSON.stringify(actualizado))
    }

    // Borra un producto dado un id
    async deleteProduct(id) {
        // Chequeo que exista el producto con ese ID
        await this.getProductById(id)

        // Guardo el array del archivo en una constante
        const productos = await this.getProducts()

        // Filtrar los que no coinciden con el id
        const nuevo = productos.filter(product => product.id !== id)
        
        // Guardar el nuevo array en el archivo
        await fs.writeFile(this.path, JSON.stringify(nuevo))
    }
}

// Clase para crear un producto facil
export class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}


// // Creo el archivo con un array vacio
// const crearTXT = async () => {
//     await fs.writeFile('./info.txt', '[]')
// }
// await crearTXT()

// // Inicio el product manaager
// let pm = new ProductManager('./info.txt')

// console.log('Listado antes de agregar productos:')
// console.log(await pm.getProducts()) // Mostrar por consola lo que develve el getProducts()

// // Creo los productos
// let product1 = new Product('Agua', 'Agua mineral', 100, 'http://www.google.com/1', 1, 20)
// let product2 = new Product('Cerveza', 'Cerveza fresca', 300, 'http://www.google.com/2', 2, 3)
// let product3 = new Product('Aceite', 'Aceite de girasol', 200, 'http://www.google.com/3', 3, 10)
// let product4 = new Product('Arroz', 'Arroz que nunca se pasa', 50, 'http://www.google.com/4', 4, 10)
// let product5 = new Product('Azucar', 'Azucar refinada', 70, 'http://www.google.com/5', 5, 40)
// let product6 = new Product('Banana', 'Banana ecuatoriana', 350, 'http://www.google.com/6', 6, 25)
// let product7 = new Product('Vinagre', 'Vinagre de manzana', 90, 'http://www.google.com/7', 7, 10)
// let product8 = new Product('Manzana', 'Manzana roja', 80, 'http://www.google.com/8', 8, 15)
// let product9 = new Product('Avena', 'Avena instantanea', 150, 'http://www.google.com/9', 9, 22)
// let product10 = new Product('Zapallo', 'Zapallo cabutia', 180, 'http://www.google.com/10', 10, 16)
// let product11 = new Product('Leche', 'Leche entera', 280, 'http://www.google.com/11', 11, 24)

// // Agrego los productos al array
// await pm.addProduct(product1) // Añadir un product al archivo TXT
// await pm.addProduct(product2) // Añadir un product al archivo TXT
// await pm.addProduct(product3) // Añadir un product al archivo TXT
// await pm.addProduct(product4) // Añadir un product al archivo TXT
// await pm.addProduct(product5) // Añadir un product al archivo TXT
// await pm.addProduct(product6) // Añadir un product al archivo TXT
// await pm.addProduct(product7) // Añadir un product al archivo TXT
// await pm.addProduct(product8) // Añadir un product al archivo TXT
// await pm.addProduct(product9) // Añadir un product al archivo TXT
// await pm.addProduct(product10) // Añadir un product al archivo TXT
// await pm.addProduct(product11) // Añadir un product al archivo TXT


// console.log('Listado luego de agregar los productos:')
// console.log(await pm.getProducts()) // Mostrar por consola lo que develve el getProducts()


export default ProductManager