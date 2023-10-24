import fs from 'fs';

class CartManager {

    constructor(path){
        this.path = path; 
        this.carts = [];
    }

    addCart = async () => {
        
        const carrito = {
            products: [],
        }

        if(this.carts.length === 0){
            carrito.id = 1 
        }else{
            carrito.id = this.carts[this.carts.length - 1].id + 1
        }

        this.carts.push(carrito);

        await fs.promises.writeFile(this.path,JSON.stringify(this.carts,null,2)) 
        
    }

    getCarts = async () => {
        
        try{
            const carts = await fs.promises.readFile(this.path,"utf-8")
            const cartsParse = JSON.parse(carts)
            return cartsParse

        }catch{
            return this.carts
        }
    }

    getCartById = async (searchId) => {

        const carts = await this.getCarts()
        for(const cart of carts){
            if(cart.id === +searchId){
                return cart;
            }
        }
        return 'Not found'
    }


    addProductToCart = async (cId , pId) => {

        const carts = await this.getCarts(); 
        const filterCart = carts.find(cart => cart.id === +cId); 
        const productIndex = filterCart.products.findIndex(item => item.id === +pId); 

        if(productIndex !== -1){
            filterCart.products[productIndex].quantity += 1;
            filterCart.products.push({id:+pId, quantity: 1}) 
        }

        await fs.promises.writeFile(this.path,JSON.stringify(carts,null,2))

    }

}


export default CartManager;
