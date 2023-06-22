import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import * as dotenv from 'dotenv'
dotenv.config()

import { Usuario } from '../models/Usuario.js'
import { Log } from '../models/Log.js'

let tentativaLogin = 1

export const loginUsuario = async (req, res) => {
    const { email, senha } = req.body
    const mensaErroPadrao = "Erro... Login ou senha inválido"

    if (!email || !senha) {
        res.status(400).json({ erro: mensaErroPadrao })
        return
    }
    try {
        const usuario = await Usuario.findOne({ where: { email } })
        if (!usuario) {
            res.status(400), json({ erro: mensaErroPadrao })
            return
        }
        if (usuario.bloqueado) {
            await Log.create({
                descricao: `Tentativa de login feita em conta bloqueada ${email}`,
                usuaria_id: usuario.id
            })
            res.status(404).json({ bloqueado: "Sua conta está bloqueada, por favor redefina a senha para desbloquea-la." })
            return
        }
        if (bcrypt.compareSync(senha, usuario.senha)) {
            const token = jwt.sign({
                user_logado_id: usuario.id,
                user_logado_nome: usuario.nome
            },
                process.env.JWT_KEY,
                { expiresIn: "1h" })
            await Log.create({
                descricao: `Login feito na conta ${email}`,
                usuaria_id: usuario.id
            })
            res.status(200).json({ msg: "Ok. Logado!", token })
            tentativaLogin = 1
        } else {
            if (tentativaLogin <= 3) {
                await Log.create({
                    descricao: `Tentativa de acesso na conta ${email} com senha inválida`,
                    usuario_id: usuario.id
                })
                res.status(404).json({ erro: mensaErroPadrao })
                tentativaLogin++
            } else {
                usuario.bloqueado = true
                usuario.save()
                await Log.create({
                    descricao: `Usuário da conta ${email} bloqueado`,
                    usuaria_id: usuario.id
                })
                res.status(404).json({ bloqueado: "Sua conta foi bloqueada, por favor redefina a senha para desbloquea-la." })
            }
        }
    } catch (error) { res.status(400).send(error) }
}