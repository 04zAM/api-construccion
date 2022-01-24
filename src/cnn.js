const pgPromise = require("pg-promise");
// require("dotenv").config();

//Working with Conexion Strings
const pgp = pgPromise({});
// Produccion o Local
const db = pgp(process.env.DATABASE_URL);

exports.db = db;
