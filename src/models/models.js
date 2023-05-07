import Sequelize from "sequelize";
import fs from "fs";

//Leer el archivo de configuración de la base de datos
const dbConfig = JSON.parse(fs.readFileSync("./db.json"));

//Crear la instancia de Sequelize
export const sequelize = new Sequelize(dbConfig)

//Definir los modelos
export const Restaurante = sequelize.define("Restaurante", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: Sequelize.STRING
    },
    direccion: {
        type: Sequelize.STRING
    },
});
