const { Router } = require("express");
const router = Router();

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
  .get("/api/movieDetailed", getMovieDetails);

module.exports = router;
