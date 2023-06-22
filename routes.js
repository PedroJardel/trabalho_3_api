import Router from 'express'
import { usuarioAlteraSenha, usuarioCreate, usuarioIndex } from './controllers/usuarioController.js'
import { imovelCreate, imovelDestroy, imovelIndex } from './controllers/imovelController.js'
import { verificaLogin } from './middlewares/verificaLogin.js'
import { loginUsuario } from './controllers/loginController.js'
import { enviaEmail } from './controllers/mailController.js'
import { logIndex } from './controllers/logController.js'

const router = Router()

router.get('/usuarios/:id?', usuarioIndex)
      .post('/usuarios', usuarioCreate)

router.get('/imoveis/:id?', imovelIndex)
      .post('/imoveis', verificaLogin, imovelCreate)
      .delete('/imoveis/:id', verificaLogin, imovelDestroy)

router.get('/login', loginUsuario)

router.get('/enviaemail', enviaEmail)
      .get('/trocasenha/:hashSenha', usuarioAlteraSenha)

router.get('/logs/:usuario_id?', logIndex)

export default router