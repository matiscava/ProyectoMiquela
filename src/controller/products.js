import FSDao from "../daos/fs/productDaoFS.js";
import path from "path";

const productController = () => {},
  USERS_DB = './DB/users.json',
  CLIENTS_DB = './DB/clients.json',
  PRODUCTS_DB = './DB/products.json',
  HISTORY_DB = './DB/history.json';

  productController.getProducts = async ( req , res ) => {
    try {
      let products = await FSDao.getAll(PRODUCTS_DB)
      res.render(path.join(process.cwd(),'/views/products.ejs'),{ title: 'Productos' , user: req.user, products })

    } catch (err) {
      let message = err || "Ocurrio un error";
      console.log(`Error ${err.status}: ${message}`);
      res.send( `
      <h1>Ocurrio un error</h1>
      <p>Error ${err.status}: ${message}</p>
      ` )
    }
  }

  productController.getCreateProduct = async ( req , res ) => {
    let products = await FSDao.getAll(PRODUCTS_DB);
    res.render(path.join(process.cwd(),'/views/product-new.ejs'),{ title: 'Cargar un nuevo Producto' , user: req.user,products })
  }

  productController.createProduct = async ( req , res ) => {
    try {
      const data = req.body;
      delete data.varCodeDos;
      data.responsable = req.user.email;
      if( ! (data instanceof Object) ) throw new Error('El dato enviado no es un objeto');
      const newProduct = await FSDao.createProduct(PRODUCTS_DB,data);
      res.json(data)
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