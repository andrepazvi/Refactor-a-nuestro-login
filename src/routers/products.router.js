import { Router } from 'express';
import __dirname from '../../utils.js'
import ProductManager from '../dao/managersMongoDb/ProductManagerMongo.js';


const router = Router()

const pmanager = new ProductManager()


router.get('/' , async (req, res) => {
    const { limit, page, sort, query } = req.query;
	try {
		const prods = await pmanager.getProductsQuery(
			limit,
			page,
			sort,
			query
		);

		res.status(200).send({ status: 'success', prods: prods });
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
});


//Ruta para manejar las solicitudes GET para recuperar un producto específico por su ID
router.get('/:pid' , async (req, res) => {
    try{
        const {pid} = req.params
        const product = await pmanager.getProductById(pid)

        res.status(200).send({status:'success', product});
    }catch(error){
        res.status(400).send('Producto inexistente', error.message);
        return error;
    }
});

// Ruta para agregar un producto. 
router.post('/' , async (req, res) => {

    try {
        const newProduct = req.body                            
        const addProduct = await pmanager.addProduct(newProduct) 
        res.status(200).send({status:"Sucess: Producto agregado"})    
    } catch (error) {
        res.status(400).send('Error al agregar el producto:', error.message);
        return error;
    }
})

//Ruta para modificar un producto por ID
router.put('/:pid' , async (req, res) => {
    try {
        const productID = req.params.pid 
        const update = req.body     
        const productUpdate = await pmanager.updateProduct(productID,update); 

        res.send({status:'Sucess: product updated', productUpdate});
    } catch (error) {
        res.status(400).send('Error al modificar el producto:', error.message);
        return error; 
    }
})

//Ruta para eliminar un producto
router.delete('/:pid', async (req, res) => {

    try {
        let {pid} = req.params                                 
        const productDeleted = await pmanager.deleteProduct(pid);  
    
        res.send({status:'Sucess: Producto eliminado'});               
    } catch (error) {
        res.status(400).send('Error al eliminar el producto:', error.message);
        return error; 
    }
});

export default router; 



