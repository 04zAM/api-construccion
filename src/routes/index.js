const { Router } = require("express");
const router = Router();

const {
  getHome,
  getListaByTable,
  getProductosStock,
  getProductosActivos,
  putStockProductoC,
  putStockProductoV,
  getProductosActivosById,
  catalogoProductos,
} = require("../controllers/index");

//General
router
  .get("/", catalogoProductos)
  .get("/listar/:name", getListaByTable)
  .get("/api/ventas", getProductosStock)
  .put("/api/ventas/v", putStockProductoV)
  .get("/api/compras", getProductosActivos)
  .put("/api/compras/c", putStockProductoC)
  .get("/api/compras/p/:codigo", getProductosActivosById)
  .get("/productos", catalogoProductos);

module.exports = router;
