const pgPromise = require("pg-promise");

const config = {
  host: "localhost",
  port: "5432",
  database: "app-distribuidas",
  user: "postgres",
  password: "root",
  ssl: false,
};

//Working with Conexion Strings
const pgp = pgPromise({});
pgp.pg.defaults.ssl = true;
const db = pgp(process.env.DATABASE_URL || config);

exports.db = db;
