import { Reserva } from "../models/models.js";

export const getReservas = async (req, res) => {
    try {
        const reservas = await Reserva.findAll();
        res.json(reservas);
    } catch (error) {
        res.status(500).json({ error: "Error interno en el servidor" });
    }
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
    try {
        const reserva = await Reserva.create({
            id_restaurante,
            id_mesa,
            fecha,
            rango_hora,
            id_cliente,
            cantidad
        });
        res.json(reserva);
    } catch (error) {
        res.status(500).json({ error: "Error interno en el servidor" });
    }
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
    try {
        const resultado = await Reserva.update({
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
        if (resultado[0] === 0) {
            res.status(404).json({ error: "Reserva no encontrada" });
        } else {
            res.json(resultado[1]);
        }
    } catch (error) {
        res.status(500).json({ error: "Error interno en el servidor" });
    }
}


export const deleteReservas = async (req, res) => {
    const { id } = req.params;
    try {
        const reserva = await Reserva.findByPk(id);
        if (reserva === null) {
            res.status(404).json({ error: "Reserva no encontrada" });
        } else {
            await Reserva.destroy({ where: { id } });
            res.json("Reserva eliminada");
        }
    } catch (error) {
        res.status(500).json({ error: "Error interno en el servidor" });
    }
}
