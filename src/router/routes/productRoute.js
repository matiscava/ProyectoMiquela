import express from "express";
import productController from "../../controller/products.js";

const productRoute = express.Router();

productRoute
  .get('/', productController.getProducts )
  .get('/new-product', productController.getCreateProduct )
  .post('/new-product', productController.createProduct )

export default productRoute;