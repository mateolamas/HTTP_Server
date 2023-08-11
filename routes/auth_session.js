import { Router } from "express";
import authByEmailPwd from "../helpers/authByEmailPwd.js"
import { nanoid } from "nanoid";

const sessions = [];
const authSessionRouter = Router();


authSessionRouter.post("/login", (req,res) =>  {
    const {email, password} = req.body;

    if(!email || !password) return res.sendStatus(400);

    try{
        authByEmailPwd(email, password);
        
        //generamos Id de Session
        const sessionId = nanoid();
        sessions.push({sessionId});

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
    console.log(req.cookies);
    return res.send()
})

export default authSessionRouter;