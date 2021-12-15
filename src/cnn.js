const pgPromise = require("pg-promise");

let ssl = { rejectUnauthorized: false };

const config = {
  host: "ec2-34-224-239-147.compute-1.amazonaws.com",
  port: "5432",
  database: "ddpenflqbattk5",
  user: "hjizsgtokyjdfa",
  password: "109e41d95f27477210d76c30e830b2e7687518a28c5e7955bed4414d5a743c23",
  ssl: ssl,
};

//Working with Conexion Strings
const pgp = pgPromise({});
const db = pgp(process.env.DATABASE_URL || config);

exports.db = db;
