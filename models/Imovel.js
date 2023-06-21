import { DataTypes } from "sequelize";
import { sequelize } from "../database/conecta.js";
import { Usuario } from "./Usuario.js";

export const Imovel = sequelize.define("imovel", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    cidade: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    bairro: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    preco: {
        type: DataTypes.DECIMAL(9,2),
        allowNull: false
    },
    area_total: {
        type: DataTypes.DECIMAL(6,2),
        allowNull: false
    },
    area_construida: {
        type: DataTypes.DECIMAL(6,2),
        allowNull: false
    },
    dormitorios: {
        type: DataTypes.INTEGER(2),
        allowNull: false
    },
    banheiros: {
        type: DataTypes.INTEGER(2),
        allowNull: false
    },
    vagas_garagem: {
        type: DataTypes.INTEGER(2),
        allowNull: false
    },
}, {
    tableName: "imoveis"
})

Imovel.belongsTo(Usuario, {
    foreignKey: {
        name: "usuario_id",
        allowNull: false
    },
    onDelete: "RESTRICT",
    onUpdate: "CASCADE"
})

Usuario.hasMany(Imovel, {
    foreignKey: "usuario_id"
})