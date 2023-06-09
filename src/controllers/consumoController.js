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

        if (estado === "cerrado") {
            const resultado = await ConsumoCabecera.update(
                {
                    fecha_cierre: new Date(),
                },
                { where: { id } }
            );
        }

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

        // Crear un nuevo detalle de consumo con los datos recibidos del front-end
        const Detalle = await ConsumoDetalle.create({ id_cabecera, id_producto, cantidad });

        // Obtener la cabecera original que se va a actualizar
        const oldCabecera = await ConsumoCabecera.findByPk(id_cabecera);

        // Obtener el valor del total de la cabecera original
        const oldTotal = oldCabecera.dataValues["total"] || 0;

        // Obtener el precio del producto que se va a agregar al consumo
        const producto = await Producto.findByPk(id_producto);
        const precio = producto.dataValues["precio"]

        // Calcular el nuevo total, sumando el total anterior al nuevo producto agregado
        const total = oldTotal + precio * parseInt(cantidad);

        // Actualizar el valor total de la cabecera en la base de datos
        await ConsumoCabecera.update({ total }, { where: { id: id_cabecera } });

        // Obtener la cabecera actualizada para enviarla como respuesta al front-end
        const updatedCabecera = await ConsumoCabecera.findOne({ where: { id: id_cabecera } });

        // Enviar una respuesta 200 al front-end, con el detalle creado y la cabecera actualizada 
        res.status(200).json({
            detalle: Detalle,
            cabecera: updatedCabecera,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
}

