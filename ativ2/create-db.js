import mysql from "mysql2/promise";
import { fileURLToPath } from "url";

const host = "localhost";
const user = "root";
const password = "";
const database = "atv02_crud_nodejs";

export async function createDatabase() {
  try {
    const connection = await mysql.createConnection({ host, user, password });
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`
    );
    console.log(`Banco de dados '${database}' criado ou já existente.`);
    await connection.end();
  } catch (err) {
    console.error("Erro ao criar banco de dados:", err.stack || err);
    throw err;
  }
}

// Executa quando chamado diretamente: `node create-db.js`
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  createDatabase().catch((err) => {
    console.error("Erro ao criar banco de dados:", err);
    process.exit(1);
  });
}

// Executa automaticamente quando o módulo é importado (garante criação ao iniciar app)
createDatabase().catch((err) => {
  console.error("Erro ao criar banco de dados na importação:", err);
  // não encerra o processo aqui para não interromper a inicialização automática do servidor
});
