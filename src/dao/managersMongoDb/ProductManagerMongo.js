import { productModel } from '../models/product.model.js';

export default class ProductManager{


    constructor(){

    }

    	getProductsQuery = async (limit, page, sort, query) => {
		try {
            !limit && (limit = 10);
            !page && (page = 1);
            sort === 'asc' && (sort = 1);
            sort === 'des' && (sort = -1);

			const filter = query ? JSON.parse(query) : {};
			const queryOptions = { limit: limit, page: page, lean: true };

			if (sort === 1 || sort === -1) {
				queryOptions.sort = { price: sort };
			}

			const getProducts = await productModel.paginate(filter, queryOptions);
			getProducts.isValid = !(page <= 0 || page > getProducts.totalPages); // verificamos si el número de página proporcionado es válido y dentro del rango de páginas disponibles. Si no lo es, entonces getProducts.isValid se establecerá en falso.
			getProducts.prevLink =
				getProducts.hasPrevPage &&
				`http://localhost:8080/products?page=${getProducts.prevPage}&limit=${limit}`;
			getProducts.nextLink =
				getProducts.hasNextPage &&
				`http://localhost:8080/products?page=${getProducts.nextPage}&limit=${limit}`;

			getProducts.status = getProducts ? 'success' : 'error';

			return getProducts;
		} catch (error) {
			console.log(error.message);
		}
	};

    getProducts = async () => {
        try{
            return await productModel.find().lean()  
        }catch(error){
            console.log(error);
        }
    }

    addProduct = async (product) => {
        try {
            await productModel.create(product)
        } catch (error) {
            console.log(error)
        }
    }

    getProductById = async (idProduct) => {
        try {
            return await productModel.findOne({ _id: idProduct })
        } catch (error) {
            console.log(error)
        }
    }

    updateProduct = async (idProduct, product) =>{
        try{
            return await productModel.updateOne({ _id: idProduct } , product)
        }catch(error){
            console.log(error);
        }
    }
    
    deleteProduct = async (idProduct) => {
        try{
            return await productModel.deleteOne({_id: idProduct})
        }catch (error) {
            console.log(error)
        }
    }
}

