const { Registration, Event, User, Category } = require("../models");

const registerUserInEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const event = await Event.findByPk(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Evento não encontrado.",
      });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        message: "Utilizador não encontrado.",
      });
    }

    const existingRegistration = await Registration.findOne({
      where: {
        userId,
        eventId,
        status: "active",
      },
    });

    if (existingRegistration) {
      return res.status(400).json({
        message: "O utilizador já está inscrito neste evento.",
      });
    }

    if (event.capacity) {
      const totalRegistrations = await Registration.count({
        where: {
          eventId,
          status: "active",
        },
      });

      if (totalRegistrations >= event.capacity) {
        return res.status(400).json({
          message: "Este evento já atingiu a lotação máxima.",
        });
      }
    }

    const registration = await Registration.create({
      userId,
      eventId,
      status: "active",
    });

    res.status(201).json({
      message: "Inscrição realizada com sucesso.",
      registration,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao realizar inscrição.",
      error: error.message,
    });
  }
};

const cancelRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const registration = await Registration.findOne({
      where: {
        userId,
        eventId,
        status: "active",
      },
    });

    if (!registration) {
      return res.status(404).json({
        message: "Inscrição não encontrada.",
      });
    }

    registration.status = "cancelled";
    await registration.save();

    res.json({
      message: "Inscrição cancelada com sucesso.",
      registration,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao cancelar inscrição.",
      error: error.message,
    });
  }
};

const getEventParticipants = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId, {
      include: [
        {
          model: User,
          as: "participants",
          attributes: ["id", "name", "email"],
          through: {
            attributes: ["status", "createdAt"],
            where: {
              status: "active",
            },
          },
        },
      ],
    });

    if (!event) {
      return res.status(404).json({
        message: "Evento não encontrado.",
      });
    }

    res.json(event.participants);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao listar participantes.",
      error: error.message,
    });
  }
};

const getUserRegistrations = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      include: [
        {
          model: Event,
          as: "registeredEvents",
          through: {
            attributes: ["status", "createdAt"],
            where: {
              status: "active",
            },
          },
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        message: "Utilizador não encontrado.",
      });
    }

    res.json(user.registeredEvents);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao listar inscrições do utilizador.",
      error: error.message,
    });
  }
};

const getMyRegistrations = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: Event,
          as: "registeredEvents",
          through: {
            attributes: ["status", "createdAt"],
            where: {
              status: "active",
            },
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
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        message: "Utilizador não encontrado.",
      });
    }

    res.json(user.registeredEvents);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao listar as tuas inscrições.",
      error: error.message,
    });
  }
};

module.exports = {
  registerUserInEvent,
  cancelRegistration,
  getEventParticipants,
  getUserRegistrations,
  getMyRegistrations,
};