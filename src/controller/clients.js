import FSDao from "../daos/fs/productDaoFS.js";

const clientController = () => {},
  USERS_DB = './DB/users.json',
  CLIENTS_DB = './DB/clients.json',
  PRODUCTS_DB = './DB/products.json',
  HISTORY_DB = './DB/history.json';

clientController.getClients = async ( req , res ) => {
  try {

    let clients = FSDao.getAll(CLIENTS_DB)
    if( ! (clients instanceof Array) ) return res.send('<p>Clientes No es un Array</p>');
    if(!clients.length) return res.send('<p>No hay clientes cargados</p>');

    res.json(clients);
  } catch (err) {
    let message = err || "Ocurrio un error";
    console.log(`Error ${err.status}: ${message}`);
    res.send( `
    <h1>Ocurrio un error</h1>
    <p>Error ${err.status}: ${message}</p>
    ` )
  }
}

clientController.createClient = async ( req , res ) => {
  try {
    const data = req.body;
    const newClient = await FSDao.createClient( CLIENTS_DB , data );

    res.json(newClient)
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