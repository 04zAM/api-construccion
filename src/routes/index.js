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
} = require("../controllers/index");

//General
router
  .get("/", getHome)
  .get("/listar/:name", getListaByTable)
  .get("/api/actores", getActores)
  .post("/api/actores", postActores)
  .get("/api/actorById/:name", getActorById)
  .post("/api/actorMovie", postActorMovie)
  .put("/api/actor/:id", deleteActor)
  .get("/api/actoresByMovie/:name", getActoresByMovie)
  .get("/api/countActoresByMovie/:name", getCountActByMovie);

module.exports = router;
