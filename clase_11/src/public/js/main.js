const socket = io()

const row = document.getElementById('row')

socket.on('listado', data => {

    let productos = ''

    data.products.forEach(prod => {
        productos += 
        `<div class="col mb-4">
            <div class="card" style="width: 18rem;">
                <h5 class="card-header">${prod.title}</h5>
                <div class="card-body">
                    <h6 class="card-subtitle mb-2 text-body-secondary">${prod.description}</h6>
                    <p class="card-text">Código: ${prod.code}</p>
                    <p class="card-text">Precio: $${prod.price}</p>
                    <p class="card-text">Stock: ${prod.stock}</p>
                    <p class="card-text">Categoria: ${prod.category}</p>
                </div>
            </div>
        </div>`

    });
    row.innerHTML = productos
})