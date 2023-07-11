import cartManager from "../persistencia/DAOs/MongoDAOs/cartMongo.js";

export const findAllCarts = async() => {
    try {
        const carts = await cartManager.findAll();
        return carts
    } catch (error) {
        return error
    }
}

export const createNewCart = async() => {
    try {
        const cart = await cartManager.createOne();
        return cart
    } catch (error) {
        return error
    }
}

// Devuelve los productos de un carrito segun id
export const getProducts = async (id) => {
    try {
        // Busca el carrito con el id
        const cart = await cartManager.findOneByid(id);
        let populatedCart = await cart.populate('products.id_prod') // populate para mostrar los productos completos

        return populatedCart.products
    

    } catch (error) {
        return error
    }
}

// Agrega un producto a un carrito. Por body se le pasa quantity
export const addProduct = async (cid,pid,quantity) => {
    try {
            const carrito = await cartManager.findOneByid(cid)

            if (!carrito) {return }

            const existingProd = carrito.products.id(pid)
            if(existingProd) {
                existingProd.cant += quantity
                carrito.save()
                return carrito
            }
            // agrega el producto si no existe y sino le suma la cantidad al existente (hacerlo)
            const nuevoProducto = {
                id_prod: pid,
                cant: quantity
            }

            carrito.products.push(nuevoProducto)
            carrito.save()

            return carrito

    } catch (error) {
        res.send(error);
    }
}

// Elimina un producto del carrito seleccionado
export const deleteProduct = async (cid, pid) => {
    try {
        const carrito = await cartManager.findOneByid({_id: cid})
        carrito.products.id(pid).deleteOne(); // como uso el metodo .id() le paso el _id como pid (no el id_prod )
        await carrito.save()
        return carrito
    } catch (error) {
        return error
    }
}

// Actualiza los productos de un carrito con un array de ids de productos dado (se lo paso por req.body)
export const updateArrayProds = async (cid, array) => {
    try {
        const carrito = await cartManager.findOneByid(cid)
        carrito.products = [] // reinicio el carrito
        
            // ["646bc84ff89d0072c10920b4","646bc784f89d0072c10920ac"]
        array.forEach(idProd => { // con cada id creo un prod 
            const nuevoProducto = {
                id_prod: idProd,
                cant: 1
            }
            carrito.products.push(nuevoProducto) // y lo agrego al array de products
        })

        await carrito.save()
        return carrito            

    } catch (error) {
        return error
    }
}

// Actualiza la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
export const updateProductQuantity = async (cid, pid, quantity) => {
    try {
        const carrito = await cartManager.findOneByid(cid)

        carrito.products.id(pid).cant = quantity // como uso el metodo .id() le paso el _id no el id_prod 
        await carrito.save()

        return carrito

    } catch (error) {
        return error;
    }
}

// Elimina todos los productos del carrito
export const resetCartProds = async (cid) => {
    try {
            const carrito = await cartManager.findOneByid(cid)
            carrito.products = [] // reinicio el carrito
            await carrito.save()

            return carrito

        } catch (error) {
            return error;
        }
    }