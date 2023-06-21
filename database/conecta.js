import { Sequelize } from "sequelize";


export const sequelize = new Sequelize (
    "imoveis", "root", "Lima9800@", {
        dialect: "mysql",
        host: "localhost",
        port: 3306
})