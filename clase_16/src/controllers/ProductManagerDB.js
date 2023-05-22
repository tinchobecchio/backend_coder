import Producto from '../models/Products.js';

export class ProductManagerDB {

    // Devuelve todos los productos de la base de datos
    async getProducts() {
        return await Producto.find().lean()
    }

    // Devuelve el producto segun id 
    async getProductById(id) {
        try {
            const product = await Producto.find({_id: id}).lean()
            console.log(product);
            if(product) return product
        } catch (error) {
            console.log(error)
        }
    }


    async addProduct(product) {
        // Extrae las propiedades del product
        let {title, description, code, price, status, stock, category, thumbnails } = product
        
        // Revisar que no haya otro producto igual
        let producto = await Producto.findOne({code})
        if(producto) {
            return ({error: 'El code se repite'})

        // Validar que todos los campos sean obligatorios salvo thumbnails y status que se crea por defecto
        } else if (!title || !description || !code || !price || !stock || !category ) {
            console.log('Todos los campos son obligatorios');
            return ({error: 'Todos los campos son obligatorios'})

        } else {
        // Crea el producto
        const prod = new Producto({ title, description, code, price, status, stock, category, thumbnails })

        // Guarda el producto en la base de datos
        await prod.save()
        }
    }


    // Actualizar un producto 
    async updateProduct(id, cambios) {
        let {title, description, code, price, status, stock, category, thumbnails } = cambios
        await Producto.findOneAndUpdate({_id: id}, {title, description, code, price, status, stock, category, thumbnails })
    }

    // Borra un producto dado un id
    async deleteProduct(id) {
        try {
            const eliminado = await Producto.findOneAndDelete({_id: id})
            if(eliminado) return eliminado
        } catch (error) {
            console.log(error)
        }
    }

}

export default ProductManagerDB