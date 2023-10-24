const addToCartButtons = document.querySelectorAll('.card button#addToCart'); 

addToCartButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.card');
    
    const productID = card.querySelector('.card-id').textContent;
    console.log(productID)

    fetch(`api/carts/64ffd4e3c9a5f9185e3994d4/product/${productID}`, {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); 
      })
      .catch((error) => {
        console.error('Error:', error); 
      });
  });
});

