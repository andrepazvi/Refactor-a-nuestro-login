import express from "express";
import __dirname from "../utils.js"; 
import handlebars from 'express-handlebars'; 
import { Server } from "socket.io"; 
import productsRouter from './routers/products.router.js'; 
import cartsRouter from './routers/carts.router.js';
import viewsRouter from './routers/views.router.js';
import mongoose, { connect } from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import sessionRouter from './routers/sessions.router.js';
import cookieParser from "cookie-parser";


import passport from "passport";
import initializePassport from "./config/passport.config.js";

import ProductManager from "./dao/managersMongoDb/ProductManagerMongo.js";
import messageManager from "./dao/managersMongoDb/MessageManagerMongo.js";


const app = express()

const httpServer = app.listen(8080 , () => {console.log('>>>>> 🚀 Server started at http://localhost:8080/')})

const socketServer = new Server(httpServer);


app.use(express.json()); 
app.use(express.urlencoded({extended:true})); 
app.use(express.Router()); 


mongoose.connect('mongodb+srv://andreapaz:mongo@cluster2.ut0jbea.mongodb.net/?retryWrites=true&w=majority')


app.use(session({
    store: MongoStore.create({
        mongoUrl:'mongodb+srv://andreapaz:mongo@cluster2.ut0jbea.mongodb.net/?retryWrites=true&w=majority',
        ttl:3600
    }),
    secret: 'CoderSecret',
    resave: false,
    saveUninitialized: false
}))

//passport:

initializePassport();
app.use(passport.initialize());
app.use(passport.session());


app.use(cookieParser());



//Configuraciones para plantillas handlebars:

app.engine('handlebars' , handlebars.engine());
app.set('views', __dirname + '/src/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname +'/src/public'));


app.use('/api/products' , productsRouter); // Usando el router de productos para las rutas que comienzan con '/api/products'.
app.use('/api/carts' , cartsRouter); // Usando el router de carritos para las rutas que comienzan con '/api/carts'.
app.use('/', viewsRouter); //router handlebars para io con '/'.
app.use('/api/sessions', sessionRouter); // ruta para las sessions 


const pManager = new ProductManager();
const mManager = new messageManager();


socketServer.on('connection', async (socket) => {

    console.log("nuevo cliente conectado")

    

    const products = await pManager.getProducts()
    socket.emit('productos', products); 

    socket.on('addProduct', async data => {

        await pManager.addProduct(data)
        const updateProducts = await pManager.getProducts();
        socket.emit('updatedProducts', updateProducts );
    })
    
    //recibimos del cliente el id del producto a eliminar
    socket.on('deleteProduct', async data => {
        await pManager.deleteProduct(data); //eliminamos el producto
        const updateProducts = await pManager.getProducts(); //obtenemos la lista actualizada con el producto eliminado
        socket.emit('updatedProducts', updateProducts ); //le enviamos al cliente la lista actualizada
    })

})



//websockets para el chat:

socketServer.on('connection', async (socket) => {

    console.log("nuevo cliente conectado 2")


    //recibimos el nombre del usuario que se registro:
    socket.on('authenticated', data => {
        console.log(data)
        socket.broadcast.emit('newUserConnected', data);
    })


    //recibimos el usuario con su mensaje
    socket.on('message', async data => {
        console.log(data)
        const addMessage = await mManager.addMessages(data); //agregamos el mensaje del usuario a la base de datos. 
        const messages = await mManager.getMessages(); //obtenemos todos los mensajes de la base de datos.
        socket.emit('messageLogs', messages); //enviamos al cliente la lista de todos los mensajes (array).
    })
});

