import { Reserva } from "../models/models.js";

export const getReservas = async (req, res) => {
    try {
        const reservas = await Reserva.findAll();
        res.json(reservas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno en el servidor" });
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
        console.error(error);
        res.status(500).json({ message: "Error interno en el servidor" });
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
            res.status(404).json({ message: "Reserva no encontrada" });
        } else {
            res.json(resultado[1]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
}


export const deleteReservas = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await Reserva.findByPk(id);
        if (resultado === null) {
            res.status(404).json({ message: "Reserva no encontrada" });
        } else {
            await resultado.destroy({ where: { id } });
            res.json("Reserva eliminada");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
}
