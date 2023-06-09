import { ConsumoCabecera, ConsumoDetalle, Cliente, Producto } from "../models/models.js";

const logOperation = (operation) => {
  console.log(`Realizando operación: ${operation}`);
};

export const getCabeceraAbiertaFromMesa = async (req, res) => {
  const id_mesa = req.query.id_mesa;
  try {
    logOperation('Obtener cabecera abierta desde mesa');
    const consumoCabeceras = await ConsumoCabecera.findAll({
      where: {
        id_mesa,
        estado: "abierto"
      },
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
    logOperation('Obtener consumo cabecera');
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
    logOperation('Crear consumo cabecera');
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

    logOperation('Actualizar consumo cabecera');
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
    logOperation('Obtener consumo detalle');
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

    logOperation('Crear consumo detalle');
    const Detalle = await ConsumoDetalle.create({ id_cabecera, id_producto, cantidad });

    const oldCabecera = await ConsumoCabecera.findByPk(id_cabecera);
    const oldTotal = oldCabecera.dataValues["total"] || 0;

    const producto = await Producto.findByPk(id_producto);
    const precio = producto.dataValues["precio"]

    const total = oldTotal + precio * parseInt(cantidad);

    await ConsumoCabecera.update({ total }, { where: { id: id_cabecera } });

    const updatedCabecera = await ConsumoCabecera.findOne({ where: { id: id_cabecera } });

    res.status(200).json({
      detalle: Detalle,
      cabecera: updatedCabecera,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno en el servidor" });
  }
}
