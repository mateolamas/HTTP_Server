import {Router} from 'express';
import authByEmailPwd from "../helpers/authByEmailPwd.js"

const authRouter = Router();

//Endpoint publico (No Autenticado ni Autorizado)
authRouter.get("/publico", (req,res) => {
    res.send("Endpoint Publico");
});

//Endpoint Autenticado para todo usuario registrado
authRouter.post("/autenticado", (req,res) =>  {
    const {email, password} = req.body;

    if(!email || !password) return res.sendStatus(400);

    try{
        const user = authByEmailPwd(email, password);

        return res.send(`Usuario ${user.name} autenticado`);
    }catch(err){
        return res.sendStatus(401);
    }
});


//Endpoint Autorizado a Administradores
authRouter.post("/autorizado", (req,res) => {
    const {email, password} = req.body;

    if(!email || !password) return res.sendStatus(400);

    try{
        const user = authByEmailPwd(email, password);

        if(user.role !== 'admin') return res.sendStatus(403);

        return res.send(`Usuario administrador ${user.name}`);
    }catch(err){
        return res.sendStatus(401);
    }
});

export default authRouter;