import {Router} from "express";
import authByEmailPwd from "../helpers/authByEmailPwd.js"
import { SignJWT, jwtVerify } from "jose";
import { USERS_BBDD } from "../bbdd.js";

const authTokenRouter = Router();

authTokenRouter.post("/login", async (req,res) =>  {
    const {email, password} = req.body;

    if(!email || !password) return res.sendStatus(400);

    try{
        const {guid} = authByEmailPwd(email, password);

        const jwtConstructor = new SignJWT({ guid });

        const encoder = new TextEncoder();

        const jwt = await jwtConstructor
        .setProtectedHeader({alg: 'HS256',typ: 'JWT'})
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(encoder.encode(process.env.JWT_PRIVATE_KEY));

        return res.send({ jwt });
    }catch(err){
        return res.sendStatus(401);
    }
});

authTokenRouter.get("/profile", async (req,res) => {
    //obtener token de la cabecera
    //comprobar autenticidad y caducidad
    
    const { authorization } = req.headers;

    if(!authorization) return res.sendStatus(401);

    try{
        const encoder = new TextEncoder();

        //esta funcion nos dice todo
        //si es nuestro(usando la PrivateKey), si está caducado, si es valido...
        //si algo falla da error, por eso el try/catch
        const jwtData = await jwtVerify(
            authorization, 
            encoder.encode(process.env.JWT_PRIVATE_KEY)
        );
        
        //buscamos el usuario asociado a ese Id de Sesion usando el GUID
        const user = USERS_BBDD.find((user) => user.guid === jwtData.payload.guid);
    
        //si hemos/han borrado el usuario de la BBDD : 401
        if(!user) return res.sendStatus(401);

        //devolvemos el objeto 'user' sin la contraseña 
        delete user.password;
        return res.send(user);
    }catch(err){
        return res.status(401);
    }
})

export default authTokenRouter;