import { Router } from 'express';
import { USERS_BBDD } from "../bbdd.js";

const accountRouter = Router();

//esto se ejecuta antes de cualquier get,post...
accountRouter.use((req, res, next) => {
    console.log(req.ip);

    next(); //llama al siguiente middleware si existe
    // y si no ya al get,post o lo que toque
})

//Ver detalles de una cuenta
accountRouter.get('/:guid', (req, res) => {
    const {guid} = req.params
    const user = USERS_BBDD.find(user => user.guid == guid);
    
    if(!user) return res.status(404).send();

    return res.send(user);
});

//Crear una cuenta
accountRouter.post('/', (req, res) => {
    const {guid, name} = req.body;

    if(!guid || !name) return res.status(400).send();

    const user = USERS_BBDD.find(user => user.guid == guid);
    if(user) return res.status(409).send();

    USERS_BBDD.push({
        guid,name
    });

    return res.send()
});

//Actualizar una cuenta
accountRouter.patch('/:guid', (req, res) => {
    const {guid} = req.params;
    const {name} = req.body;

    if(!name) return res.status(400).send(); //si no le pasas un nuevo nombre

    const user = USERS_BBDD.find(user => user.guid == guid);
    
    if(!user) return res.status(404).send(); //si no encuentra el usuario para modificar

    user.name = name;

    return res.send();

});

//Eliminar cuenta
accountRouter.delete('/:guid', (req, res) => {
    const {guid} = req.params
    const userIndex = USERS_BBDD.findIndex(user => user.guid == guid);
    
    if(!userIndex == -1) return res.status(404).send();

    USERS_BBDD.splice(userIndex, 1)
    return res.send();
});

export default accountRouter;