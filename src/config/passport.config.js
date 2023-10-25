import passport from "passport";
import local from "passport-local";
import jwt from 'passport-jwt';
import GitHubStrategy from 'passport-github2';
import { userModel } from "../dao/models/user.model.js";
import {cookieExtractor , createHash , isValidPassword} from '../../utils.js'



const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt; 

const initializePassport = async () => {

    // Estrategia de autenticación para el registro de usuarios:
    passport.use('register', new LocalStrategy(
        {passReqToCallback:true , usernameField: 'email'}, async (req, username, password, done) => {
            const {first_name, last_name, email, age} = req.body;
            try {

                if (!first_name || !last_name || !email || !age || !password) {
                    return done(null, false, { message: 'Incomplete Values' });
                }
                
                let exist = await userModel.findOne({email:username});
                if(exist){
                    console.log('User already exists')
                    return done(null, false);
                }
                // Si el usuario no existe
                const newUser = {
                    first_name, 
                    last_name, 
                    email, 
                    age, 
                    password: createHash(password),
                    role: rol,
                    cart: await cartInUser.adCart(),
                    avatar: req.filter.filename
        
                }
                let result = await userModel.create(newUser);
                return done(null,result); 
            } catch (error) {
                return done('Error al obtener el usuario:' + error)   
            }
        }
    ))
    
    
    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            //si el usuario que quiere loguearse es coderadmin:
            if (username === 'adminCoder@coder.com' && password === 'adminCoder123') { 
                const newUser = {
                    first_name: 'Coder',
                    last_name: 'Admin',
                    email: email, 
                    age: 30,
                    password: password,
                    role: 'admin', 
                };
                return done(null, newUser) 
            }

            //Si se quiere loguear un usuario comun:
            const user = await userModel.findOne({email:username})
            if(!user){
                console.log("User doesn't exist") 
                return done(null, false ,{message: "No se encontro el usuario"}); 
            }
            if(!isValidPassword(user,password)){
                return done(null, false , {message: "Contraseña incorrecta"}) 
            }; 
            return done(null, user); 
        } catch (error) {
            return done(error); 
        }
    }));

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: 'CoderSecret' //debe ser el mismo que en app.js/server.js
    }, async(jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    }))


    passport.serializeUser((user, done) => {
        done(null, user._id); 
    });

    passport.deserializeUser( async(id, done) => {
        let user = await userModel.findById(id); 
        done(null, user); 
    });

    // Estrategia de autenticación para iniciar sesión con GitHub
    passport.use('github', new GitHubStrategy({
        clientID:"Iv1.c18594c8bcbceefc",
        clientSecret: "a24f499a2b4aae36add90c52f0f7901f116de3a5",
        callbackURL:"http://localhost:8080/api/sessions/githubcallback"
    }, async(accessToken, refreshToken, profile, done) => {
        try{
            console.log(profile); 
            let user = await userModel.findOne({email:profile._json.email}) 
            if(!user){ 
                let newUser = {
                    first_name: profile._json.name,
                    last_name: ' ', 
                    age: 18, 
                    email: profile._json.email,
                    password: '', 
                    role: 'user'
                }
                let result = await userModel.create(newUser);
                done(null, result);
            }else{ 
                done(null, user);
            }
        }catch(error){
            done(error);
        }
    }))
    
}

export default initializePassport;





    
    
