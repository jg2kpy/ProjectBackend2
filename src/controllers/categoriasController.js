import { Categoria } from "../models/models.js";

export const getCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.findAll();
        res.json(categorias);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
};

export const postCategorias = async (req, res) => {
    try {
        const { nombre, direccion } = req.body;
        const categoria = await Categoria.create({ nombre, direccion });
        res.json(categoria);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
};

export const putCategorias = async (req, res) => {
    try {
        const { nombre, direccion } = req.body;
        const { id } = req.params;
        const resultado = await Categoria.update(
            { nombre, direccion },
            { where: { id } }
        );
        if (resultado[0] === 0) {
            res.status(404).json({ message: "Categoria no encontrado" });
        } else {
            res.json(resultado[1]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
};

export const deleteCategorias = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await Categoria.destroy({ where: { id } });
        if (resultado === 0) {
            res.status(404).json({ message: "Categoria no encontrado" });
        } else {
            res.json({ message: "Categoria eliminado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
};
