const { json } = require("body-parser");
const { db } = require("../cnn");

var now = new Date();

//llamamos al id max
const getId = async () => {
  const id_inventario = await db.query(
    `select case when max(inventario_id) isnull then 1 else max(inventario_id) + 1 end from inventario;`
  );
  res.json;
};

//llamamos al id max
const idKardex = async () => {
  const id_kardex = await db.query(
    `select case when max(kardex_id) isnull then 1 else max(kardex_id) + 1 end from kardex;`
  );
  return id_kardex;
};

//llamamos al stock del producto
const stockProducto = async (id) => {
  const codigo = id;
  const stock = await db.query(
    `select stock from detalles_bodega where producto_id=$1;`,
    [codigo]
  );
  return stock;
};

//Create CRUD crea un inventario ingresando todos sus parametros
const postAjuste = async (req, res) => {
  const { id, total_costo, total_venta, observacion, detalles } = req.body;
  // Maestro
  const response = await db.query(
    `INSERT INTO inventarios(
      usuario_id, comprobante, fecha_registro, total_costo, total_venta, observaciones, estado)
      VALUES ($1, $2, $3, $4, $5, $6, true);`,
    [1, id, now, total_costo, total_venta, observacion]
  );
  for (const key in detalles) {
    if (Object.hasOwnProperty.call(detalles, key)) {
      const detalle = detalles[key];
      for (const key in detalle) {
        if (Object.hasOwnProperty.call(detalle, key)) {
          const element = detalle[key];
          // Detalle
          const response = await db.query(
            `INSERT INTO detalles_inventario(
            inventario_id, producto_id, precio_costo, precio_venta, stock, conteo, ajuste, tipo)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
            [
              id,
              element["producto_id"],
              element["precio_costo"],
              element["precio_venta"],
              element["stock"],
              element["conteo"],
              element["ajuste"],
              element["tipo"],
            ]
          );
          let d = "";
          if (element["tipo"] === "sumar") {
            d = "INVS-";
          } else {
            d = "INVR-";
          }
          const responsek = await db.query(
            `INSERT INTO kardex(
          fecha_kardex, detalle, cantidad, valor_unitario, total, producto_id, stock, usuario_id, comprobante, tipo_ajuste, comentario, estado)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true);`,
            [
              now,
              d + id,
              element["cantidad"],
              element["costo"],
              element["pvp"],
              element["producto"],
              element["stock"],
              1,
              id,
              element["tipo"],
              "ninguno",
            ]
          );
        }
      }
    }
  }
  res.json({
    message: "Inventario was created successfully",
    body: {
      inventario: { id },
    },
  });
};

//Create CRUD inventario
const saveInventario = async (req, res) => {
  const { id, total_costo, total_venta, observacion, detalles } = req.body;
  // Maestro
  let count = Object.keys(detalles).length;
  if (count >= 1) {
    const response = await db.query(
      `INSERT INTO inventarios(
      usuario_id, comprobante, fecha_registro, total_costo, total_venta, observaciones, estado)
      VALUES ($1, $2, $3, $4, $5, $6, true);`,
      [1, id, now, total_costo, total_venta, observacion]
    );
    for (const key in detalles) {
      if (Object.hasOwnProperty.call(detalles, key)) {
        const detalle = detalles[key];
        for (const key in detalle) {
          if (Object.hasOwnProperty.call(detalle, key)) {
            const element = detalle[key];
            // Detalle
            const det_query = await db.query(
              `INSERT INTO detalles_inventario(
            inventario_id, producto_id, precio_costo, precio_venta, stock, conteo, ajuste, tipo)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
              [
                id,
                element["producto_id"],
                element["precio_costo"],
                element["precio_venta"],
                element["stock"],
                element["conteo"],
                element["ajuste"],
                element["tipo"],
              ]
            );
            
            // Bodega
            let stock;
            if (element["tipo"] === 1) {
              stock = element["conteo"];
            } else {
              stock = element["ajuste"];
            }
            var bod_query = await db.query(
              `SELECT producto_id FROM detalles_bodega WHERE producto_id = $1`,
              [element["producto_id"]]
            );
            if (bod_query.length > 0) {
              bod_query = await db.query(
                `UPDATE detalles_bodega SET stock=$2 WHERE producto_id=$1`,
                [element["producto_id"], stock]
              );
            } else {
              bod_query = await db.query(
                `INSERT INTO detalles_bodega(bodega_id, producto_id, stock)
                VALUES ($1, $2, $3);`,
                [1, element["producto_id"], stock]
              );
            }
          }
        }
      }
    }
    res.redirect("./read");
  }
};

//Delete CRUD iventario por su id
const desacInventario = async (req, res) => {
  const id = req.params.id;
  const response = await db.query(
    `update inventarios set estado=false where inventario_id=$1;`,
    [id]
  );
  res.redirect("../read");
};

//Rutas
const createInventario = async (req, res) => {
  const response = await db.query(
    `select case when max(inventario_id) isnull then 1 else max(inventario_id) + 1 end as id from inventarios;`
  );
  res.render("./pages/inventarios/create", { inventario: response[0] });
};

const readInventario = async (req, res) => {
  const response = await db.any(
    `select inventario_id, comprobante, to_char(fecha_registro, 'DD/MM/YYYY') as fecha_registro, 
    total_costo, total_venta 
     from inventarios where estado=true;`
  );
  res.render("./pages/inventarios/read", { response: response });
};

module.exports = {
  readInventario,
  createInventario,
  postAjuste,
  saveInventario,
  desacInventario,
};
