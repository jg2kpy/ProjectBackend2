import express from "express";
import { getClientes, postClientes, putClientes, deleteClientes } from "../controllers/clientesController.js";

//Inicializar el router
const router = express.Router();

//Configurar las rutas
router.get("/", getClientes)
router.post("/", postClientes)
router.put("/:id", putClientes)
router.delete("/:id", deleteClientes)

export default router;
