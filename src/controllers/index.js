const { db } = require("../cnn");

const getHome = (req, res) => {
  res.render("./pages/index");
};

const getListaByTable = async (req, res) => {
  const name = req.params.name;
  const response = await db.any(`select * from $1:name;`, [name]);
  res.json(response);
};

//API's Salida
// get actor
const getActores = async (req, res) => {
  const response = await db.any(
    `select * from actor where act_state=true;`
  );
  res.json(response);
};

// post actor
const postActores = async (req, res) => {
  const { act_id, act_name, act_country } = req.body;
  const response = await db.query(
    `INSERT INTO actor(
      act_id, act_name, act_country, act_state)
      VALUES ($1, $2, $3, true);`,
    [act_id, act_name, act_country]
  );
  res.json({
    message: "Actor was created successfully",
    body: {
      actor: { act_name },
    },
  });
};

// actor por id
const getActorById = async (req, res) => {
  const { act_id } = req.params.name;
  const response = await db.any(`select * from actor where act_id=$1;`, [act_id]);
  res.json(response);
};

// post actor_movie
const postActorMovie = async (req, res) => {
  const { id, movie, actor, state, actor_principal } = req.body;
  const response = await db.query(
    `INSERT INTO actor_movie(
      act_mov_id, mov_id, act_id, act_mov_state, act_mov_actor_principal)
      VALUES ($1, $2, $3, true, $4);`,
    [id, movie, actor, actor_principal]
  );
  res.json({
    message: "Actor Movie was created successfully",
    body: {
      actor: { actor_principal },
    },
  });
};

//Actualizar Stock venta
const deleteActor = async (req, res) => {
  const { id } = req.params.name;
  const response = await db.query(
    `update actor set act_state=false 
  where act_id=$1;`,
    [id]
  );
  res.json({
    message: "Actor Deleted Successfully",
    body: {
      actor: { id },
    },
  });
};

// productos activos con o sin stock
const getActoresByMovie = async (req, res) => {
  const codigo = req.params.name;
  const response = await db.any(
    `select * from actor inner join actor_movie on(act_id)
    inner join movie on(mov_id) where act_estate=true and mov_id=$1;`,
    [id]
  );
  res.json(response);
};

const getCountActByMovie = async (req, res) => {
  const codigo = req.params.id;
  const response = await db.any(
    `select count(*) from actor inner join actor_movie on(act_id)
    inner join movie on(mov_id) where act_estate=true and mov_id=$1;`,
    [id]
  );
  res.json(response);
};

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
};
