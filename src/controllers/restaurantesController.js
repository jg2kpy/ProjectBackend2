import { Restaurante } from "../models/models.js";

export const getRestaurantes = async (req, res) => {
    const restaurantes = await Restaurante.findAll();
    res.json(restaurantes);
}

export const postRestaurantes = async (req, res) => {
    const { nombre, direccion } = req.body;
    const restaurante = await Restaurante.create({ nombre, direccion });
    res.json(restaurante);
}

export const putRestaurantes = async (req, res) => {
    const { nombre, direccion } = req.body;
    const { id } = req.params;
    const restaurante = await Restaurante.update({ nombre, direccion },
        {
            where: { id },
        });
    res.json(restaurante);
}

export const deleteRestaurantes = async (req, res) => {
    const { id } = req.params;
    await Restaurante.destroy(
        {
            where: { id },
        });
    res.json(Restaurante);
}
