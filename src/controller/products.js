import FSDao from "../daos/fs/productDaoFS.js";

const productController = () => {},
  USERS_DB = './DB/users.json',
  CLIENTS_DB = './DB/clients.json',
  PRODUCTS_DB = './DB/products.json',
  HISTORY_DB = './DB/history.json';

  productController.getProducts = async ( req , res ) => {
    try {
      let products = await FSDao.getAll(PRODUCTS_DB)
      res.json(products)
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.log(`Error ${err.status}: ${message}`);
      res.send( `
      <h1>Ocurrio un error</h1>
      <p>Error ${err.status}: ${message}</p>
      ` )
    }
  } 

  productController.createProduct = async ( req , res ) => {
    try {
      const data = req.body;
      if( ! (data instanceof Object) ) throw new Error('El dato enviado no es un objeto');
      const newProduct = await FSDao.createProduct(PRODUCTS_DB,data);
      res.json(newProduct)
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.log(`Error ${err.status}: ${message}`);
      res.send( `
      <h1>Ocurrio un error</h1>
      <p>Error ${err.status}: ${message}</p>
      ` )
    }
  } 

  export default productController;