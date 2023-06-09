import express from "express";
import { getProductos, postProductos, putProductos, deleteProductos, obtenerPrecioFromProductoId } from "../controllers/productosController.js";

//Inicializar el router
const router = express.Router();

//Configurar las rutas
router.get("/", getProductos)
router.post("/", postProductos)
router.put("/:id", putProductos)
router.delete("/:id", deleteProductos)
router.post("/precio", obtenerPrecioFromProductoId)


export default router;
