const User = require("./User");
const Category = require("./Category");
const Event = require("./Event");
const Registration = require("./Registration");

// Um utilizador pode criar vários eventos
User.hasMany(Event, {
  foreignKey: "creatorId",
  as: "createdEvents",
});

Event.belongsTo(User, {
  foreignKey: "creatorId",
  as: "creator",
});

// Uma categoria pode ter vários eventos
Category.hasMany(Event, {
  foreignKey: "categoryId",
  as: "events",
});

Event.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
});

// Um utilizador pode inscrever-se em vários eventos
User.belongsToMany(Event, {
  through: Registration,
  foreignKey: "userId",
  as: "registeredEvents",
});

Event.belongsToMany(User, {
  through: Registration,
  foreignKey: "eventId",
  as: "participants",
});

Registration.belongsTo(User, {
  foreignKey: "userId",
});

Registration.belongsTo(Event, {
  foreignKey: "eventId",
});

module.exports = {
  User,
  Category,
  Event,
  Registration,
};