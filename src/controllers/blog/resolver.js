const { db } = require("../../cnn");

module.exports = resolvers = {
  Query: {
    async getPublicaciones(root) {
      try {
        const sql = await db.any(`select * from publicacion order by pub_id`);
        console.table(sql);
        return sql;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async getComentarios(root) {
      try {
        const sql = await db.any(`select * from comentario order by com_id`);
        console.table(sql);
        return sql;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async getAutorPubs(root) {
      try {
        const autores = await db.any(`select * from autor order by aut_id`);
        autores.forEach((autor) => {
          const subsql = db.any(`select * from publicacion where aut_id=$1`, [
            autor.aut_id,
          ]);
          autor.publicaciones = subsql;
        });
        console.table(autores);
        return autores;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async getPublicacionComs(root) {
      try {
        const publicaciones = await db.any(
          `select * from publicacion order by pub_id`
        );
        publicaciones.forEach((publicacion) => {
          const subsql = db.any(`select * from comentario where pub_id=$1`, [
            publicacion.pub_id,
          ]);
          publicacion.comentarios = subsql;
        });
        console.table(publicaciones);
        return publicaciones;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async getPublicacionNumComs(root) {
      try {
        const publicaciones = await db.any(
          `select * from publicacion order by pub_id`
        );
        publicaciones.forEach((publicacion) => {
          const subsql = db.one(
            `select count(*) from comentario where pub_id=$1`,
            [publicacion.pub_id]
          );
          publicacion.num_comentarios = subsql;
        });
        console.table(publicaciones);
        return publicaciones;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async getPublicacionComLs(root, { id }) {
      try {
        if (id == undefined) {
          return null;
        } else {
          const publicacion = await db.one(
            `select * from publicacion where pub_id=$1`,
            [id]
          );
          const comentarios = await db.any(
            `select * from comentario where pub_id=$1`,
            [publicacion.pub_id]
          );
          publicacion.comentarios = comentarios;
          comentarios.forEach((comentario) => {
            const subsql = db.one(
              `select count(*) from reaccion where com_id=$1 and rea_like=true`,
              [comentario.com_id]
            );
            comentario.num_likes = subsql;
          });
          console.log(publicacion);
          return publicacion;
        }
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async getCategoriaPub(root) {
      try {
        const categorias = await db.any(
          `select * from categoria order by cat_id`
        );
        for (const key in categorias) {
          if (Object.hasOwnProperty.call(categorias, key)) {
            const categoria = categorias[key];
            const publicaciones = await db.any(
              `select * from publicacion where cat_id=$1`,
              [categoria.cat_id]
            );
            categoria.publicaciones = publicaciones;
            for (const key in publicaciones) {
              if (Object.hasOwnProperty.call(publicaciones, key)) {
                const publicacion = publicaciones[key];
                const comentarios = await db.any(
                  `select * from comentario where pub_id=$1`,
                  [publicacion.pub_id]
                );
                publicacion.comentarios = comentarios;
                for (const key in comentarios) {
                  if (Object.hasOwnProperty.call(comentarios, key)) {
                    const comentario = comentarios[key];
                    const num_likes = await db.one(
                      `select count(*) from reaccion where com_id=$1 and rea_like=true`,
                      [comentario.com_id]
                    );
                    comentario.num_likes = num_likes;
                  }
                }
                const num_autores = await db.one(
                  `select count(distinct aut_id) from comentario where pub_id=$1`,
                  [publicacion.pub_id]
                );
                publicacion.num_autores = num_autores;
              }
            }
          }
        }
        console.log(categorias);
        return categorias;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async getAutorResumen(root) {
      try {
        const autores = await db.any(`select * from autor order by aut_id`);
        for (const key in autores) {
          if (Object.hasOwnProperty.call(autores, key)) {
            const autor = autores[key];
            const num_publicaciones = await db.one(
              `select count(*) from publicacion where aut_id=$1`,
              [autor.aut_id]
            );
            autor.num_publicaciones = num_publicaciones;
            const categorias = await db.any(
              `select distinct(cat_id), c.* from publicacion p inner join categoria c using (cat_id)
              where p.aut_id=$1`,
              [autor.aut_id]
            );
            autor.categorias = categorias;
            const num_likes = await db.one(
              `select count(*) from comentario com inner join reaccion rea using (com_id) 
              where rea.rea_like=true and com.aut_id=$1`,
              [autor.aut_id]
            );
            autor.num_likes = num_likes;
          }
        }
        console.table(autores);
        return autores;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
  },
  Mutation: {
    async setComentarioPub(root, { actor }) {
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
    async updateComentarioPub(root, { actor_movie }) {
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
    async deleteComentarioPub(root, { act_id, mov_id }) {
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
