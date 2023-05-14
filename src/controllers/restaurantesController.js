import { Restaurante } from "../models/models.js";

export const getRestaurantes = async (req, res) => {
    try {
        const restaurantes = await Restaurante.findAll();
        res.json(restaurantes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
};

export const postRestaurantes = async (req, res) => {
    try {
        const { nombre, direccion } = req.body;
        const restaurante = await Restaurante.create({ nombre, direccion });
        res.json(restaurante);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
};

export const putRestaurantes = async (req, res) => {
    try {
        const { nombre, direccion } = req.body;
        const { id } = req.params;
        const resultado = await Restaurante.update(
            { nombre, direccion },
            { where: { id } }
        );
        if (resultado[0] === 0) {
            res.status(404).json({ message: "Restaurante no encontrado" });
        } else {
            res.json(resultado[1]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
};

export const deleteRestaurantes = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRows = await Restaurante.destroy({ where: { id } });
        if (deletedRows === 0) {
            res.status(404).json({ message: "Restaurante no encontrado" });
        } else {
            res.json({ message: "Restaurante eliminado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
};
