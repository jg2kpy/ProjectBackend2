import { Producto } from "../models/models.js";

export const obtenerPrecioFromProductoId = async (req, res) => {
    try {
        const { id } = req.body;
        const producto = await Producto.findByPk(id);
        if (producto) {
            res.json(producto.precio);
        } else {
            res.status(404).json({ message: "Producto no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
};

export const getProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
};

export const postProductos = async (req, res) => {
    try {
        const { nombre, id_categoria,
            precio } = req.body;
        const producto = await Producto.create({ nombre, id_categoria, precio });
        res.json(producto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
};

export const putProductos = async (req, res) => {
    try {
        const { nombre, id_categoria, precio } = req.body;
        const { id } = req.params;
        const resultado = await Producto.update(
            { nombre, id_categoria, precio },
            { where: { id } }
        );
        if (resultado[0] === 0) {
            res.status(404).json({ message: "Producto no encontrado" });
        } else {
            res.json(resultado[1]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
};

export const deleteProductos = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await Producto.destroy({ where: { id } });
        if (resultado === 0) {
            res.status(404).json({ message: "Producto no encontrado" });
        } else {
            res.json({ message: "Producto eliminado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
};
