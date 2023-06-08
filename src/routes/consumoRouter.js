import express from "express";
import { getCabeceraAbiertaFromMesa,getConsumoCabecera, getConsumoDetalle, postConsumoCabecera,postConsumoDetalle } from "../controllers/consumoController.js";

//Inicializar el router
const router = express.Router();

//Configurar las rutas
router.get("", getCabeceraAbiertaFromMesa )
router.get("/cabecera", getConsumoCabecera)
router.get("/detalle", getConsumoDetalle)
router.post("/cabecera", postConsumoCabecera)
router.post("/detalle", postConsumoDetalle)

export default router;
