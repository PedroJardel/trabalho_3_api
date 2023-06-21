import jwt from 'jsonwebtoken'

import * as dotenv from 'dotenv'
dotenv.config()

export const verificaLogin = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const decode = jwt.verify(token, process.env.JWT_KEY)
        req.user_logado_id = decode.user_logado_id
        req.user_logado_nome = decode.user_logado_nome
        next()
    } catch (error) {
        return res.status(401).send({ Erro: "Falha na Autenticação" })
    }
}