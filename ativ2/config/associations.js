import Cliente from "../models/Cliente.js";
import Pedido from "../models/Pedido.js";
import Produto from "../models/Produto.js";

export default function makeAssociations() {
	
	Cliente.hasMany(Pedido, { foreignKey: "clienteId" });
	Pedido.belongsTo(Cliente, { foreignKey: "clienteId" });

	Pedido.belongsToMany(Produto, { through: "PedidoProduto", foreignKey: "pedidoId", otherKey: "produtoId" });
	Produto.belongsToMany(Pedido, { through: "PedidoProduto", foreignKey: "produtoId", otherKey: "pedidoId" });
}


