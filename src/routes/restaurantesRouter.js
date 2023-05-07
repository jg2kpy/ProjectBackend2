import express from "express";
import { getRestaurantes, postRestaurantes, putRestaurantes, deleteRestaurantes } from "../controllers/restaurantesController.js";

//Inicializar el router
const router = express.Router();

//Configurar las rutas
router.get("/", getRestaurantes)
router.post("/", postRestaurantes)
router.put("/:id", putRestaurantes)
router.delete("/:id", deleteRestaurantes)

export default router;
