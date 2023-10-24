import fs from 'fs';

class ProductManager{

    constructor(filePath){
        this.path = filePath
        this.products = [];
    }


    getProducts = async () => {
        try{
            const productsList = await fs.promises.readFile(this.path,"utf-8")
            const productsListParse = JSON.parse(productsList)
            return productsListParse

        }catch{
            return this.products;
        }
    }

    addProduct = async (obj) => {

        const {title, description, price, thumbnail, code, stock} = obj
        if(!title || !description || !price || !thumbnail || !code || !stock){
            console.error("ERROR: Datos del producto incompletos")
            return 
        }

        const productList = await this.getProducts()
        const product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        for( const item of productList){
            if(item.code === product.code){
                console.error('ERROR: Codigo existente');
                return
            }
        }
        
        if(productList.length === 0){
            product.id = 1
        }else{
            product.id = productList[productList.length -1].id + 1; 
        }

        productList.push(product);

        await fs.promises.writeFile(this.path,JSON.stringify(productList,null,2)) 
    }

    

    getProductById = async (searchId) => {

        const products = await this.getProducts()
        for(const item of products){
            if(item.id === searchId){
                return item;
            }
        }
        return 'Not found'
    }

    updateProduct = async (id , obj) => {

        const pid = id

        const {title, description, price, thumbnail, code, stock} = obj

        if( !title || !description || !price || !thumbnail || !code || !stock){
          console.error("ERROR: Datos del producto incompletos")
          return 
        }
        
        const currentProductsList = await this.getProducts()

        for( const item of currentProductsList){
            if(item.code === code && item.id !== pid){ 
                return
            }
        }

        let newProductsList = currentProductsList.map(item => {
            if (item.id === pid) {
                const updatedProduct = {
                    ...item, 
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock,
                };
                return updatedProduct;
            }else{
                return item; 
            }     
           
        });

        await fs.promises.writeFile(this.path,JSON.stringify(newProductsList,null,2));
    }
            

    deleteProduct = async (searchId) => {
 
        const productsList = await this.getProducts();
        const existingCode = productsList.find(product =>product.id===searchId)
        if(!existingCode){
            console.error('ERROR: Codigo inexistente')
            return
        }

        const updatedProductsList = productsList.filter(product => product.id !== searchId); 
        await fs.promises.writeFile(this.path,JSON.stringify(updatedProductsList,null,2))
        console.log('Producto eliminado correctamente')
        return updatedProductsList;  
    }
}

export default ProductManager;
