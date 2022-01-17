const { db } = require("../cnn");

// REST

// Pagina inicial
const getHome = (req, res) => {
  res.render("./pages/index");
};

// Lista Cualquier Tabla
const getListaByTable = async (req, res) => {
  const name = req.params.name;
  const response = await db.any(`select * from $1:name;`, [name]);
  res.json(response);
};

// REST Movie
const {
    getActores,
    postActores,
    getActorById,
    postActorMovie,
    deleteActor,
    getActoresByMovie,
    getCountActByMovie,
    getMovieDetails,
    movie_schema,
  } = require("./movie"),
  { blog_schema } = require("./blog"),
  { cita_schema } = require("./cita");

module.exports = {
  getHome,
  getListaByTable,
  getActores,
  postActores,
  getActorById,
  postActorMovie,
  deleteActor,
  getActoresByMovie,
  getCountActByMovie,
  getMovieDetails,
  // GraphQL
  movie_schema,
  blog_schema,
  cita_schema,
};
