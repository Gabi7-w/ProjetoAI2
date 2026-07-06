const { Op } = require("sequelize");
const { Event, Category, User, Registration } = require("../models");

const getAllEvents = async (req, res) => {
  try {
    const { search, categoryId, location, date } = req.query;

    const where = {};

    if (search) {
      where.title = {
        [Op.iLike]: `%${search}%`,
      };
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (location) {
      where.location = {
        [Op.iLike]: `%${location}%`,
      };
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);

      endDate.setDate(endDate.getDate() + 1);

      where.date = {
        [Op.gte]: startDate,
        [Op.lt]: endDate,
      };
    }

    const events = await Event.findAll({
      where,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["date", "ASC"]],
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao listar eventos.",
      error: error.message,
    });
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!event) {
      return res.status(404).json({
        message: "Evento não encontrado.",
      });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao obter evento.",
      error: error.message,
    });
  }
};

const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      location,
      capacity,
      categoryId,
    } = req.body;

    const creatorId = req.user.id;

    if (!title || !description || !date || !location || !categoryId) {
      return res.status(400).json({
        message:
          "Título, descrição, data, localização e categoria são obrigatórios.",
      });
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      capacity,
      categoryId,
      creatorId,
    });

    res.status(201).json({
      message: "Evento criado com sucesso.",
      event,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao criar evento.",
      error: error.message,
    });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      date,
      location,
      capacity,
      categoryId,
    } = req.body;

    const event = await Event.findByPk(id);

    if (event.creatorId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Não tens permissão para editar este evento.",
      });
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.capacity = capacity ?? event.capacity;
    event.categoryId = categoryId || event.categoryId;

    await event.save();

    res.json({
      message: "Evento atualizado com sucesso.",
      event,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar evento.",
      error: error.message,
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({
        message: "Evento não encontrado.",
      });
    }

    if (event.creatorId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Não tens permissão para eliminar este evento.",
      });
    }

    await Registration.destroy({
      where: {
        eventId: id,
      },
    });

    await event.destroy();

    res.json({
      message: "Evento eliminado com sucesso.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao eliminar evento.",
      error: error.message,
    });
  }
};

const getMyEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      where: {
        creatorId: req.user.id,
      },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["date", "ASC"]],
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao listar os teus eventos.",
      error: error.message,
    });
  }
};


module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
};