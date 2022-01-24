const { db } = require("../../cnn");

// GraphQL
const { importSchema } = require("graphql-import");
const { makeExecutableSchema } = require("graphql-tools");
const typeDefs = importSchema("./src/controllers/movie/type-system.graphql");
const resolvers = require("./resolver");
const movie_schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Rest
// CRUD movies
// get movies
const getMovies = async (req, res) => {
  const response = await db.any(
    `select * from movie where mov_state=true order by mov_id;`
  );
  res.json(response);
};

// post movie
const postMovie = async (req, res) => {
  const { mov_title, mov_producer } = req.body;
  const response = await db.query(
    `insert into movie(mov_title, mov_producer, mov_state) values($1, $2, true)`,
    [mov_title, mov_producer]
  );
  res.json({
    message: "Movie was created successfully",
    body: {
      movie: { mov_title, mov_producer },
    },
  });
};

// del movie
const delMovie = async (req, res) => {
  const { mov_id } = req.params;
  const response = await db.query(
    `update movie set mov_state=false 
  where mov_id=$1;`,
    [mov_id]
  );
  res.json({
    message: "Movie Deleted Successfully",
    body: {
      movie: { mov_id },
    },
  });
};

// edit movie
const editMovie = async (req, res) => {
  const { mov_title, mov_producer, mov_id } = req.body;
  const response = await db.query(
    `update movie set mov_title=$1, mov_producer=$2 
  where mov_id=$3;`,
    [mov_title, mov_producer, mov_id]
  );
  res.json({
    message: "Movie Edited Successfully",
    body: {
      movie: { mov_id, mov_title, mov_producer },
    },
  });
};

// CRUD actors
// get actor
const getActores = async (req, res) => {
  const response = await db.any(
    `select * from actor where act_state=true order by act_id;`
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
      actor: { act_id, act_name, act_country },
    },
  });
};

// delete actor
const delActor = async (req, res) => {
  const { act_id } = req.params;
  const response = await db.query(
    `update actor set act_state=false 
  where act_id=$1;`,
    [act_id]
  );
  res.json({
    message: "Actor Deleted Successfully",
    body: {
      actor: { act_id },
    },
  });
};

// edit Actor
const editActor = async (req, res) => {
  const { act_name, act_country, act_id } = req.body;
  const response = await db.query(
    `update actor set act_name=$1, act_country=$2 
  where act_id=$3;`,
    [act_name, act_country, act_id]
  );
  res.json({
    message: "Actor Edited Successfully",
    body: {
      actor: { act_id, act_name, act_country },
    },
  });
};

// CRUD actors movies

// post actor_movie
const postActorMovie = async (req, res) => {
  const { mov_id, act_id, act_mov_actor_principal } = req.body;
  const response = await db.query(
    `INSERT INTO actor_movie(
      mov_id, act_id, act_mov_state, act_mov_actor_principal)
      VALUES ($1, $2, true, $3);`,
    [mov_id, act_id, act_mov_actor_principal]
  );
  res.json({
    message: "Actor Movie was created successfully",
    body: {
      actor_movie: { mov_id, act_id, act_mov_actor_principal },
    },
  });
};

// read actor_movie
const getActorMovie = async (req, res) => {
  const { mov_id } = req.params;
  const response = await db.any(
    `select am.*, a.act_name from actor_movie am inner join actor a using(act_id) 
    where act_mov_state=true and am.mov_id=$1 order by act_mov_id;`,
    [mov_id]
  );
  res.json(response);
};

// delete actor_movie
const delActorMovie = async (req, res) => {
  const { act_mov_id } = req.params;
  const response = await db.query(
    `update actor_movie set act_mov_state=false 
  where act_mov_id=$1;`,
    [act_mov_id]
  );
  res.json({
    message: "Actor de Movie Deleted Successfully",
    body: {
      actor: { act_mov_id },
    },
  });
};

// edit actor_movie
const editActorMovie = async (req, res) => {
  const { act_id, act_mov_actor_principal, act_mov_id } = req.body;
  const response = await db.query(
    `update actor_movie set act_id=$1, act_mov_actor_principal=$2 
  where act_mov_id=$3;`,
    [act_id, act_mov_actor_principal, act_mov_id]
  );
  res.json({
    message: "Actor Edited Successfully",
    body: {
      actor_movie: { act_mov_id, act_mov_actor_principal },
    },
  });
};

// UTILS
// actor por id
const getActorById = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const response = await db.any(`select * from actor where act_id=$1;`, [id]);
  res.json(response);
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
  for (const index in movies) {
    if (Object.hasOwnProperty.call(movies, index)) {
      let movie = movies[index];
      let actors = await db.any(
        `select a.* from actor a inner join actor_movie using(act_id)
        inner join movie using(mov_id) where a.act_state=true and mov_id=$1;`,
        [movie.mov_id]
      );
      movie.actors = actors;
      response.push(movie);
    }
  }
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
  getMovies,
  postMovie,
  delMovie,
  editMovie,
  getActores,
  postActores,
  getActorById,
  delActor,
  editActor,
  getActorMovie,
  postActorMovie,
  delActorMovie,
  editActorMovie,
  getActoresByMovie,
  getCountActByMovie,
  getMovieDetails,
  movie_schema,
};
