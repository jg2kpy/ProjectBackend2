import express from "express";
import { getReservas, postReservas, putReservas, deleteReservas } from "../controllers/reservasController.js";

//Inicializar el router
const router = express.Router();

//Configurar las rutas
router.get("/", getReservas)
router.post("/", postReservas)
router.put("/:id", putReservas)
router.delete("/:id", deleteReservas)

export default router;
