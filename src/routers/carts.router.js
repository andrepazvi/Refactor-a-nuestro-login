import { Router } from "express";
import __dirname from '../../utils.js' 

import CartManager from "../dao/managersMongoDb/CartsManagerMongo.js";
import ProductManager from "../dao/managersMongoDb/ProductManagerMongo.js";



const router = Router();

const cmanager = new CartManager();
const pmanager = new ProductManager();

router.get('/' , async (req, res) => {
	try{
		const carts = await cmanager.getCarts();
		res.status(200).send({status:'success' , carts }); 
	}catch (error) {
		res.status(400).send({ error: error.message });
	}
})



router.post('/', async (req, res) => {
	try{
		const newCart = req.body; 
	}catch (error) {
		res.status(400).send({ error: error.message });
	}
})


router.get('/:cid' , async (req, res) => {

	try{
		const cartID = req.params.cid; 
		const getCart = await cmanager.getCartById(+cartID); 
		
		if (!getCart) {
			throw new Error(`Carrito con el id ${cartID} no existe`);
		}
		
		const getProductsCart = getCart.products; 
		res.status(200).send({status:'success' , getProductsCart }); 

	}catch (error) {
		res.status(400).send({ error: error.message });
	}
})


router.post('/:cid/product/:pid' , async (req, res) => {

	try {
		const cart = req.params.cid; 
		const product = req.params.pid; 
	
		const addProductToCart = await cmanager.addProductToCart(cart, product); 
	
		res.status(200).send({status:'success: producto agregado al carrito correctamente'}); 
		
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
})

//ruta para eliminar un producto de un carrito
router.delete('/:cid/product/:pid', async (req, res) => {
	const { cid, pid } = req.params;
	try {

		const getCartByID = await cmanager.getCartById(cid)
		if (!getCartByID) {
			return res.status(404).send({ error: 'Cart not found' });
		}

		const exist = getCartByID.products.find((prod) => prod.productID == pid);
		if (!exist) {
			return res.status(404).send({ error: 'Not found prod in cart' });
		}

		await cmanager.deleteProdInCart(cid, pid);

		res.status(200).send({ status: 'success', deletedToCart: exist });
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

//ruta para vaciar un carrito
router.delete('/:cid', async (req, res) => {
	const { cid } = req.params;
	try {
		const existCart = await cmanager.getCartById(cid)

		if (!existCart) {
			return res
				.status(404)
				.send({ Status: 'error', message: 'Cart not found' });
		}

		const emptyCart = await cmanager.deleteAllProductsInCart(cid);

		res.status(200).send({ status: 'success', emptyCart: emptyCart });
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
});

//Agregar un array de productos
router.put('/:cid', async (req, res) => {

	const { body } = req;
	const { cid } = req.params;

	try {
		const existCart = cmanager.getCartById(cid);
		if (!existCart) {
			return res.status(404).send({ Status: 'error', message: 'Cart not found' });
		}
		body.forEach(async (item) => {
			const existProd = await pmanager.getProductById(item.productID);
			if (!existProd) {
				return res.status(404).send({ Status: 'error', message: `Prod ${item.idx} not found` });
			}
		});

		const newCart = await cmanager.insertArrayProds(cid, body);
		res.status(200).send({ status: 'success', newCart: newCart });
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
});

//Ruta para modificar cantidad del producto
router.put('/:cid/product/:pid', async (req, res) => {
	const { cid, pid } = req.params;
	const { quantity } = req.body;
	try {

		const getCartByID = await cmanager.getCartById(cid);
		if (!getCartByID) {
			return res.status(404).send({ error: 'Cart not found' });
		}

		const exist = getCartByID.products.find((prod) => prod.productID.toJSON() === pid);
		if (!exist) {
			return res.status(404).send({ error: 'Not found prod in cart' });
		}

		const modStock = await cmanager.modifyQuantity(cid, pid, +quantity);
		res.status(200).send({ status: 'success', deletedToCart: modStock });
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});



export default router;

