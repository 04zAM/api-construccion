const { Router } = require("express");
const router = Router();

const {
  createInventario,
  postAjuste,
  saveInventario,
  readInventario,
  desacInventario,
} = require("../controllers/inventario");

//Invetarios
router
  .get("/inventarios/create", createInventario)
  .get("/inventarios/read", readInventario)
  .post("/inventarios/save", saveInventario)
  .get("/inventarios/desactivar/:id", desacInventario);
  
//RESTful
router.post("/inventario/post", postAjuste);

module.exports = router;
