const { Router } = require("express");
const router = Router();

const { graphqlExpress, graphiqlExpress } = require("graphql-server-express");

// REST
const {
  // General
  getHome,
  getListaByTable,
  // Movies
  getMovies,
  postMovie,
  delMovie,
  editMovie,
  // Actors
  getActores,
  postActores,
  delActor,
  editActor,
  // Actor Movie
  getActorMovie,
  postActorMovie,
  delActorMovie,
  editActorMovie,
  // Utils
  getActorById,
  getActoresByMovie,
  getCountActByMovie,
  getMovieDetails,
  movie_schema,
  blog_schema,
  cita_schema,
} = require("../controllers");

// Rutas
router
  //REST
  .get("/", getHome)
  .get("/listar/:name", getListaByTable)
  // Movies
  // CRUD actores
  .get("/api/actors", getActores)
  .post("/api/actors", postActores)
  .get("/api/del/actor/:act_id", delActor)
  .post("/api/edit/actor", editActor)
  // CRUD movies
  .get("/api/movies", getMovies)
  .post("/api/movies", postMovie)
  .get("/api/del/movie/:mov_id", delMovie)
  .post("/api/edit/movie", editMovie)
  // CRUD actor_movie
  .get("/api/actorMovie/:mov_id", getActorMovie)
  .post("/api/actorMovie", postActorMovie)
  .get("/api/del/actorMovie/:act_mov_id", delActorMovie)
  .post("/api/edit/actorMovie", editActorMovie)
  // Utils
  .get("/api/actorById/:id", getActorById)
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
