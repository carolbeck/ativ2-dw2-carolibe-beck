import mysql from "mysql2/promise";

const host = "localhost";
const user = "root";
const password = ""; 
const database = "atv02_crud_nodejs"; 

async function createDatabase() {
  try {
    const connection = await mysql.createConnection({ host, user, password });
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`
    );
    console.log(`Banco de dados '${database}' criado ou já existente.`);
    await connection.end();
  } catch (err) {
    console.error("Erro ao criar banco de dados:", err.stack || err);
    process.exit(1);
  }
}

createDatabase();
