import { request, response } from "express";
import { Reserva } from "../models/models";

export const verificacionCreacionReserva = async (req = request, res = response, next) => {
    try {
        const { id_restaurante, id_mesa, fecha, rango_hora, id_cliente, cantidad, } = req.body

        next()
    } catch (error) {
        console.error('Error en verificacionCreacionReserva - ', error)
        next(error)
    }
}