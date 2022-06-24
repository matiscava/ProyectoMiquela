import FSDao from "../daos/fs/productDaoFS.js";
import path from 'path';


const historyController = () => {},
  USERS_DB = './DB/users.json',
  CLIENTS_DB = './DB/clients.json',
  PRODUCTS_DB = './DB/products.json',
  HISTORY_DB = './DB/history.json';

historyController.getHistory = async (req , res) => {
  try {
    let history = await FSDao.getAll(HISTORY_DB);
    if(!(history instanceof Array)) return res.send('<p>Ingresos No es un Array</p>');
    if(!history.length) return res.send('<p>No hay ingresos cargados</p>');
    let clients = await FSDao.getAll(CLIENTS_DB);
    let items = await FSDao.getAll(PRODUCTS_DB);

    let historyList = [];
    history.forEach( el => {
      let data = { type: el.type, referenceNumber: el.referenceNumber };
      let client = clients.find(client => client.cuit === el.clientID);
      let newDate = new Date(el.timestamp).toLocaleDateString();

      let item = items.find(item => item.barCode === el.barCode );
      el.type == 'Egreso' ? data.quantity = el.quantity*-1 : data.quantity = el.quantity;

      data = {...data, client: client.name, clientID: client.id,timestamp: newDate, item: item.name, itemID: item.id,id : el.id }
      historyList.push(data);
    })

    
    res.render(path.join(process.cwd(),'/views/history.ejs'),{ title: 'Historial' , user: req.user,historyList })
    // res.json(history);
  } catch (err) {
    let message = err || "Ocurrio un error";

    console.log(`Error ${err.status}: ${message}`);
    res.send( `
    <h1>Ocurrio un error</h1>
    <p>Error ${err.status}: ${message}</p>
    ` );
  }
}

historyController.getIngress = async ( req , res ) => {
  try {

    let clients = await FSDao.getAll(CLIENTS_DB);
    let items = await FSDao.getAll(PRODUCTS_DB);

    res.render(path.join(process.cwd(),'/views/history-ingress.ejs'),{ title: 'Cargar un nuevo Ingreso' , user: req.user,clients,items })
  
  } catch (err) {
    let message = err || "Ocurrio un error";

    console.log(`Error ${err.status}: ${message}`); 
    res.send( `
    <h1>Ocurrio un error</h1>
    <p>Error ${err.status}: ${message}</p>
    ` );     
  }
}

historyController. getIngressById = async ( req , res ) => {
  try {
    let referenceNumber = req.params.id;
    let historyList = await FSDao.getAll(HISTORY_DB);
    const productsList = await FSDao.getAll(PRODUCTS_DB);
    const clientList = await FSDao.getAll(CLIENTS_DB);
    
    historyList = historyList.filter( el => el.referenceNumber === referenceNumber );
    historyList.forEach( el => {
      el.client = clientList.find( client => client.cuit === el.clientID).name;
      el.clientID = clientList.find( client => client.cuit === el.clientID).id;
      el.item = el.name;
      delete el.name;
      el.timestamp = new Date(el.timestamp).toLocaleDateString();
      el.itemID = productsList.find( prod => prod.barCode === el.barCode).id;
    })
    
    res.render(path.join(process.cwd(),'/views/history-particular.ejs'),{ title: `Edite el ${historyList[0].type} N°: ${referenceNumber}` , user: req.user , historyList });
 
  } catch (err) {
    let message = err || "Ocurrio un error";

    console.log(`Error ${err.status}: ${message}`); 
    res.send( `
    <h1>Ocurrio un error</h1>
    <p>Error ${err.status}: ${message}</p>
    ` );     
  }
}

historyController.postIngress = async (req , res) => {
  try {
    let user = req.user;
    const data = req.body;
    
    data.responsable = user.email;
    data.type = 'Ingreso';

    FSDao.saveHistory(HISTORY_DB , PRODUCTS_DB , data);
          
    res.redirect('/history')
    // res.json(data)  
  } catch (err) {
    let message = err || "Ocurrio un error";

    console.log(`Error ${err.status}: ${message}`); 
    res.send( `
    <h1>Ocurrio un error</h1>
    <p>Error ${err.status}: ${message}</p>
    ` );     
  }
}

historyController.postEgress = async (req , res) => {
  try {
    let user = req.user;
    const data = req.body;
    data.responsable = user.email;
    data.type = 'Egreso';

    FSDao.saveHistory(HISTORY_DB , PRODUCTS_DB , data);
    
    res.redirect('/history')

  } catch (err) {
    let message = err || "Ocurrio un error";

    console.log(`Error ${err.status}: ${message}`); 
    res.send( `
    <h1>Ocurrio un error</h1>
    <p>Error ${err.status}: ${message}</p>
    ` );    
  }
}

historyController.getEgress = async ( req , res ) => {
  let clients = await FSDao.getAll(CLIENTS_DB);
  let items = await FSDao.getAll(PRODUCTS_DB);

  res.render(path.join(process.cwd(),'/views/history-egress.ejs'),{ title: 'Cargar un nuevo Egreso' , user: req.user,clients,items })

}

historyController.getUpgradeParticularHistory = async ( req , res ) => {
  const historyID = req.params.id;
  let history = await FSDao.getByID(HISTORY_DB, historyID);
  const clients = await FSDao.getAll(CLIENTS_DB);
  let items = await FSDao.getAll(PRODUCTS_DB);
  items = items.filter(el => el.barCode !== history.barCode);

  
  res.render(path.join(process.cwd(),'/views/history-particular-upgrade.ejs'),{ title: `Editar ${history.type}` , user: req.user,clients,items,history })
}

historyController.upgradeParticularHistory = async ( req , res ) => {
  let data = req.body;
  data.responsable = req.user.email;
  delete data.barCodeScan
  delete data.client

  let updated = await FSDao.saveHistory(HISTORY_DB,PRODUCTS_DB,data);

  if (!updated) throw new Error(`Ocurrio un error al editar el ${data.type}`);

  res.redirect('/history')
}

historyController.getUpgradeHistory = async ( req , res ) => {
  const historyReferenceNumber = req.params.id;
  let historyList = await FSDao.getAll(HISTORY_DB);
  historyList = historyList.filter( hist => hist.referenceNumber === historyReferenceNumber );
  const clients = await FSDao.getAll(CLIENTS_DB);
  let items = await FSDao.getAll(PRODUCTS_DB);

  res.render(path.join(process.cwd(),'/views/history-upgrade.ejs'),{ title: `Editar ${historyList[0].type}` , user: req.user,clients,items,historyList })
}

historyController.upgradeHistory = async ( req , res ) => {
  let data = req.body;

  res.json(data)
}

export default historyController;