import express from "express";
import { getMesas, postMesas, putMesas, deleteMesas } from "../controllers/mesasController.js";

//Inicializar el router
const router = express.Router();

//Configurar las rutas
router.get("/", getMesas)
router.post("/", postMesas)
router.put("/:id", putMesas)
router.delete("/:id", deleteMesas)

export default router;
