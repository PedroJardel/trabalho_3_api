import { Sequelize } from "sequelize";


export const sequelize = new Sequelize (
    "imoveis", "root", "", {
        dialect: "mysql",
        host: "localhost",
        port: 3306
})
