import Sequelize from "sequelize";
import connection from "../config/sequelize-config.js";

const { DataTypes } = Sequelize;

const Usuario = connection.define(
  "Usuario",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "usuarios",
    timestamps: true,
  }
);

export default Usuario;
