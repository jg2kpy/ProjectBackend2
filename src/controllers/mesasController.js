import { Mesa } from "../models/models.js";

export const getMesas = async (req, res) => {
    const mesas = await Mesa.findAll();
    res.json(mesas);
}

export const postMesas = async (req, res) => {
    const {
        nombre,
        id_restaurante,
        posicion_x,
        posicion_y,
        nro_piso,
        capacidad_comensales,
    } = req.body;
    const mesa = await Mesa.create({
        nombre,
        id_restaurante,
        posicion_x,
        posicion_y,
        nro_piso,
        capacidad_comensales,
    });
    res.json(mesa);
}

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
    const mesa = await Mesa.update({
        nombre,
        id_restaurante,
        posicion_x,
        posicion_y,
        nro_piso,
        capacidad_comensales,
    }, {
        where: { id },
    });
    res.json(mesa);
}

export const deleteMesas = async (req, res) => {
    const { id } = req.params;
    await Mesa.destroy(
        {
            where: { id },
        });
    res.json(Mesa);
}
