import { Router } from 'express';
import userModel from '../schemas/user-schema.js';

const accountRouter = Router();

//esto se ejecuta antes de cualquier get,post...
accountRouter.use((req, res, next) => {
    console.log(req.ip);

    next(); //llama al siguiente middleware si existe
    // y si no ya al get,post o lo que toque
})

//Ver detalles de una cuenta
accountRouter.get('/:guid', async (req, res) => {
    const {guid} = req.params
    const user = await userModel.findById(guid).exec();
    
    if(!user) return res.status(404).send();

    return res.send(user);
});

//Crear una cuenta con id y nombre
accountRouter.post('/', async (req, res) => {
    const {guid, name} = req.body;

    if(!guid || !name) return res.status(400).send();

    //buscamos en la BBDD si ya existe el usuario usando el guid
    const user = await userModel.findById(guid).exec();

    if(user) return res.status(409).send('El usuario ya se encuentra registrado');

    //crear una instancia del modelo, es decir, un usuario
    const newUser = new userModel({_id: guid, name: name});
    await newUser.save();

    return res.send('Usuario registrado');
});

//Actualizar una cuenta(cambiar el nombre)
accountRouter.patch('/:guid', async (req, res) => {
    const {guid} = req.params;
    const {name} = req.body;

    if(!name) return res.status(400).send(); //si no le pasas un nuevo nombre

    const user = await userModel.findById(guid).exec();
    
    if(!user) return res.status(404).send(); //si no encuentra el usuario para modificar

    user.name = name;

    await user.save();

    return res.send();

});

//Eliminar cuenta usando el id
accountRouter.delete('/:guid', async (req, res) => {
    const {guid} = req.params
    const user = await userModel.findById(guid).exec();
    
    if(!user) return res.status(404).send();
    
    console.log(user);

    await user.deleteOne();

    return res.send();
});

export default accountRouter;