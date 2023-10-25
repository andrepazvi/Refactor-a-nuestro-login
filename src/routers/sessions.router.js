import { Router } from "express"
import { userModel } from '../dao/models/user.model.js'
import { createHash, isValidPassword } from "../../utils.js";
import { isValidObjectId } from "mongoose";
import passport from "passport";
import  jwt  from "jsonwebtoken";


const router = Router()


//ruta para registrarse como usuario:
router.post('/register' , passport.authenticate('register',{failureRedirect:'/failregister'}) ,async (req, res) => {
    res.send({status:"success", message: "User registered"})
})

//en caso que la estrategia de registro falle:
router.get('/failregister', async(req,res)=>{
    console.log("Failed Strategy");
    res.send({error:"Failed"}) 
})


//ruta para logearse con SESSION:
router.post('/login', passport.authenticate('login',{failureRedirect:'/faillogin'}), async (req, res) => {
    if(!req.user){
        return res.status(400).send({status:'error' , error: 'Credenciales invalidas' })
    }
    delete req.user.password; 

    req.session.user = req.user 
    res.send({status:'success', payload: req.session.user}) 
})


//en caso que la estrategia de inicio de sesión falle:
router.get('/faillogin', async(req,res)=>{
    console.log("Failed Strategy");
    res.send({error:"Failed"}) 
})

//ruta para devolver al usuario que inicia sesion SESSION
router.get('/current', async (req, res) => {
    res.send(req.user); 
});


//ruta para logearse con Git Hub:
router.get('/github' , passport.authenticate('github',{scope:['user:email']}), async(req,res) =>{
})

router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/login'}), async(req,res)=>{
    req.session.user = req.user;
    res.redirect('/products');
})

//ruta para logOut:
router.get('/logout', (req, res) => {
	req.session.destroy((error) => {
		if (error) {
			console.error('Error al cerrar la sesión:', error);
			res.status(500).send('Error al cerrar la sesión');
		} else {
			// Redirige al usuario a la página de inicio de sesión
			res.clearCookie('connect.sid');
			res.redirect('/login');
		}
	})
});

export default router;
