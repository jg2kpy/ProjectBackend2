import express from "express";
import { getCategorias, postCategorias, putCategorias, deleteCategorias } from "../controllers/categoriasController.js";

//Inicializar el router
const router = express.Router();

//Configurar las rutas
router.get("/", getCategorias)
router.post("/", postCategorias)
router.put("/:id", putCategorias)
router.delete("/:id", deleteCategorias)

export default router;
