import { Categoria } from "../models/models.js";

const logOperation = (operation) => {
  console.log(`Realizando operación: ${operation}`);
};

export const getCategorias = async (req, res) => {
  try {
    logOperation('Obtener categorías');
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno en el servidor" });
  }
};

export const postCategorias = async (req, res) => {
  try {
    const { nombre } = req.body;
    logOperation('Crear categoría');
    const categoria = await Categoria.create({ nombre });
    res.json(categoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno en el servidor" });
  }
};

export const putCategorias = async (req, res) => {
  try {
    const { nombre } = req.body;
    const { id } = req.params;
    logOperation('Actualizar categoría');
    const resultado = await Categoria.update(
      { nombre },
      { where: { id } }
    );
    if (resultado[0] === 0) {
      res.status(404).json({ message: "Categoría no encontrada" });
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
    logOperation('Eliminar categoría');
    const resultado = await Categoria.destroy({ where: { id } });
    if (resultado === 0) {
      res.status(404).json({ message: "Categoría no encontrada" });
    } else {
      res.json({ message: "Categoría eliminada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno en el servidor" });
  }
};
