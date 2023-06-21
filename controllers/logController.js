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

export const imovelDestroy = async (req, res) => {
    const { id } = req.params
    const user_logado_id = req.user_logado_id
    const t = await sequelize.transaction()

    try {
        const imovel = await Imovel.destroy({ where: { id } }, { transaction: t })
        await Log.create({
            descricao: `Exclusão do imóvel ${imovel.nome} - ${id}`,
            usuario_id: user_logado_id
        }, { transaction: t })
        await t.commit()
        res.status(200).json({ id: 0, msg: `Exclusão do imovél ${imovel.nome} - ${id} feita com sucesso` })
    } catch (error) {
        await t.rollback()
        res.status(400).send(error)
    }
}