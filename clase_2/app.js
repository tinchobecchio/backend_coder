class ProductManager {
    constructor() {
        this.products = []
        this.i = 1
    }

    // Metodo para agregar un producto al array products
    addProduct(product) {
        let {title, description, price, thumbnail, code, stock} = product

        // Validar que no se repita el campo code
        if( this.products.some(p => p.code === code) ) {
            throw new Error('El code se repite')

        // Validar que todos los campos sean obligatorios
        } else if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error('Todos los campos son obligatorios');
        
        // Al agregarlo debe crearse con un id autoincrementable
        } else {
            product.id = this.i
            this.i++
            this.products.push(product)
        }
    }

    // Devuelve un array con todos los productos creados hasta el momento
    getProducts() {
        return this.products
    }

    // Busca un producto por id en el arreglo
    getProductById(id) {
        const product = this.products.find(p => p.id === id)

        //Devuelve error si no lo encuentra
        if (!product) {
            throw new Error('Not found')

        } else {
            return product
        }
    }
}

// Clase para crear un producto facil
class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}


/* ------------- Proceso de Testing ------------- */

let pm = new ProductManager()

// console.log(pm.getProducts())

// let product = new Product('producto de prueba', 'Este es un producto de prueba', 200, 'Sin imagen', 'abc123', 25)
// pm.addProduct(product)

// console.log(pm.getProducts());

// pm.addProduct(product)

// console.log(pm.getProductById(1232))
// console.log(pm.getProductById(1))



/* Productos Extras para Testear */

// let product1 = new Product('Agua', 'Agua mineral', 100, 'http://www.google.com/1', 1, 20)
// let product2 = new Product('Cerveza', 'Cerveza fresca', 300, 'http://www.google.com/2', 2, 3)
// let product3 = new Product('Aceite', 'Aceite de girasol', 200, 'http://www.google.com/3', 3, 10)
// let product4 = new Product('Arroz', 'Arroz que nunca se pasa', 50, 'http://www.google.com/4', 4, 10)
// pm.addProduct(product1)
// pm.addProduct(product2)
// pm.addProduct(product3)
// pm.addProduct(product4)
// console.log(pm.getProducts())


// A este le falta un campo para que tire error

// let product5 = new Product('Pan', 'Pan del dia', 100, 'http://www.google.com/5', 5) 
// pm.addProduct(product5)