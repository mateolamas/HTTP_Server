console.clear()
import express from "express";
import dotenv from 'dotenv';
import accountRouter from './routes/account.js';
import authRouter from "./routes/auth.js";
import authTokenRouter from "./routes/auth_token.js";
import authSessionRouter from "./routes/auth_session.js";
import cookieParser from "cookie-parser";
import mongoose from 'mongoose';


dotenv.config();

const PORT = process.env.PORT;
const expressApp = express();

//middleware para leer cookies
expressApp.use(cookieParser());

expressApp.use(express.text());
expressApp.use(express.json());
expressApp.use("/account",accountRouter);
expressApp.use("/auth", authRouter);


expressApp.use("/auth-token", authTokenRouter);
expressApp.use("/auth-session", authSessionRouter);

const bootstrap = async () => {
    console.log("Conectando con MongoDB...")
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Conectado con éxito\n")

    console.log("Levantando servidor...")
    expressApp.listen(PORT, () => 
        console.log(`Servidor levantado en el puerto ${PORT}`)
    );
}

bootstrap();



