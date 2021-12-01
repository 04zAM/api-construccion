//Midlewares
const { Router } = require("express"),
  router = Router(),
  multer = require("multer"),
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./src/public/images");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
  upload = multer({ storage }),
  uploadImage = upload.single("imagen");

// Controllers
const {
  getProductoByCodigo,
  getProductosByName,
  createProductos,
  saveProductos,
  postProductos,
  readProductos,
  getProductos,
  editProductos,
  updateProductos,
  putProductos,
  desacProductos,
  deleteProductos,
} = require("../controllers/productos");

// Utilities
router
  .get("/productos/get/c/:codigo", getProductoByCodigo)
  .get("/productos/get/n/:name", getProductosByName);

// Products
router
  .get("/productos/create", createProductos)
  .post("/productos/save", uploadImage, saveProductos)
  .get("/productos/read", readProductos)
  .get("/productos/edit/:codigo", editProductos)
  .post("/productos/update", upload.single("imagen"), updateProductos)
  .get("/productos/desactivar/:codigo", desacProductos);

// RESTful
router
  .get("/productos/get", getProductos)
  .post("/productos/post", postProductos)
  .put("/productos/put", putProductos)
  .put("/productos/delete", deleteProductos);

module.exports = router;
