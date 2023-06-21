import nodemailer from 'nodemailer'
import md5 from 'md5'
import { Usuario } from '../models/Usuario.js'

const main = async (nome, email, hash) => {
    let transporter = nodemailer.createTransport({
        host: "sandbox,smtp.mailtrap.io",
        port: 2525,
        secure: false,
        auth: {
            user: 'd786474703cd48',
            pass: '9372ab672bf3da'
        },
    });

    let mensa = `<h3> Sistema para Cadastro de Imóveis</h3>
    <h4>Estimado Sr. ${nome}</h4>
    <h4> Você solicitou a troca de senha.</h4>
    <h4>CLique no link abaixo para alterar:</h4>
    <b><a href="http://localhost:3000/trocasenha/${hash}">Alterar sua senha</a></b>`

    let info = await transporter.sendMail({
        from: '"Sistema de Cadastro de Imóveis 🏡" <cadimovel@email.com>',
        to: email,
        subject: "Solicitação de Alteração de Senha",
        text: `Copie e cole o endereço: http://localhost:3000/trocasenha/${hash} para alterar`,
        html: mensa, 
    });

    console.log("Mensagem sent: %s", info.messageId);
}

export const enviaEmail = async (req, res) => {
    const { email } = req.body

    try {
        const usuario = await Usuario.findOne({where: { email }})

        if(!usuario){
            res.status(404).json({ erro: "Erro... E-mail inválido" })
            return
        }
        const hash = md5(usuario.nome + email + Date.now())
        usuario.hash_alt_senha = hash
        await usuario.save()
        main(usuario.nome, email, hash).catch(console.error)
        res.status(200).json({ msg: "Ok. E-mail para alteração de senha enviado com sucesso." })

    } catch (error) { res.status(400).send(error) }
}