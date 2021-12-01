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

//Actualizar Stock compra
const getActorById = async (req, res) => {
  const { codigo, cantidad } = req.body;
  const response = await db.query(
    `update detalles_bodega set stock=stock+$2 
  where producto_id=$1;`,
    [codigo, cantidad]
  );
  res.json({
    message: "Producto sumado exitosamente",
    body: {
      producto: { codigo, cantidad },
    },
  });
};

//Actualizar Stock venta
const deleteActor = async (req, res) => {
  const { codigo, cantidad } = req.body;
  const response = await db.query(
    `update detalles_bodega set stock=stock-$2 
  where producto_id=$1;`,
    [codigo, cantidad]
  );
  res.json({
    message: "Producto restado exitosamente",
    body: {
      producto: { codigo, cantidad },
    },
  });
};

// productos activos con o sin stock
const getActoresByMovie = async (req, res) => {
  const codigo = req.params.codigo;
  const response = await db.any(
    `select * from productos where estado=true and producto_id=$1;`,
    [codigo]
  );
  res.json(response);
};

//Catalogo
// const catalogoProductos = async (req, res) => {
//   const response = await db.any(
//     `select nombre as articulo, precio_venta as pvp, case when stock is null then 0 else stock end 
//       from productos left join detalles_bodega using (producto_id) order by producto_id desc limit 12;`
//   );
//   res.render("./pages/productos/", { response: response });
// };
const getCountActByMovie = async (req, res) => {
  const response = await db.any(
    `select nombre as articulo, precio_venta as pvp, imagen, stock 
      from productos inner join detalles_bodega using (producto_id) order by producto_id desc;`
  );
  res.render("./pages/productos/", { response: response });
};

module.exports = {
  getHome,
  getListaByTable,
  getActores,
  postActores,
  getActorById,
  deleteActor,
  getActoresByMovie,
  getCountActByMovie,
};
