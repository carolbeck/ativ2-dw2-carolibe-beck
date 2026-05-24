import Sequelize from 'sequelize';
import connection from '../config/sequelize-config.js';

const { DataTypes } = Sequelize;

const Pedido = connection.define('pedidos', {
  data: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  clienteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
});

export default Pedido;
