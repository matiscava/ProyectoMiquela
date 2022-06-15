import express from "express";
import productController from "../../controller/products.js";

const productRoute = express.Router();

productRoute
  .get('/', productController.getProducts )
  .get('/product-:id', productController.getProductByID )
  .get('/create-product', productController.getCreateProduct )
  .post('/create-product', productController.createProduct )
  .get('/upgrade/:id', productController.getUpgradeProduct )
  .put('/upgrade', productController.upgradeProduct )

export default productRoute;