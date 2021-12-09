const { db } = require("../cnn");

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
      actor: { act_id,
        act_name,
      act_country },
    },
  });
};

// actor por id
const getActorById = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const response = await db.any(`select * from actor where act_id=$1;`, [id]);
  res.json(response);
};

// post actor_movie
const postActorMovie = async (req, res) => {
  const { id, movie, actor, actor_principal } = req.body;
  const response = await db.query(
    `INSERT INTO actor_movie(
      act_mov_id, mov_id, act_id, act_mov_state, act_mov_actor_principal)
      VALUES ($1, $2, $3, true, $4);`,
    [id, movie, actor, actor_principal]
  );
  res.json({
    message: "Actor Movie was created successfully",
    body: {
      actor: { movie, actor, actor_principal },
    },
  });
};

// delete actor
const deleteActor = async (req, res) => {
  const {id} = req.body;
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

// get actors by movie
const getActoresByMovie = async (req, res) => {
  const id = req.params.id;
  const response = await db.any(
    `select a.* from actor a inner join actor_movie using(act_id)
    inner join movie using(mov_id) where a.act_state=true and mov_id=$1;`,
    [id]
  );
  res.json(response);
};

// get movies with its actors
const getMovieDetails = async (req, res) => {
  let response = [];
  let movies = await db.any(`select mov_id, mov_title from movie`);
  await movies.map((movie) => {
    let actors = await db.any(
      `select a.* from actor a inner join actor_movie using(act_id)
      inner join movie using(mov_id) where a.act_state=true and mov_id=$1;`,
      [movie.mov_id]
    )
    await response.push(movie.mov_id, movie.mov_title, actors);
  });
  res.json(response);
};

// get count actors by movie
const getCountActByMovie = async (req, res) => {
  const id = req.params.id;
  const response = await db.any(
    `select count(*) from actor a inner join actor_movie using(act_id)
    inner join movie using(mov_id) where a.act_state=true 
    and act_mov_actor_principal=true and mov_id=$1;`,
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
  getMovieDetails,
};
