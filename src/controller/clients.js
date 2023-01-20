import path from "path";
import Singleton from "../utils/Singleton.js";
import clientMapper from "../mapper/clientMapper.js";
import historyMapper from "../mapper/historyMapper.js";

const clientController = () => {};

const { daos } = Singleton.getInstance();
const { clientsDao , productsDao , historyDao } = daos;

clientController.getClients = async ( req , res ) => {
  try {

    let clients = await clientsDao.getAll();
    if( ! (clients instanceof Array) ) return res.send('<p>Clientes No es un Array</p>');
    if(!clients.length) return res.send('<p>No hay clientes cargados</p>');
    const clientsList = [];
    clients.forEach( client => clientsList.push( clientMapper.mapClientToClientDtoTable(client) ) ); 
    res.render(path.join(process.cwd(),'/views/clients.ejs'),{ title: 'Clientes y Proveedores' , user: req.user,clientsList })

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
    const client = await clientsDao.getByID(req.params.id);
    const historyList = await historyDao.getAll();
    const productList = await productsDao.getAll();
    const clientHistory = historyList.filter( el => el.clientID === client.cuit);

    const clientSelected = clientMapper.mapClientToClientDtoById(client);
    
    const clientHistoryList = [];
    clientHistory.forEach( el => {
        clientHistoryList.push( 
          historyMapper.mapHistoryToHistoryDtoTable(
            el,
            client,
            productList.find( item => item.barCode === el.barCode)
          )
        )
      }
    );

    res.render(
      path.join(process.cwd(),'/views/client.ejs'),
      { 
        title: `Detalle del ${client.type}: ${client.name}`,
        user: req.user,
        clientSelected,
        clientHistoryList })       
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
    
    const clientsList = [];
    clients.forEach( client => clientsList.push(clientMapper.mapClientToCLientDtoCreateForm(client))); 
   
    res.render(
      path.join(process.cwd(),'/views/client-create.ejs'),
      { title: 'Cargar un nuevo Cliente / Proveedor' ,
        user: req.user,
        clientsList 
      })
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
    await clientsDao.saveClient(data );

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
    let clients = await clientsDao.getAll();
    clients = clients.filter( el => el.id !== clientID);
    const clientsList = [];
    clients.forEach( client => clientsList.push(clientMapper.mapClientToCLientDtoCreateForm(client))); 
    res.render(
      path.join(process.cwd(),'/views/client-upgrade.ejs'),
      { title: `Editando al ${clientSelected.type} ${clientSelected.name}`,
       user: req.user,
       clientsList,
       clientSelected 
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

clientController.putUpgradeClient = async ( req , res ) => {
  let data = req.body;
  data.responsable = req.user.email;
  let updated = await clientsDao.saveClient( data );
  if(!updated) throw new Error(`Hubo un error al editar al client ${data.type}`);

  res.redirect('/clients')
}



export default clientController;