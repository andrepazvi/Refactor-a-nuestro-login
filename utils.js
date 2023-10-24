import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from 'bcrypt';
import passport from "passport";


// Esta función toma una contraseña y la hashea utilizando bcrypt. Devuelve el hash resultante.
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Esta función verifica si una contraseña coincide con el hash almacenado para un usuario.
// Devuelve true si la contraseña es válida y false en caso contrario.
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

const __filename = fileURLToPath(import.meta.url) 
const __dirname = dirname(__filename);


export const cookieExtractor = req => {
    let token;
    if (req && req.cookies) { 
        token = req.cookies['coderCookie'] 
    }
    return token;
}

// export const bearerTokenExtractor = req => {
//     return req.headers.authorization.split(' ')[1];
// }

//para los errores de token jwt
export const passportCall = (strategy) => {
    return async(req, res, next) => {
        passport.authenticate(strategy, function(err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res.status(401).send({error: info.messages ? info.messages: info.toString()})
            }
            req.user = user;
            next();
        }) (req, res, next);
    }
}


export default __dirname;
