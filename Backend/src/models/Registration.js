const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Registration = sequelize.define("Registration", {
  status: {
    type: DataTypes.ENUM("active", "cancelled"),
    defaultValue: "active",
  },
});

module.exports = Registration;