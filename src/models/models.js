import { Sequelize } from "sequelize";
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

export const Cliente = sequelize.define("Cliente", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: Sequelize.STRING
    },
    apellido: {
        type: Sequelize.STRING
    },
    cedula: {
        type: Sequelize.INTEGER,
        unique: true
    },
});

export const Mesa = sequelize.define("Mesa", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: Sequelize.STRING
    },
    id_restaurante: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Restaurantes', 
            key: 'id', 
        }
    },
    posicion_x: {
        type: Sequelize.INTEGER
    },
    posicion_y: {
        type: Sequelize.INTEGER
    },
    nro_piso: {
        type: Sequelize.INTEGER
    },
    capacidad_comensales: {
        type: Sequelize.INTEGER
    },
});

export const Reserva = sequelize.define("Reserva", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_cliente: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Clientes', 
            key: 'id', 
        }
    },
    id_restaurante: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Restaurantes', 
            key: 'id', 
        }
    },
    id_mesa: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Mesas', 
            key: 'id', 
        }
    },
    fecha: {
        type: Sequelize.DATE
    },
    cantidad: {
        type: Sequelize.INTEGER
    },
});

export const RangoDeHoraPorReserva = sequelize.define("RangoDeHoraPorReserva", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_reserva: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Reservas', 
            key: 'id', 
        }
    },
    hora: {
        type: Sequelize.STRING,
    }
});

Restaurante.hasMany(Mesa);