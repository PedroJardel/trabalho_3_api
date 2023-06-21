import bcrypt from 'bcrypt'

import { Usuario } from '../models/Usuario.js'
import { Log } from '../models/Log.js'
import { sequelize } from '../database/conecta.js'

const validaSenha = (senha) => {
    const mensa = []

    if (senha.length < 8) { mensa.push("Erro... Senha deve possuir, no mínimo, 8 caracteres") }

    let { minusculas, maiusculas, numeros, simbolos } = 0
    senha.forEach(letra => {
        if ((/[a-z]/).test(letra)) {
            minusculas++
        } else if ((/[A-Z]/).test(letra)) {
            maiusculas++
        } else if ((/[0-9]/).test(letra)) {
            numeros++
        } else { simbolos++ }
    })
    if (minusculas == 0 || maiusculas == 0 || numeros == 0 || simbolos == 0) {
        mensa.push("Erro... Senha deve possuir letras minúsculas, maiúsculas, números e símbolos")
    }
    return mensa
}

export const usuarioIndex = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.status(200).json(usuarios)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const usuarioCreate = async (req, res) => {
    const { nome, email, senha } = req.body

    if (!nome || !email || !senha) {
        res.status(404).json({ id: 0, msg: "Erro... Informe os dados" })
        return
    }
    const mensaValidacao = validaSenha(senha)
    if (mensaValidacao.lengh >= 1) {
        res.status(404).json({ id: 0, msg: mensaValidacao })
        return
    }
    const t = sequelize.transaction()
    try {
        const usuario = await Usuario.create({
            nome, email, senha
        }, { transaction: t });
        await Log.create({
            descricao: `Usuario ${nome} - ${usuario.id} criado.`,
            usuario_id: usuario.id
        }, { transaction: t })
        await t.commit()
        res.status(200).json(usuario)
    } catch (error) {
        await t.rollback()
        res.status(400).send(error)
    }
}

export const usuarioAlteraSenha = async (req, res) => {
    const { email, novaSenha } = req.body

    if (!email || !novaSenha) {
        res.status(404).json({ id: 0, msg: "Erro... Informe os dados" })
        return
    }
    try {
        const usuario = await Usuario.findOne({ where: { email } })
        if (!usuario) {
            res.status(400).json({ erro: "E-mail inválido." })
            return
        }
        if (!usuario.hash_alt_senha) {
                res.status(400).json({ erro: "Confirme o email de alteração de senha (veja sua caixa de entrada e/ou span)." })
                await Log.create({
                    descricao: `Tentativa de alteração de senha na conta do usuario ${usuario.id}`,
                    usuario_id: usuario.id
                })
                return
            }
        const mensaValidacao = validaSenha(novaSenha)
        if (mensaValidacao >= 1) {
            res.status(404).json({ id: 0, msg: mensaValidacao })
            return
        }

        const salt = bcrypt.genSaltSync(12)
        const hash = bcrypt.hashSync(novaSenha, salt)
        usuario.senha = hash
        await usuario.save()

        res.status(200).json({ msg: "Ok. Senha alterada com sucesso!" })
    } catch (error) {
        res.status(400).send(error)
    }
}