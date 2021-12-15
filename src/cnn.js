const pgPromise = require("pg-promise");

let ssl = { rejectUnauthorized: false };

const config = {
  host: "ec2-34-224-239-147.compute-1.amazonaws.com",
  port: "5432",
  database: "ddpenflqbattk5",
  user: "hjizsgtokyjdfa",
  ssl: ssl,
};

//Working with Conexion Strings
const pgp = pgPromise({});
const db = pgp(process.env.DATABASE_URL || config);

exports.db = db;
