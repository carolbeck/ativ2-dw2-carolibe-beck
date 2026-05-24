import Sequelize from 'sequelize';
import connection from '../config/sequelize-config.js';

const { DataTypes } = Sequelize;

const Produto = connection.define('produtos', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  linha: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  indicacao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  preco: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  imagem: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  icone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});

export default Produto;
