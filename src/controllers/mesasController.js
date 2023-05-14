import { Mesa } from "../models/models.js";

export const getMesas = async (req, res) => {
    try {
        const mesas = await Mesa.findAll();
        res.json(mesas);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
};

export const postMesas = async (req, res) => {
    const {
        nombre,
        id_restaurante,
        posicion_x,
        posicion_y,
        nro_piso,
        capacidad_comensales,
    } = req.body;
    try {
        const mesa = await Mesa.create({
            nombre,
            id_restaurante,
            posicion_x,
            posicion_y,
            nro_piso,
            capacidad_comensales,
        });
        res.json(mesa);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
};

export const putMesas = async (req, res) => {
    const {
        nombre,
        id_restaurante,
        posicion_x,
        posicion_y,
        nro_piso,
        capacidad_comensales,
    } = req.body;
    const { id } = req.params;
    try {
        const resultado = await Mesa.update(
            {
                nombre,
                id_restaurante,
                posicion_x,
                posicion_y,
                nro_piso,
                capacidad_comensales,
            },
            {
                where: { id },
            }
        );
        if (resultado[0] === 0) {
            res.status(404).json({ message: "Mesa no encontrada" });
        } else {
            res.json(resultado[1]);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
};

export const deleteMesas = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Mesa.destroy({
            where: { id },
        });
        if (result === 0) {
            res.status(404).json({ message: "Mesa no encontrada" });
        } else {
            res.json({ message: "Mesa eliminada" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
};
