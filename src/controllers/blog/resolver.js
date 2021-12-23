const { db } = require("../../cnn");

module.exports = resolvers = {
  Query: {
    async getPublicaciones(root) {
      try {
        return await db.any(`select * from publicacion order by pub_id`);
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async getComentarios(root) {
      try {
        return await db.any(`select * from comentario order by com_id`);
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async getAutorPubs(root) {
      try {
        const autores = await db.any(`select * from autor order by aut_id`);
        autores.forEach((autor) => {
          autor.publicaciones = db.any(
            `select * from publicacion where aut_id=$1`,
            [autor.aut_id]
          );
        });
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
                comentario.autor = await db.one(
                  `select a.* from autor a inner join comentario c using(aut_id) where c.com_id=$1`,
                  [comentario.com_id]
                );
              }
            }
          }
        }
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
          publicacion.num_comentarios = db.one(
            `select count(*) from comentario where pub_id=$1`,
            [publicacion.pub_id]
          );
        });
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
                    comentario.num_likesnum_likes = await db.one(
                      `select count(*) from reaccion where com_id=$1 and rea_like=true`,
                      [comentario.com_id]
                    );
                  }
                }
                publicacion.num_autores = await db.one(
                  `select count(distinct aut_id) from comentario where pub_id=$1`,
                  [publicacion.pub_id]
                );
              }
            }
          }
        }
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
            autor.num_publicaciones = await db.one(
              `select count(*) from publicacion where aut_id=$1`,
              [autor.aut_id]
            );
            autor.categorias = await db.any(
              `select distinct(cat_id), c.* from publicacion p inner join categoria c using (cat_id)
              where p.aut_id=$1`,
              [autor.aut_id]
            );
            autor.num_likes = await db.one(
              `select count(*) from comentario com inner join reaccion rea using (com_id) 
              where rea.rea_like=true and com.aut_id=$1`,
              [autor.aut_id]
            );
          }
        }
        return autores;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
  },
  Mutation: {
    async setComentarioPub(root, { comentario }) {
      try {
        return await db.one(
          `INSERT INTO comentario(com_descripcion, com_estado, aut_id, pub_id)
          VALUES($1,true, $2, $3) returning *;`,
          [comentario.com_descripcion, comentario.aut_id, comentario.pub_id]
        );
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async updateComentarioPub(root, { parametros, comentario }) {
      try {
        return await db.one(
          `UPDATE comentario SET com_descripcion=$1 where com_id=$2 and pub_id=$3 returning *;`,
          [comentario, parametros.com_id, parametros.pub_id]
        );
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async deleteComentarioPub(root, { parametros }) {
      try {
        return await db.one(
          `UPDATE comentario SET com_estado=false where com_id=$1 and pub_id=$2 returning *;`,
          [parametros.com_id, parametros.pub_id]
        );
      } catch (error) {
        console.log(error);
        return null;
      }
    },
  },
};
