import Sequelize from 'sequelize';
import connection from '../config/sequelize-config.js';

const { DataTypes } = Sequelize;

const Cliente = connection.define('clientes', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  endereco: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});

export default Cliente;
