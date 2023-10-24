import { cartModel } from '../models/carts.model.js'
import { productModel } from '../models/product.model.js';


export default class CartManager{


    constructor(){
    
    }

    getCarts = async () => {
        try{
            const carts = await cartModel.find();
            return carts;
        }catch(error){
            console.log('Error al obtener los carritos:', error.message);
            return []
        }
    }


    getCartById = async (idCart) => {
        try{
            const cart = await cartModel.findOne({_id: idCart});
            return cart;
        }catch(error){
            console.log('Carrito inexistente:',error.message);
            return error;
        }
    }

    addCart = async (products) => {
        try{

            let cartData = {};
            if (products && products.length > 0) {
                cartData.products = products;
            }
            return await cartModel.create(cartData);

        }catch(error){
            console.log('Error al crear el carrito:', error.message);
            return error;
        }
    }

    addProductToCart = async (cid, pid) => {

        try{
            const cart = await cartModel.findOne({_id: cid});
            
            const addProduct = await productModel.findOne({_id: pid});
            const productIndex = cart.products.findIndex(item => item.productID.toString() == addProduct._id.toString()); 
            
            if(productIndex !== -1){
                cart.products[productIndex].quantity += 1; 
            }else{
                cart.products.push({productID: pid}) 
            }

            await cartModel.updateOne({_id: cid}, cart);

        }catch(error){
            console.log('Error al agregar el producto al carrito:' ,error.message);
            return error;
        }
    }

    //eliminar un producto en el carrito
    deleteProdInCart = async (cid, pid) => {
		try {
			const cart = await cartModel.findOne({ _id: cid });
            const product = await productModel.findOne({_id: pid})
			const filter = cart.products.filter((item) => item.productID.toString() !== product._id.toString());
			await cartModel.updateOne({ _id: cid }, { products: filter });

		} catch (error) {
			console.log('Error al eleminar un producto del carrito:', error.message);
            return error;
		}
	};

    //metodo para agregar un producto a un carrito y especificar la cantidad por body. 
    modifyQuantity = async (cid, pid, quantity) => {
		try {
			const filter = { _id: cid, 'products.productID': pid };

			const update = { $set: { 'products.$.quantity': quantity } };

			const updatedCart = await cartModel.findOneAndUpdate(filter, update, {
				new: true,
			}); 
			return updatedCart;
		} catch (error) {
			console.log('Error al agregar un producto al carrito:', error.message);
            return error;
		}
	};

    //metodo para eliminar todos los productos de un carrito
	deleteAllProductsInCart = async (cid) => {
		try {
			const filter = { _id: cid };
			const update = { $set: { products: [] } };

			const updateCart = await cartModel.findOneAndUpdate(filter, update, {
				new: true,
			});
			return updateCart;
		} catch (error) {
			console.log('Error al eliminar todos los productos:', error.message);
		}
	};

    //metodo para agregar un array de productos en un carrito
	insertArrayProds = async (cid, body) => {
		try {
			const arr = [];
			for (const item of body) {
				const object = await productModel.findById(item.productID);
				arr.push({
					productID: object._id,
					quantity: item.quantity
				});
			}
			const filter = { _id: cid };
			const update = { $set: { products: arr } };

			const updateCart = await cartModel.findOneAndUpdate(filter, update, {
				new: true,
			});
			return updateCart;
		} catch (error) {
			console.log(error.message);
		}
	};


}