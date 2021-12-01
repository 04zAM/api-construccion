const { db } = require("../cnn");

//Utilidades
const getProductoByCodigo = async (req, res) => {
  const id = req.params.codigo;
  const response = await db.any(
    `select producto_id as codigo, nombre as producto, 
      precio_compra as costo, precio_venta as pvp, case when stock is null then 0 else stock end 
      from productos left join detalles_bodega using (producto_id) 
      where estado=true and producto_id=$1;`,
    [id]
  );
  res.json(response);
};

const getProductosByName = async (req, res) => {
  const name = req.params.name;
  const response = await db.any(
    `select producto_id as codigo, nombre as producto, 
      precio_compra as costo, precio_venta as pvp, case when stock is null then 0 else stock end 
      from productos left join detalles_bodega using (producto_id) 
      where estado=true and nombre ilike $1 limit 10;`,
    ["%" + name + "%"]
  );
  res.json(response);
};

//Create CRUD crea un producto ingresando todos sus parametros
const createProductos = (req, res) => {
  res.render("./pages/productos/create");
};

const saveProductos = async (req, res) => {
  const { nombre, costo, pvp } = req.body;
  const imagen = req.file.originalname;
  try {
    const response = await db.query(
      `insert into productos(nombre, precio_compra, precio_venta, imagen, estado) 
      values ($1, $2, $3, $4, true);`,
      [nombre, costo, pvp, imagen]
    );
    console.log(`Product save succesfully ${response}`);
    res.redirect("./read");
  } catch (err) {
    res.status(500).json({ error: `An error ocurred while inserting: ${err}` });
  }
};

const postProductos = async (req, res) => {
  const { nombre, costo, pvp } = req.body;
  const response = await db.query(
    `insert into productos(nombre, precio_compra, precio_venta, estado) 
    values ($1, $2, $3, true);`,
    [nombre, costo, pvp]
  );
  res.json({
    message: "Producto was created successfully",
    body: {
      producto: { nombre, costo, pvp },
    },
  });
};

//Read CRUD todos los productos activos
const readProductos = async (req, res) => {
  const response = await db.any(
    `select producto_id as codigo, nombre as nombre, 
      precio_compra as costo, precio_venta as pvp
      from productos where estado=true order by producto_id desc;`
  );
  res.render("./pages/productos/read", { response: response });
};

const getProductos = async (req, res) => {
  const response = await db.any(
    `select producto_id as codigo, nombre as nombre,
      precio_compra as costo, precio_venta as pvp
      from productos where estado=true;`
  );
  res.json(response);
};

//Uptade CRUD productos con todos sus parametros
const editProductos = async (req, res) => {
  const codigo = req.params.codigo;
  const response = await db.any(
    `select producto_id as codigo, nombre as nombre,
    precio_compra as costo, precio_venta as pvp, imagen
    from productos where producto_id=$1;`,
    [codigo]
  );
  res.render("./pages/productos/edit", { producto: response[0] });
};

const updateProductos = async (req, res) => {
  const { codigo, nombre, costo, pvp } = req.body;
  const imagen = req.file.originalname;
  try {
    const response = await db.query(
      `update productos set nombre=$2, precio_compra=$3, precio_venta=$4, imagen=$5 
    where producto_id=$1;`,
      [codigo, nombre, costo, pvp, imagen]
    );
    console.log(`Product update succesfully ${response}`);
    res.redirect("./read");
  } catch (err) {
    res.status(500).json({ error: `An error ocurred while updating: ${err}` });
  }
};

const putProductos = async (req, res) => {
  const { codigo, nombre, costo, pvp, imagen } = req.body;
  const response = await db.query(
    `update productos set nombre=$2, precio_compra=$3, precio_venta=$4 
  where producto_id=$1;`,
    [codigo, nombre, costo, pvp, imagen]
  );
  res.json({
    message: "Producto was updated successfully",
    body: {
      producto: { codigo, nombre, costo, pvp, imagen },
    },
  });
};

//Delete CRUD productos por su codigo
const desacProductos = async (req, res) => {
  const codigo = req.params.codigo;
  const response = await db.query(
    `update productos set estado=false where producto_id=$1;`,
    [codigo]
  );
  res.redirect("../read");
};

const deleteProductos = async (req, res) => {
  const { codigo } = req.body;
  const response = await db.query(
    `update productos set estado=false where producto_id=$1;`,
    [codigo]
  );
  res.json({
    message: "Producto was deleted successfully",
    body: {
      producto: { codigo },
    },
  });
};

module.exports = {
  getProductoByCodigo,
  getProductosByName,
  createProductos,
  readProductos,
  getProductos,
  saveProductos,
  postProductos,
  editProductos,
  updateProductos,
  putProductos,
  desacProductos,
  deleteProductos,
};
