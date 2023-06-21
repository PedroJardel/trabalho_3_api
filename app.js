import express from "express";
import cors from 'cors'
import routes from './routes.js'

import { sequelize } from "./database/conecta.js";
import { Usuario } from "./models/Usuario.js";
import { Imovel } from "./models/Imovel.js";
import { Log } from "./models/Log.js";

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())
app.use(routes)

const conecta_db = async () => {
    try {
        await sequelize.authenticate();
        console.log("Conexão com o banco de dados realizada com sucesso");
        await Usuario.sync()
        // await Usuario.sync({alter: true})
        await Imovel.sync()
        // await Imovel.sync({alter: true})
        await Log.sync()
        // await Log.sync({alter: true})
               
    } catch (error) {
        console.error("Erro na conexão com o banco: ", error)
    }
}

conecta_db()

app.get('/', (req, res) => {
    res.send(`API Cadastro de Imóveis`)
})

app.listen(port, () => {
    console.log(`Servidor rodando na Porta: ${port}`)
})