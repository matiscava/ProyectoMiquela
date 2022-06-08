import FSDao from "../daos/fs/productDaoFS.js";
import path from "path";

const clientController = () => {},
  USERS_DB = './DB/users.json',
  CLIENTS_DB = './DB/clients.json',
  PRODUCTS_DB = './DB/products.json',
  HISTORY_DB = './DB/history.json';

clientController.getClients = async ( req , res ) => {
  try {

    let clients = await FSDao.getAll(CLIENTS_DB)
    if( ! (clients instanceof Array) ) return res.send('<p>Clientes No es un Array</p>');
    if(!clients.length) return res.send('<p>No hay clientes cargados</p>');

    res.render(path.join(process.cwd(),'/views/clients.ejs'),{ title: 'Clientes y Proveedores' , user: req.user,clients })

  } catch (err) {
    let message = err || "Ocurrio un error";
    console.log(`Error ${err.status}: ${message}`);
    res.send( `
    <h1>Ocurrio un error</h1>
    <p>Error ${err.status}: ${message}</p>
    ` )
  }
}

clientController.getCreateClient = async ( req , res ) => {
  let clients = await FSDao.getAll(CLIENTS_DB);
  res.render(path.join(process.cwd(),'/views/client-new.ejs'),{ title: 'Cargar un nuevo Cliente / Proveedor' , user: req.user,clients })
}

clientController.createClient = async ( req , res ) => {
  try {
    const data = req.body;
    data.responsable = req.user.email;
    const newClient = await FSDao.createClient( CLIENTS_DB , data );

    res.send(`<h2>Se creo un nuevo ${newClient.type} ${newClient.name}, CUIT: ${newClient.cuit}</h2>`)
  } catch (err) {
    let message = err || "Ocurrio un error";
    console.log(`Error ${err.status}: ${message}`);
    res.send( `
    <h1>Ocurrio un error</h1>
    <p>Error ${err.status}: ${message}</p>
    ` )
  }
}


export default clientController;