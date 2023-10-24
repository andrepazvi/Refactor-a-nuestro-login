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

// //Test

// const productManager = new ProductManager('./products.json');
// (async () => {

//     //=========array vacio=================

//     const noProducts = await productManager.getProducts();
//     console.log('All Products:', noProducts);


//     //===============metodo addProduct:===============

//     await productManager.addProduct(
//         'Monitor Asus',
//         'Monitor led 24" 75hz',
//         59.99,
//         'path/to/image1.jpg',
//         'PRD001',
//         100
//     );

//     await productManager.addProduct(
//         'Samsung Galaxy S23',
//         'nuevo con caja sellada',
//         800.50,
//         'path/to/image2.jpg',
//         'PRD002',
//         15
//     );

//     await productManager.addProduct(
//         'Monitor presonus eris 5',
//         'Monitores de estudio',
//         300.25,
//         'path/to/image2.jpg',
//         'PRD003',
//         28
//     );

//     await productManager.addProduct(
//         'Monitor samsung',
//         'Monitor led 32" 144hz',
//         59.99,
//         'path/to/image1.jpg',
//         'PRD004',
//         22
//     );

//     await productManager.addProduct(
//         'Samsung Galaxy S23 ultra',
//         'nuevo con caja sellada',
//         100.50,
//         'path/to/image2.jpg',
//         'PRD005',
//         93
//     );

//     await productManager.addProduct(
//         'Monitores kkr 10',
//         'Monitores de estudio',
//         300.25,
//         'path/to/image2.jpg',
//         'PRD006',
//         82
//     );

//     await productManager.addProduct(
//         'Teclado mecanico logitech',
//         'teclado con switch blue',
//         25,
//         'path/to/image2.jpg',
//         'PRD007',
//         500
//     );

//     await productManager.addProduct(
//         'Parlante JBL Go 4',
//         'Parlante inalambrico Hi-Fi',
//         30,
//         'path/to/image2.jpg',
//         'PRD008',
//         102
//     );

//     await productManager.addProduct(
//         'Go Pro Hero 9',
//         'Camara de accion',
//         30,
//         'path/to/image2.jpg',
//         'PRD009',
//         12
//     );

//     await productManager.addProduct(
//         'Traje neopren Oneil',
//         'traje grueso neopren',
//         200,
//         'path/to/image2.jpg',
//         'PRD010',
//         5
//     );

//     //============metodo getProducts:=============

//     const allProducts = await productManager.getProducts();
//     console.log('All Products:', allProducts);

//     //==========metodo getProductByID:============

//     const productById = await productManager.getProductById(2);
//     console.log('Product with ID 1:', productById);

//     //============metodo updateProduct:==============

//     await productManager.updateProduct(
//         3, 
//         'Iphone 14 pro max',
//         'Importado desde EE.UU',
//         999.99,
//         'algo',
//         '1223456987',
//         114,
//     );

//     const updatedProduct = await productManager.getProductById(3);
//     console.log('Updated Product:', updatedProduct);

//     // ==============metodo deleteproduct:===================

//     await productManager.deleteProduct(27);
//     const remainingProducts = await productManager.getProducts();
//     console.log('Remaining Products:', remainingProducts);

// })();
