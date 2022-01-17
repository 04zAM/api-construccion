const { Router } = require("express");
const router = Router();

const { graphqlExpress, graphiqlExpress } = require("graphql-server-express");

// REST
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
  movie_schema,
  blog_schema,
  cita_schema,
} = require("../controllers");

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
  // Movies
  .post("/graphql/movie", graphqlExpress({ schema: movie_schema }))
  .get("/movie/api", graphiqlExpress({ endpointURL: "/graphql/movie" }))
  // Blogs
  .post("/graphql/blog", graphqlExpress({ schema: blog_schema }))
  .get("/blog/api", graphiqlExpress({ endpointURL: "/graphql/blog" }))
  // Citas
  .post("/graphql/cita", graphqlExpress({ schema: cita_schema }))
  .get("/cita/api", graphiqlExpress({ endpointURL: "/graphql/cita" }));

module.exports = router;
