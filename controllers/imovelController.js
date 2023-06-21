import { Log } from "../models/Log.js";
import { Imovel } from "../models/Imovel.js";
import { Usuario } from "../models/Usuario.js";
import { sequelize } from "../database/conecta.js";

export const imovelIndex = async (req, res) => {
    try {
        const imoveis = await Imovel.findAll({ include: Usuario })
        res.status(200).json(imoveis)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const imovelCreate = async (req, res) => {
    const { nome, cidade, bairro, preco, area_total, area_construida, dormitorios, banheiros, vagas_garagem, usuario_id } = req.body

    if (!nome || !cidade || !bairro || !preco || !area_total || !area_construida
        || !dormitorios || !banheiros || !vagas_garagem || !usuario_id) {
        res.status(404).json({ id: 0, msg: "Erro, informe todos os dados" })
        return
    }
    const t = await sequelize.transaction()
    try {
        const imovel = await Imovel.create({
            nome, cidade, bairro, preco, area_total, area_construida, dormitorios, banheiros, vagas_garagem, usuario_id
        }, { transaction: t })
        await Log.create({
            descricao: `Criação do imovel ${nome}`,
            usuario_id: usuario_id
        }, { transaction: t })
        await t.commit()
        res.status(201).json(imovel)
    } catch (error) {
        await t.rollback()
        res.status(404).send(error)
    }
}

export const imovelDestroy = async (req, res) => {
    const { id } = req.params
    const t = sequelize.transaction()

    try {
        const imovel = await Imovel.destroy({ where: { id } }, { transaction: t })
        await Log.create({
            descricao: `Exclusão do imovél ${imovel.nome} - ${id}`,
            usuario_id: user_logado_id
        }, { transaction: t })
        await t.commit()
        res.status(200).json({ id: 0, msg: `Exclusão do imovél ${imovel.nome} - ${id} feita com sucesso` })
    } catch (error) {
        await t.rollback()
        res.status(400).send(error)
    }
}