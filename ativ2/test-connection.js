import connection from "./config/sequelize-config.js";
import Usuario from "./models/Usuario.js";
import Cliente from "./models/Cliente.js";
import Pedido from "./models/Pedido.js";
import Produto from "./models/Produto.js";
import makeAssociations from "./config/associations.js";

async function test() {
  try {
    console.log("Iniciando sincronização...");
    await connection.authenticate();
    console.log("Conexão com o banco autenticada com sucesso.");

    makeAssociations();

    console.log("Sincronizando todos os models...");
    await connection.sync({ alter: true });
    console.log("Todos os models sincronizados com sucesso.");

    console.log("Sincronizando o model Produto isoladamente...");
    await Produto.sync({ alter: true });
    console.log("Model Produto sincronizado isoladamente com sucesso.");
  } catch (err) {
    console.error("Erro na conexão ou sincronização:", err.stack || err.message || err);
  } finally {
    await connection.close();
  }
}

test();
