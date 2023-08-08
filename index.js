console.clear()
import express from "express";
import dotenv from 'dotenv';
import accountRouter from './routes/account.js';
import authRouter from "./routes/auth.js";

dotenv.config();

const PORT = process.env.PORT;
const expressApp = express();

expressApp.use(express.text());
expressApp.use(express.json());
expressApp.use("/account",accountRouter);
expressApp.use("/auth", authRouter);

expressApp.listen(PORT, () => 
    console.log(`Servidor levantado en el puerto ${PORT}`)
);




