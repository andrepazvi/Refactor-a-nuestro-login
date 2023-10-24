const socketCliente = io();


socketCliente.on("productos", (products) => {
  console.log(products);
  updateProductList(products);
});


// Función para actualizar la lista de productos en la página web en 'localhost:8080/realtimeproducts'

const updateProductList = (products) => {
  let productListContainer = document.getElementById("products-list-container");
  let productsList = "";

  products.forEach((product) => {
    productsList += `
    
    <div class="card">
      <div class="card-content">
        <h4>${product.title}</h4>
        <div>
          <h5>Id: ${product.id}</h5>
        </div>
        <div>
          <p>${product.description}</p>
        </div>
        <div>
          <h5>Precio: ${product.price} $</h5>
        </div>
        <div>
          <a href="#">Buy Now</a>
        </div>
      </div>
    </div>`;
  });


  productListContainer.innerHTML = productsList;
}


let form = document.getElementById("formProduct");
form.addEventListener("submit", (event) => {
  event.preventDefault(); 

  let title = form.elements.title.value;
  let description = form.elements.description.value;
  let stock = form.elements.stock.value;
  let thumbnail = form.elements.thumbnail.value;
  let price = form.elements.price.value;
  let code = form.elements.code.value;
  let category = form.elements.category.value;

  // Emitir un evento "addProduct" al servidor con la información del nuevo producto
  socketCliente.emit("addProduct", {
    title,
    description,
    stock,
    thumbnail,
    price,
    code,
    category,
  });

  form.reset(); 
});

const deleteButton =  document.getElementById('delete-btn');

// Agregar un evento para cuando se haga clic en el botón de eliminación
deleteButton.addEventListener('click', () => {
  const idInput = document.getElementById('productID'); 
  const productID = idInput.value
  socketCliente.emit('deleteProduct' , productID);
  idInput.value = ""

})


socketCliente.on("updatedProducts", (obj) => {
  updateProductList(obj); 
});