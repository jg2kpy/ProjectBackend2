import { Reserva } from "../models/models.js";

export const getReservas = async (req, res) => {
    const reservas = await Reserva.findAll();
    res.json(reservas);
}

export const postReservas = async (req, res) => {
    const { 
        id_restaurante,
        id_mesa,
        fecha,
        rango_hora,
        id_cliente,
        cantidad
    } = req.body;
    const reserva = await Reserva.create({ 
        id_restaurante,
        id_mesa,
        fecha,
        rango_hora,
        id_cliente,
        cantidad
    });
    res.json(reserva);
}

export const putReservas = async (req, res) => {
    const { 
        id_restaurante,
        id_mesa,
        fecha,
        rango_hora,
        id_cliente,
        cantidad 
    } = req.body;
    const { id } = req.params;
    const reserva = await Reserva.update({ 
        id_restaurante,
        id_mesa,
        fecha,
        rango_hora,
        id_cliente,
        cantidad
     },
        {
            where: { id },
        });
    res.json(reserva);
}

export const deleteReservas = async (req, res) => {
    const { id } = req.params;
    await Reserva.destroy(
        {
            where: { id },
        });
    res.json(Reserva);
}
