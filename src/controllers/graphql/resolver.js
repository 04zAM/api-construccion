const { db } = require("../index");

const movieResolver = {
  Query: {
    async actors(root, { name }) {
      if (name == undefined) {
        return await db.any("select * from actor order by act_id desc");
      } else {
        return await db.any(`select * from actor where act_name=$1`, [name]);
      }
    },
    async movies(root, { title }) {
      if (title == undefined) {
        return await db.any("select * from movie order by mov_id desc");
      } else {
        return await db.any(`select * from movie where mov_title=$1`, [title]);
      }
    },
  },
  movie: {
    async actors(movie) {
      return await db.any(
        `SELECT a.* FROM actor a INNER JOIN actor_movie am USING(act_id) 
        WHERE am.mov_id=$1`,
        [movie.mov_id]
      );
    },
  },
  Mutation: {
    async createActor(root, { actor }) {
      if (actor == undefined) {
        return null;
      } else {
        const actor_sql = await db.one(
          `INSERT INTO actor(act_name, act_origin, act_state)
          VALUES($1,$2,true) returning *;`,
          [actor.act_name, actor.act_origin]
        );
        return actor_sql;
      }
    },
    async createMovie(root, { movie }) {
      if (movie == undefined) {
        return null;
      } else {
        const movie_sql = await db.one(
          `INSERT INTO movie(mov_title, mov_produce, mov_state)
          VALUES($1,$2,true) returning *;`,
          [movie.mov_title, movie.mov_produce]
        );
        if (movie.actors && movie.actors.length !== 0) {
          movie.actors.forEach((actor) => {
            db.one(
              `INSERT INTO actor_movie (mov_id, act_id)
            VALUES($1, $2)`,
              [movie_sql.mov_id, actor]
            );
          });
        }
        return movie_sql;
      }
    },
    async updateMovie(root, { movie }) {
      if (movie == undefined) {
        return null;
      } else {
        const movie_sql = await db.one(
          `UPDATE movie SET mov_title=$1, mov_produce=$2 where mov_id=$3 returning *;`,
          [movie.mov_title, movie.mov_produce, movie.mov_id]
        );
        if (movie.actors && movie.actors.length !== 0) {
          movie.actors.forEach((actor) => {
            db.one(`UPDATE actor_movie SET actor_id=$1 where mov_id=$2;`, [
              actor,
              movie_sql.mov_id,
            ]);
          });
        }
        return movie_sql;
      }
    },
    async deleteMovie(root, { movie }) {
      if (movie == undefined) {
        return null;
      } else {
        return await db.one(
          `UPDATE movie SET mov_state=false where mov_id=$1 returning *;`,
          [movie.mov_id]
        );
      }
    },
  },
};

module.exports = movieResolver;
