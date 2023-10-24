import  {Router}  from "express";
import __dirname from "../../utils.js";
import ProductManager from "../dao/managersMongoDb/ProductManagerMongo.js";
import CartManager from "../dao/managersMongoDb/CartsManagerMongo.js";


const router = Router();
const pmanager = new ProductManager() 
const cmanager = new CartManager() 


router.get('/home', async (req,res)=>{

    const listaProductos = await pmanager.getProducts()
    res.render('home' , {listaProductos, style:'style.css'})
})


//Ruta de productos con formulario para agregar mas productos (ruta para handlebars + websockets):
router.get('/realtimeproducts' , async (req,res) => {
    const listaProductos = await pmanager.getProducts({})
    res.render('realTimeProducts', {listaProductos, style:'style.css'})

})

//Ruta para el chat (handlebars + websockets):
router.get("/chat", async (req,res)=>{
    res.render("chat", {style:'style.css'})
})

//Vista de productos con su paginacion (pagination):
router.get("/products", async (req, res) => {

	const { limit, page, sort, query } = req.query;
	const user = req.session.user

	try {
		const products = await pmanager.getProductsQuery(
			limit,
			page,
			sort,
			query
		);
		res.render('products', { products: products, user: user  , style:'style.css' });
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

//Ruta con vista del carrito:

router.get('/carts/:cid', async (req, res) => {
	const { cid } = req.params;
	try {
		const carrito = await cmanager.getCartById(cid); 
		const carritoToObj = carrito.toObject() 
		console.log(carritoToObj)
		if (!carrito) {
			return res.status(404).send({ error: 'Cart not found' });
		}
		res.render("cart", carritoToObj ) 
	} catch (error) {
		res.status(500).send({ error: error.message });
		console.log(error)
	}
});



const checkSession = (req, res, next) => {
	if (!req.session.user) {
		res.clearCookie('connect.sid');
		return res.redirect('/login');
	}

	next(); 
}

const sessionExist = (req, res, next) => {
	if (req.session.user) {
		return res.redirect('/home');
	}
	next();
}

//Middleware para permisos de user y admin:
const permission = (req, res, next) => {
	if (req.session.user.rol === 'user') {
		const requestedUrl = req.originalUrl;
		return res.redirect(
			`/home?message=No%20tienes%20permisos%20para%20ingresar%20a%20${requestedUrl}.`
		);
	}
	next();
}

//Rutas para Session: 

router.get('/', async (req, res) => {
	try {
		res.status(200).redirect('/login');
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
});

//Vista para logearse:
router.get('/login', sessionExist, (req, res) =>{
	res.render('login' , {style:'style.css'});
})

//Vista para registrarse:
router.get('/register' ,sessionExist, (req, res) => {
	res.render('register' , {style:'style.css'})
})

//Vista para el perfil del usuario:
router.get('/profile' ,checkSession,  (req, res) => {
	const user = req.session.user
	res.render('profile' , {user: user , style:'style.css'});
})

export default router;


 
