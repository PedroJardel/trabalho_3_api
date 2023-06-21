import { DataTypes } from "sequelize";
import { sequelize } from "../database/conecta.js";
import { Usuario } from "./Usuario.js";

export const Log = sequelize.define('log', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    descricao: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
});

Log.belongsTo(Usuario, {
    foreignKey: {
        name: "usuario_id",
        allowNull: false
    },
    onDelete: "RESTRICT",
    onUpdate: "CASCADE"
})

Usuario.hasMany(Log, {
    foreignKey: "usuario_id"
})