const { Router } = require("express");
const router = Router();

const { graphqlExpress, graphiqlExpress } = require("graphql-server-express");

const {
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
  schema,
} = require("../controllers/index");

// Rutas
router
  .get("/", getHome)
  .get("/listar/:name", getListaByTable)
  .get("/api/actores", getActores)
  .post("/api/actores", postActores)
  .get("/api/actorById/:id", getActorById)
  .post("/api/actorMovie", postActorMovie)
  .post("/api/actor", deleteActor)
  .get("/api/actoresByMovie/:id", getActoresByMovie)
  .get("/api/countActoresByMovie/:id", getCountActByMovie)
  .get("/api/movieDetailed", getMovieDetails)
  // GraphQL
  .post("/graphql/movie", graphqlExpress({ schema }))
  .get("/graphql/graphiql", graphiqlExpress({ endpointURL: "/graphql/movie" }));

module.exports = router;
