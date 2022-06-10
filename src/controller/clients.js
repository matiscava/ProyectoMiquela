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
clientController.getClientByID = async (req , res) => {
  try {
    let clientID = req.params.id;
    const client = await FSDao.getByID(CLIENTS_DB,clientID);
    const historyList = await FSDao.getAll(HISTORY_DB);
    const productList = await FSDao.getAll(PRODUCTS_DB);
    const clientHistory = historyList.filter( el => el.clientID === client.cuit);
    clientHistory.forEach( el => {
      el.item = productList.find( item => item.varCode === el.varCode).name;
      el.itemID = productList.find( item => item.varCode === el.varCode).id;
      el.client = client.name;
      el.clientID = client.id;
      el.timestamp = new Date(el.timestamp).toLocaleDateString();
    });
    res.render(path.join(process.cwd(),'/views/client.ejs'),{ title: `Detalle del ${client.type}: ${client.name}` , user: req.user, clientSelected: client, clientHistory })       


    // res.send(`<h2>Cliente ID: ${clientID}</h2>`)  
  } catch (err) {
      let message = err || "Ocurrio un error";
  
      console.log(`Error ${err.status}: ${message}`); 
      res.send( `
      <h1>Ocurrio un error</h1>
      <p>Error ${err.status}: ${message}</p>
      ` );     
    }
}

clientController.getCreateClient = async ( req , res ) => {
  try {
    let clients = await FSDao.getAll(CLIENTS_DB);
    res.render(path.join(process.cwd(),'/views/client-create.ejs'),{ title: 'Cargar un nuevo Cliente / Proveedor' , user: req.user,clients })
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
    data.responsable = req.user.email;
    const newClient = await FSDao.saveClient( CLIENTS_DB , data );

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

clientController.getUpgradeClient = async ( req , res ) => {
  try {
    const clientID = req.params.id;
    const clientSelected = await FSDao.getByID(CLIENTS_DB, clientID);
    let clientsList = await FSDao.getAll(CLIENTS_DB);
    clientsList = clientsList.filter( el => el.id !== clientID)
    res.render(path.join(process.cwd(),'/views/client-upgrade.ejs'),{ title: `Editando al ${clientSelected.type} ${clientSelected.name}` , user: req.user,clientsList,clientSelected });
  } catch (err) {
    let message = err || "Ocurrio un error";
    console.log(`Error ${err.status}: ${message}`);
    res.send( `
    <h1>Ocurrio un error</h1>
    <p>Error ${err.status}: ${message}</p>
    ` )
  }
}

clientController.putUpgradeClient = async ( req , res ) => {
  let data = req.body;
  data.responsable = req.user.email;
  let updated = await FSDao.saveClient( CLIENTS_DB , data );
  if(!updated) throw new Error(`Hubo un error al editar al client ${data.type}`);

  res.redirect('/clients')
}



export default clientController;