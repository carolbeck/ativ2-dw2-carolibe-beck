import Sequelize from "sequelize";

const connection = new Sequelize({
	dialect: "mysql",
	host: "localhost",
	username: "root",
	password: "",
	timezone: "-03:00",
	database: "ATV02_CRUD_NODEJS",
});

export default connection;
