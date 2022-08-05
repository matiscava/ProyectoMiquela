import path from "path";
import Singleton from "../utils/Singleton.js";

const clientController = () => {};

const { daos } = Singleton.getInstance();
const { clientsDao , productsDao , historyDao } = daos;

clientController.getClients = async ( req , res ) => {
  try {

    let clients = await clientsDao.getAll();
    if( ! (clients instanceof Array) ) return res.send('<p>Clientes No es un Array</p>');
    if(!clients.length) return res.send('<p>No hay clientes cargados</p>');

    res.render(path.join(process.cwd(),'/views/clients.ejs'),{ title: 'Clientes y Proveedores' , user: req.user,clients })

  } catch (err) {
    let message = err || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.send( `
    <h1>Ocurrio un error</h1>
    <p>Error ${err.status}: ${message}</p>
    ` )
  }
}
clientController.getClientByID = async (req , res) => {
  try {
    let clientID = req.params.id;
    const client = await clientsDao.getByID(clientID);
    const historyList = await historyDao.getAll();
    const productList = await productsDao.getAll();
    const clientHistory = historyList.filter( el => el.clientID === client.cuit);
    clientHistory.forEach( el => {
      el.item = productList.find( item => item.barCode === el.barCode).name;
      el.itemID = productList.find( item => item.barCode === el.barCode).id;
      el.client = client.name;
      el.clientID = client.id;
      el.timestamp = new Date(el.timestamp).toLocaleDateString();
    });
    res.render(path.join(process.cwd(),'/views/client.ejs'),{ title: `Detalle del ${client.type}: ${client.name}` , user: req.user, clientSelected: client, clientHistory })       
  } catch (err) {
      let message = err || "Ocurrio un error";
  
      console.error(`Error ${err.status}: ${message}`); 
      res.send( `
      <h1>Ocurrio un error</h1>
      <p>Error ${err.status}: ${message}</p>
      ` );     
    }
}

clientController.getCreateClient = async ( req , res ) => {
  try {
    let clients = await clientsDao.getAll();
    res.render(path.join(process.cwd(),'/views/client-create.ejs'),{ title: 'Cargar un nuevo Cliente / Proveedor' , user: req.user,clients })
  } catch (err) {
    let message = err || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
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
    const newClient = await clientsDao.saveClient(data );

    res.redirect('/clients')
  } catch (err) {
    let message = err || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.send( `
    <h1>Ocurrio un error</h1>
    <p>Error ${err.status}: ${message}</p>
    ` )
  }
}

clientController.getUpgradeClient = async ( req , res ) => {
  try {
    const clientID = req.params.id;
    const clientSelected = await clientsDao.getByID(clientID);
    let clientsList = await clientsDao.getAll();
    clientsList = clientsList.filter( el => el.id !== clientID)
    res.render(path.join(process.cwd(),'/views/client-upgrade.ejs'),{ title: `Editando al ${clientSelected.type} ${clientSelected.name}` , user: req.user,clientsList,clientSelected });
  } catch (err) {
    let message = err || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.send( `
    <h1>Ocurrio un error</h1>
    <p>Error ${err.status}: ${message}</p>
    ` )
  }
}

clientController.putUpgradeClient = async ( req , res ) => {
  let data = req.body;
  data.responsable = req.user.email;
  let updated = await clientsDao.saveClient( data );
  if(!updated) throw new Error(`Hubo un error al editar al client ${data.type}`);

  res.redirect('/clients')
}



export default clientController;