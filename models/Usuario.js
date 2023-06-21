import { DataTypes } from "sequelize";
import bcrypt from 'bcrypt'

import { sequelize } from "../database/conecta.js";

export const Usuario = sequelize.define('usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    senha: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    hash_alt_senha: {
        type: DataTypes.STRING(100),
        defaultValue: null
    },
    bloqueado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

Usuario.beforeCreate(usuario => {
    const salt = bcrypt.genSaltSync(12)
    const hash = bcrypt.hashSync(usuario.senha, salt)
    usuario.senha = hash
});