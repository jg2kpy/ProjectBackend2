import { Sequelize } from "sequelize";
import fs from "fs";

let dbConfig = {};

 // Leer el archivo de configuración de la base de datos
try {
    dbConfig = JSON.parse(fs.readFileSync("./db.json"));
} catch (err) {
    //Usar la configuracion default
    dbConfig = { dialect: "sqlite", storage: "./db.sqlite3" }
    console.error("Error al leer el archivo de configuración de la base de datos, usando la configuracion default");
}

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
    posicion_x: {
        type: Sequelize.INTEGER
    },
    posicion_y: {
        type: Sequelize.INTEGER
    },
    nro_piso: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    },
    capacidad_comensales: {
        type: Sequelize.INTEGER
    },

});

Restaurante.hasMany(Mesa, {
    foreignKey: {
        name: 'id_restaurante',
    }
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

export const Categoria = sequelize.define("Categoria", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: Sequelize.STRING
    },
});

export const Producto = sequelize.define("Producto", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: Sequelize.STRING
    },
    id_categoria: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Categoria',
            key: 'id',
        }
    },
    precio: {
        type: Sequelize.INTEGER
    },
});

export const ConsumoCabecera = sequelize.define("ConsumoCabecera", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_mesa: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Mesas',
            key: 'id',
        }
    },
    id_cliente: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Clientes', 
            key: 'id', 
        }
    },
    // Los estados pueden ser: <"abierto,"cerrado">
    estado: {
        type: Sequelize.STRING
    },
    total: {
        type: Sequelize.INTEGER
    },
    fecha_cierre: {
        type: Sequelize.DATE
    },
});

export const ConsumoDetalle = sequelize.define("ConsumoDetalle", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_producto: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Productos',
            key: 'id',
        }
    },
    cantidad: {
        type: Sequelize.INTEGER
    },
});


ConsumoCabecera.hasMany(ConsumoDetalle, {
    foreignKey: {
        name: 'id_cabecera',
    }
});
