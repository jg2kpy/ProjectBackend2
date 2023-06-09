import { ConsumoCabecera, ConsumoDetalle, Cliente, Producto } from "../models/models.js";

export const getCabeceraAbiertaFromMesa = async (req, res) => {
    const id_mesa = req.query.id_mesa;
    try {
        const consumoCabeceras = await ConsumoCabecera.findAll({
            where: {
                id_mesa,
                estado: "abierto"
            },
            //incluir detalles
            include: [
            {
                model: ConsumoDetalle
            }
            ]
        });
        res.json(consumoCabeceras);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
}

export const getConsumoCabecera = async (req, res) => {
    try {
        const consumoCabeceras = await ConsumoCabecera.findAll();
        res.json(consumoCabeceras);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
}

export const postConsumoCabecera = async (req, res) => {
    try {
        const { 
            id_mesa, 
            id_cliente,
        } = req.body;
        const consumoCabecera = await ConsumoCabecera.create({ 
            id_mesa, 
            id_cliente,
            estado: "abierto",
            total: 0,
        });
        res.json(consumoCabecera);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
}

export const putConsumoCabecera = async (req, res) => {
    try {
        const { 
            id_cliente, 
            estado, 
        } = req.body;
        const { id } = req.params;

        const resultado = await ConsumoCabecera.update(
            { 
                id_cliente, 
                estado,
            }, 
            { where: { id } }
        );

        if (resultado[0] === 0) {
            res.status(404).json({ message: "Cabecera de Consumo no encontrada" });
        } else {
            res.json(resultado[1]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
}

export const getConsumoDetalle = async (req, res) => {
    try {
        const Detalle = await ConsumoDetalle.findAll();
        res.json(Detalle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
}

export const postConsumoDetalle = async (req, res) => {
    try {
        const { id_cabecera, id_producto, cantidad } = req.body;
        const Detalle = await ConsumoDetalle.create({ id_cabecera, id_producto, cantidad });
        let oldTotal = ConsumoCabecera.findAll({where: {id: id_cabecera}}).total;
        oldTotal = oldTotal ? oldTotal : 0;
        const total = oldTotal + await Producto.findAll({where: {id: id_producto}}).precio * parseInt(cantidad);
        console.log("Precio ", await Producto.findAll({where: {id: id_producto}}).precio);
        ConsumoCabecera.update({total}, {where: {id: id_cabecera}});
        res.json(Detalle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
}

