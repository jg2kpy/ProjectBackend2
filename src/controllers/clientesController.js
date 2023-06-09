import { Cliente } from "../models/models.js";

export const getClientes = async (req, res) => {
    try {
        const clientes = await Cliente.findAll();
        res.json(clientes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
}

export const postClientes = async (req, res) => {
    try {
        const { nombre, apellido, cedula } = req.body;
        const cliente = await Cliente.create({ nombre, apellido, cedula });
        res.json(cliente);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
}

export const putClientes = async (req, res) => {
    try {
        const { nombre, apellido, cedula } = req.body;
        const { id } = req.params;
        const resultado = await Cliente.update({ nombre, apellido, cedula }, { where: { id } });
        if (resultado[0] === 0) {
            res.status(404).json({ message: "Cliente no encontrado" });
        } else {
            res.json(resultado[1]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
}


export const deleteClientes = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await Cliente.findByPk(id);
        if (resultado === null) {
            res.status(404).json({ message: "Cliente no encontrado" });
        } else {
            await Cliente.destroy({ where: { id } });
            res.json({ message: "Cliente eliminado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
}
