import express from "express";
import { sequelize } from "./src/models/models.js";
import restaurantesRouter from "./src/routes/restaurantesRouter.js";
import clientesRouter from "./src/routes/clientesRouter.js";
import mesasRouter from "./src/routes/mesasRouter.js";

//Crear la DB si no existe y sincronizar los modelos
await sequelize.sync()

//Inicializar el servidor
const app = express();

//Configurar el servidor para que pueda recibir JSON
app.use(express.json());

//Configurar las rutas
app.use("/restaurantes", restaurantesRouter)
app.use("/clientes", clientesRouter)
app.use("/mesas", mesasRouter)

//Levantar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
