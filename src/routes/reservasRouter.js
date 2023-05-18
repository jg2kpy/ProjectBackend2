import express from "express";
import { getReservas, postReservas, putReservas, deleteReservas, getLibres } from "../controllers/reservasController.js";

//Inicializar el router
const router = express.Router();

//Configurar las rutas
router.post("/", postReservas)
router.get("/", getReservas)
router.put("/:id", putReservas)
router.delete("/:id", deleteReservas)
router.get("/libres", getLibres)

export default router;
