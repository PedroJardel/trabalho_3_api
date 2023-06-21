import bcrypt from 'bcrypt'

import { Usuario } from '../models/Usuario.js'
import { Log } from '../models/Log.js'
import { sequelize } from '../database/conecta.js'

const validaSenha = (senha) => {
    const mensa = []

    if (senha.length < 8) { mensa.push("Erro... Senha deve possuir, no mínimo, 8 caracteres") }

    let { minusculas, maiusculas, numeros, simbolos } = 0
    for (const letra of senha) {
        if ((/[a-z]/).test(letra)) {
            minusculas++
        } else if ((/[A-Z]/).test(letra)) {
            maiusculas++
        } else if ((/[0-9]/).test(letra)) {
            numeros++
        } else { simbolos++ }
    }
    if (minusculas == 0 || maiusculas == 0 || numeros == 0 || simbolos == 0) {
        mensa.push("Erro... Senha deve possuir letras minúsculas, maiúsculas, números e símbolos")
    }
    return mensa
}

export const usuarioIndex = async (req, res) => {
    const { id } = req.params
    try {
        if (!id) {
            const usuarios = await Usuario.findAll();
            res.status(200).json(usuarios)
        } else {
            const usuario = await Usuario.findAll({ where: { id } });
            res.status(200).json(usuario)
        }
    } catch (error) {
        res.status(400).send(error)
    }
}

export const usuarioCreate = async (req, res) => {
    const { nome, email, senha } = req.body
    const t = await sequelize.transaction();

    if (!nome || !email || !senha) {
        res.status(404).json({ id: 0, msg: "Erro... Informe os dados" })
        return
    }
    const mensaValidacao = validaSenha(senha)
    if (mensaValidacao.lengh >= 1) {
        res.status(404).json({ id: 0, msg: mensaValidacao })
        return
    }

    try {
        const usuario = await Usuario.findOne({ where: { email } })
        if (!usuario) {
            const novoUsuario = await Usuario.create({
                nome, email, senha
            }, { transaction: t });
            await Log.create({
                descricao: `Usuario ${nome} - ${novoUsuario.id} criado.`,
                usuario_id: novoUsuario.id
            }, { transaction: t })

            await t.commit();
            res.status(200).json(novoUsuario)
        } else {
            await t.rollback()
            res.status(400).json({ msg: "Este e-mail já está cadastrado!" })
            return
        }
    } catch (error) {
        await t.rollback()
        res.status(400).send(error)
    }
}

export const usuarioAlteraSenha = async (req, res) => {
    const { hash_alt_senha } = req.params
    const { novaSenha } = req.body

    if (!novaSenha) {
        res.status(404).json({ id: 0, msg: "Erro... Informe os dados" })
        return
    }
    try {
        const usuario = await Usuario.findOne({ where: { hash_alt_senha } })
        if (!usuario) {
            res.status(400).json({ erro: "Usuário não solicitou alteração na senha ou não confirmou o alteração de senha por e-mail" })
            await Log.create({
                descricao: `Tentativa de alteração de senha na conta do usuario ${usuario.email}`,
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
        usuario.bloqueado = false
        await usuario.save()

        res.status(200).json({ msg: "Ok. Senha alterada com sucesso!" })
    } catch (error) {
        res.status(400).send(error)
    }
}