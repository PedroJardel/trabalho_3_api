import { Log } from "../models/Log.js";
import { Imovel } from "../models/Imovel.js";
import { Usuario } from "../models/Usuario.js";
import { sequelize } from "../database/conecta.js";

export const logIndex = async (req, res) => {
    const { usuario_id } = req.params

    try {
        if(!usuario_id) {
        const logs = await Log.findAll()
        res.status(200).json(logs)
        } else {
        const logs = await Log.findAll({ where: { usuario_id }, include: Usuario})
        res.status(200).json(logs)
        }
    } catch (error) {
        res.status(400).send(error)
    }
}