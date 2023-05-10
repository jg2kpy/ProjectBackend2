import { Cliente } from "../models/models.js";

export const getClientes = async (req, res) => {
    const clientes = await Cliente.findAll();
    res.json(clientes);
}

export const postClientes = async (req, res) => {
    const { nombre, apellido, cedula } = req.body;
    const cliente = await Cliente.create({ nombre, apellido, cedula });
    res.json(cliente);
}

export const putClientes = async (req, res) => {
    const { nombre, apellido, cedula } = req.body;
    const { id } = req.params;
    const cliente = await Cliente.update({ nombre, apellido, cedula },
        {
            where: { id },
        });
    res.json(cliente);
}

export const deleteClientes = async (req, res) => {
    const { id } = req.params;
    await Cliente.destroy(
        {
            where: { id },
        });
    res.json(Cliente);
}
