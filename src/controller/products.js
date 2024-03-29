import path from "path";
import historyMapper from "../mapper/historyMapper.js";
import productMapper from "../mapper/productMapper.js";
import Singleton from "../utils/Singleton.js";

const productController = () => {};
const { daos } = Singleton.getInstance();
const { clientsDao , productsDao , historyDao , notificationsDao , usersDao } = daos;

  productController.getProducts = async ( req , res ) => {
    try {
      const products = await productsDao.getAll();
      const productList = [];
      products.forEach( p => productList.push( productMapper.mapProductToPoductDtoTable(p) ) );
      res.render(
        path.join(process.cwd(),'/views/products.ejs'),
        {
          title: 'Productos',
          user: req.user,
          productList
        }
      );
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
      res.send( `
      <h1>Ocurrio un error</h1>
      <p>Error ${err.status}: ${message}</p>
      ` );
    }
  }

  productController.getProductByID = async ( req, res ) => {
    try {
      let productID = req.params.id;

      const product = await productsDao.getByID(productID);
      const historyList = await historyDao.getAll();
      const clientList = await clientsDao.getAll();

      const productHistory = historyList.filter(el => el.barCode === product.barCode);
      
      const historyProductList = [];
      productHistory.forEach( h => historyProductList.push( historyMapper.mapHistoryToHistoryDtoTable( h, clientList.find( c => c.cuit === h.clientID ), product ) ) );
      
      res.render(
        path.join(process.cwd(),'/views/product.ejs'),
        { 
          title: `Detalle del Producto ${product.name}`,
          user: req.user,
          product,
          historyProductList
        }
      );       
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
      res.send( `
      <h1>Ocurrio un error</h1>
      <p>Error ${err.status}: ${message}</p>
      ` )
    }
  }

  productController.getCreateProduct = async ( req , res ) => {
    try {
      const products = await productsDao.getAll();
      
      const productList = [];
      products.forEach( p => productList.push( productMapper.mapProductToProductDtoCreateForm(p) ) );
      
      res.render(
        path.join(process.cwd(),'/views/product-create.ejs'),
        {
          title: 'Cargar un nuevo Producto',
          user: req.user,
          productList
        }
      );
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
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
      const created = await productsDao.saveProduct(data);
      if(!created)throw new Error('Hubo un error al crear el producto');

      let notification = {
        responsable: created.responsable,
        receiver: 'all',
        message: `Ha editado el producto: ${created.name}`
      }
      notification = await notificationsDao.newNotification(notification);
      await usersDao.addNotificationToAll(notification);
      
      res.redirect('/products');
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
      res.send( `
      <h1>Ocurrio un error</h1>
      <p>Error ${err.status}: ${message}</p>
      ` )
    }
  } 

  productController.getUpgradeProduct = async ( req , res )=> {
    let productID = req.params.id;
    const prod = await productsDao.getByID(productID);
    const prodList = await productsDao.getAll();
    prodList = prodList.filter( el => el.id !== productID );

    const product = productMapper.mapProductToProductDtoUpdateForm(prod);
    const productsList = [];
    prodList.forEach( p => productsList.push( productMapper.mapProductToPoductDtoTable(p) ) );
    
    res.render(
      path.join(process.cwd(),'/views/product-upgrade.ejs'),
      {
        title: `Editando el producto ${product.name}`,
        user: req.user,
        productsList,
        product
      }
    );

  }

  productController.upgradeProduct = async (req , res ) => {
    let data = req.body;
    data.responsable = req.user.email;
    let updated = await productsDao.saveProduct(data)
    let notification = {
      responsable: updated.responsable,
      receiver: 'all',
      message: `Ha editado el producto: ${updated.name}`
    }
    notification = await notificationsDao.newNotification(notification);
    await usersDao.addNotificationToAll(notification);
    

    if(!updated) throw new Error('Hubo un error al editar el producto');

    res.redirect('/products')
  }

  export default productController;