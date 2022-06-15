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

  productController.getProductByID = async ( req, res ) => {
    try {
      let productID = req.params.id;
      const product = await FSDao.getByID(PRODUCTS_DB,productID);
      const historyList = await FSDao.getAll(HISTORY_DB);
      const clientList = await FSDao.getAll(CLIENTS_DB);
      const productHistory = historyList.filter(el => el.barCode === product.barCode);
      productHistory.forEach( el => {
        el.itemID = productID;
        el.item = product.name;
        el.client = clientList.find( client => client.cuit === el.clientID).name;
        el.clientID = clientList.find( client => client.cuit === el.clientID).id;
        el.timestamp = new Date(el.timestamp).toLocaleDateString();
      });
      res.render(path.join(process.cwd(),'/views/product.ejs'),{ title: `Detalle del Producto ${product.name}` , user: req.user, product, productHistory })       
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
    try {
      let products = await FSDao.getAll(PRODUCTS_DB);
      res.render(path.join(process.cwd(),'/views/product-create.ejs'),{ title: 'Cargar un nuevo Producto' , user: req.user,products });
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
      data.responsable = req.user.email;
      if( ! (data instanceof Object) ) throw new Error('El dato enviado no es un objeto');
      const created = await FSDao.saveProduct(PRODUCTS_DB,data);
      if(!created)throw new Error('Hubo un error al crear el producto');
      res.redirect('/products')
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.log(`Error ${err.status}: ${message}`);
      res.send( `
      <h1>Ocurrio un error</h1>
      <p>Error ${err.status}: ${message}</p>
      ` )
    }
  } 

  productController.getUpgradeProduct = async ( req , res )=> {
    let productID = req.params.id;
    const product = await FSDao.getByID(PRODUCTS_DB, productID);
    let productsList = await FSDao.getAll(PRODUCTS_DB);
    productsList = productsList.filter( el => el.id !== productID );

    res.render(path.join(process.cwd(),'/views/product-upgrade.ejs'),{ title: `Editando el producto ${product.name}` , user: req.user,productsList,product });

  }

  productController.upgradeProduct = async (req , res ) => {
    let data = req.body;
    data.responsable = req.user.email;
    let updated = await FSDao.saveProduct(PRODUCTS_DB,data)
    if(!updated) throw new Error('Hubo un error al editar el producto');

    res.redirect('/products')
  }

  export default productController;