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
// productos activos con stock
const getProductosStock = async (req, res) => {
  const response = await db.any(
    `select * from productos inner join detalles_bodega where stock>0 and estado=true;`
  );
  res.json(response);
};

// productos activos con o sin stock
const getProductosActivos = async (req, res) => {
  const response = await db.any(
    `select * from productos where estado=true;`
  );
  res.json(response);
};

//Actualizar Stock compra
const putStockProductoC = async (req, res) => {
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
const putStockProductoV = async (req, res) => {
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
const getProductosActivosById = async (req, res) => {
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
const catalogoProductos = async (req, res) => {
  const response = await db.any(
    `select nombre as articulo, precio_venta as pvp, imagen, stock 
      from productos inner join detalles_bodega using (producto_id) order by producto_id desc;`
  );
  res.render("./pages/productos/", { response: response });
};

module.exports = {
  getHome,
  getListaByTable,
  getProductosStock,
  getProductosActivos,
  putStockProductoC,
  putStockProductoV,
  getProductosActivosById,
  catalogoProductos,
};
