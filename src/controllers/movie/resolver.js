const { db } = require("../../cnn");

const resolver = {
  Query: {
    async getActors(root, { act_id }) {
      try {
        if (act_id == undefined) {
          return await db.any(`select * from actor order by act_id`);
        } else {
          return await db.any(`select * from actor where act_id=$1`, [act_id]);
        }
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async getActorsByMovie(root, { mov_id }) {
      try {
        return await db.any(
          `SELECT a.* FROM actor a INNER JOIN actor_movie am USING(act_id) 
          WHERE am.act_mov_state=true and am.mov_id=$1`,
          [mov_id]
        );
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async getPrincipalActorsByMovie(root, { mov_id }) {
      try {
        return await db.one(
          `select count(*) from actor a inner join actor_movie using(act_id)
          inner join movie using(mov_id) where a.act_state=true 
          and act_mov_actor_principal=true and mov_id=$1;`,
          [mov_id]
        );
      } catch (error) {
        console.log(error);
        return null;
      }
    },
  },
  Mutation: {
    async setActor(root, { actor }) {
      try {
        return await db.one(
          `INSERT INTO actor(act_id, act_name, act_country, act_state)
          VALUES($1,$2,$3, true) returning *;`,
          [actor.act_id, actor.act_name, actor.act_country]
        );
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async setMovieActor(root, { actor_movie }) {
      try {
        return await db.one(
          `INSERT INTO actor_movie(act_mov_id, act_id, mov_id, act_mov_state, act_mov_actor_principal)
          VALUES ($1, $2, $3, true, $4) returning *;`,
          [
            actor_movie.act_mov_id,
            actor_movie.act_id,
            actor_movie.mov_id,
            actor_movie.principal,
          ]
        );
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async setStateMovieActor(root, { act_id, mov_id }) {
      try {
        await db.any(
          `UPDATE actor_movie SET act_mov_state=false where act_id=$1 and mov_id=$2 returning *;`,
          [act_id, mov_id]
        );
        return mov_id;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
  },
};

module.exports = { resolver };
