import express from "express";
import productController from "../../controller/products.js";

const productRoute = express.Router();

productRoute
  .get('/', productController.getProducts )
  .post('/', productController.createProduct )

export default productRoute;