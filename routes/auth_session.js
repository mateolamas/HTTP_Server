import { Router } from "express";
import authByEmailPwd from "../helpers/authByEmailPwd.js"
import { nanoid } from "nanoid";
import { USERS_BBDD } from "../bbdd.js";

const sessions = [];
const authSessionRouter = Router();


authSessionRouter.post("/login", (req,res) =>  {
    const {email, password} = req.body;

    if(!email || !password) return res.sendStatus(400);

    try{
        const { guid } = authByEmailPwd(email, password);
        
        //generamos Id de Session y los enlazamos con el 
        //GUID del usuario
        const sessionId = nanoid();
        sessions.push({sessionId, guid});

        //metemos el Id en una cookie
        res.cookie('sessionId', sessionId,{
            httpOnly:true,
            //muchas más flags
        })

        return res.send();
    }catch(err){
        return res.sendStatus(401);
    }
});

authSessionRouter.get("/profile", (req,res) => {
    //cogemos la cookie de la request
    const { cookies } = req;

    //si la cookie no contiene el sessionId : 401
    if(!cookies.sessionId) return res.sendStatus(401);
    
    //buscamos el id de sesion en el array de sesiones
    const userSession = sessions.find(session => session.sessionId === cookies.sessionId);
    
    //si no lo encontramos : 401
    if(!userSession) return res.sendStatus(401);

    //buscamos el usuario asociado a ese Id de Sesion usando el GUID
    const user = USERS_BBDD.find(user => user.guid === userSession.guid);
    
    //si hemos/han borrado el usuario de la BBDD : 401
    if(!user) return res.sendStatus(401);

    //devolvemos el objeto 'user' sin la contraseña 
    delete user.password;
    return res.send(user)
})

export default authSessionRouter;