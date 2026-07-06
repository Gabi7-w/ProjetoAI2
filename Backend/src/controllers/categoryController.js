const { Category } = require("../models");

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [["name", "ASC"]],
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao listar categorias.",
      error: error.message,
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "O nome da categoria é obrigatório.",
      });
    }

    const category = await Category.create({ name });

    res.status(201).json({
      message: "Categoria criada com sucesso.",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao criar categoria.",
      error: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        message: "Categoria não encontrada.",
      });
    }

    category.name = name || category.name;

    await category.save();

    res.json({
      message: "Categoria atualizada com sucesso.",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar categoria.",
      error: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        message: "Categoria não encontrada.",
      });
    }

    await category.destroy();

    res.json({
      message: "Categoria eliminada com sucesso.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao eliminar categoria.",
      error: error.message,
    });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};