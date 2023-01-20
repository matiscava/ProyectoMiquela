import path from 'path';
import clientMapper from '../mapper/clientMapper.js';
import historyMapper from '../mapper/historyMapper.js';
import itemMapper from '../mapper/itemMapper.js';
import Singleton from "../utils/Singleton.js";


const historyController = () => {};

const { daos } = Singleton.getInstance();
const { clientsDao , productsDao , historyDao , notificationsDao , usersDao} = daos;

historyController.getHistory = async (req , res) => {
  try {
    let history = await historyDao.getAll();

    if(!(history instanceof Array)) return res.send('<p>Ingresos No es un Array</p>');
    if(!history.length) return res.send('<p>No hay ingresos cargados</p>');

    let clients = await clientsDao.getAll();
    let items = await productsDao.getAll();

    let historyList = [];
    history.forEach( el => {
      let client = clients.find(client => client.cuit === el.clientID);
      let item = items.find(item => item.barCode === el.barCode );
      historyList.push(historyMapper.mapHistoryToHistoryDtoTable(el,client,item)); 
    });

    
    res.render(path.join(process.cwd(),'/views/history.ejs'),{ title: 'Historial' , user: req.user,historyList });
  } catch (err) {
    let message = err || "Ocurrio un error";

    console.error(`Error ${err.status}: ${message}`);
    res.send( `
    <h1>Ocurrio un error</h1>
    <p>Error ${err.status}: ${message}</p>
    ` );
  }
}

historyController.getIngress = async ( req , res ) => {
  try {
    let clients = await clientsDao.getAll();
    let items = await productsDao.getAll();

    const itemList = [];
    items.forEach( i => itemList.push( itemMapper.mapItemToItemDtoHistoryIngress(i) ) );
    const clientList = [];
    clients.forEach( c => clientList.push( clientMapper.mapClientToClientSelect(c) ) );
    
    res.render(
      path.join(process.cwd(),'/views/history-ingress.ejs'),
      { 
        title: 'Cargar un nuevo Ingreso' ,
        user: req.user,
        clientList,
        itemList 
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

historyController.getIngressById = async ( req , res ) => {
  try {
    let referenceNumber = req.params.id;

    let historyList = await historyDao.getAll();
    const productsList = await productsDao.getAll();
    const clientList = await clientsDao.getAll();

    historyList = historyList.filter( el => el.referenceNumber === referenceNumber );
    
    const historyDtoList = [];
    historyList.forEach( el => {
      historyDtoList.push(
        historyMapper.mapHistoryToHistoryDtoTable(
          el,
          clientList.find( client => client.cuit === el.clientID),
          productsList.find( prod => prod.barCode === el.barCode)
        )
      );
    });
    
    res.render(
      path.join(process.cwd(),'/views/history-particular.ejs'),
      { title: `Edite el ${historyList[0].type} N°: ${referenceNumber}`,
       user: req.user,
       historyDtoList
      });
 
  } catch (err) {
    let message = err || "Ocurrio un error";

    console.error(`Error ${err.status}: ${message}`); 
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

    let updated = await historyDao.saveHistory( data);
    let notification = {
      responsable: data.responsable,
      receiver: 'all',
      message: `Ha cargado el ${data.type} N° ${data.referenceNumber}`
    }
    notification = await notificationsDao.newNotification(notification);

    for(let i = 0 ; i < updated.length ; i++){
      let product = await productsDao.setProductStock(updated[i]);
      if(product.minStock > product.stock){
        let notification = {
          responsable: req.user.email,
          receiver: 'all',
          type: 'warn',
          message: `el stock del producto ${product.name} está por debajo del minimo`
        }
        notification = await notificationsDao.newNotification(notification);
        await usersDao.addNotificationToAll(notification);
      }
    }
    res.redirect('/history');
  } catch (err) {
    let message = err || "Ocurrio un error";

    console.error(`Error ${err.status}: ${message}`); 
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

    let updated = await historyDao.saveHistory(data);
    let notification = {
      responsable: data.responsable,
      receiver: 'all',
      message: `Ha cargado el ${data.type} N° ${data.referenceNumber}`
    }
    notification = await notificationsDao.newNotification(notification);

    for(let i = 0 ; i < updated.length ; i++){
      let product = await productsDao.setProductStock(updated[i]);
      if(product.minStock > product.stock){
        let notification = {
          responsable: req.user.email,
          receiver: 'all',
          type: 'warn',
          message: `el stock del producto ${product.name} está por debajo del minimo`
        }
        notification = await notificationsDao.newNotification(notification);
        await usersDao.addNotificationToAll(notification)
      }
    }
    res.redirect('/history');

  } catch (err) {
    let message = err || "Ocurrio un error";

    console.error(`Error ${err.status}: ${message}`); 
    res.send( `
    <h1>Ocurrio un error</h1>
    <p>Error ${err.status}: ${message}</p>
    ` );    
  }
}

historyController.getEgress = async ( req , res ) => {
  let clients = await clientsDao.getAll();
  let items = await productsDao.getAll();
  const clientList = [];
  clients.forEach(c => clientList.push( clientMapper.mapClientToClientSelect(c) ) );
  const itemList = [];
  items.forEach( i => itemList.push( itemMapper.mapItemToItemDtoHistoryEgress(i) ) );
  
  res.render(
    path.join(process.cwd(),'/views/history-egress.ejs'),
    { 
      title: 'Cargar un nuevo Egreso',
      user: req.user,
      clientList,
      itemList
    }
  );
}

historyController.getUpgradeParticularHistory = async ( req , res ) => {
  const historyID = req.params.id;
  let history = await historyDao.getByID(historyID);
  const clients = await clientsDao.getAll();
  let items = await productsDao.getAll();
  
  items = items.filter(el => el.barCode !== history.barCode);

  const clientList = [];
  clients.forEach( c =>
    {
      if(history.type ==='Ingreso' && c.type === "proveedor" || history.type ==='Egreso' && c.type === "cliente" ){
        clientList.push( clientMapper.mapClientToClientSelect(c) ) 
      }     
    }
  );
    
  const itemList = [];
  items.forEach( i => itemList.push( itemMapper.mapItemToItemDtoBarCode(i) ) );
  
  res.render(
    path.join(process.cwd(),'/views/history-particular-upgrade.ejs'),
    {
      title: `Editar ${history.type}`,
      user: req.user,
      clientList,
      itemList,
      history
    }
  )
}

historyController.upgradeParticularHistory = async ( req , res ) => {
  let data = req.body;
  data.responsable = req.user.email;
  delete data.barCodeScan
  delete data.client

  let updated = await historyDao.saveHistory(data);
  let notification = {
    responsable: data.responsable,
    receiver: 'all',
    message: `Ha editado el ${data.type} N° ${data.referenceNumber}`
  }
  notification = await notificationsDao.newNotification(notification);
  await usersDao.addNotificationToAll(notification)
  for(let i = 0 ; i < updated.length ; i++){
    let product = await productsDao.setProductStock(updated[i]);
    if(product.minStock > product.stock){
      let notification = {
        responsable: req.user.email,
        receiver: 'all',
        type: 'warn',
        message: `el stock del producto ${product.name} está por debajo del minimo`
      }
      notification = await notificationsDao.newNotification(notification);
      await usersDao.addNotificationToAll(notification)
    }

  }


  if (!updated) throw new Error(`Ocurrio un error al editar el ${data.type}`);

  res.redirect('/history')
}

historyController.getUpgradeHistory = async ( req , res ) => {
  const historyReferenceNumber = req.params.id;
  let historyList = await historyDao.getAll();

  historyList = historyList.filter( hist => hist.referenceNumber === historyReferenceNumber );
  const clients = await clientsDao.getAll();
  const items = await productsDao.getAll();

  const clientList = [];
  clients.forEach( c => clientList.push( clientMapper.mapClientToClientSelect(c) ) );
  const itemList = [];
  items.forEach( i => itemList.push( itemMapper.mapItemToItemDtoHistoryEgress(i) ) )
  const historyDtoList = [];
  historyList.forEach( h=> historyDtoList.push( historyMapper.mapHistoryToHistotyDtoUpdate(h) ) );
  
  res.render(
    path.join(process.cwd(),'/views/history-upgrade.ejs'),
    { 
      title: `Editar ${historyList[0].type}`,
      user: req.user,
      clientList,
      itemList,
      historyDtoList
    }
  )
}

historyController.upgradeHistory = async ( req , res ) => {
  let data = req.body;

  for (let i = 0; i < data.products.length; i++) {
    const element = data.products[i];
    element.referenceNumber = data.referenceNumber;
    element.type = data.type;
    element.responsable = req.user.email;
    element.clientID = data.clientID;
    let updated = await historyDao.saveHistory(element);
    let notification = {
      responsable: data.responsable,
      receiver: 'all',
      message: `Ha editado el ${data.type} N° ${data.referenceNumber}`
    }
    notification = await notificationsDao.newNotification(notification);

    for(let i = 0 ; i < updated.length ; i++){
      let product = await productsDao.setProductStock(updated[i]);
      if(product.minStock > product.stock){
        let notification = {
          responsable: req.user.email,
          receiver: 'all',
          type: 'warn',
          message: `el stock del producto ${product.name} está por debajo del minimo`
        }
        notification = await notificationsDao.newNotification(notification);
        await usersDao.addNotificationToAll(notification)
      }
    }
    
  }
  
  res.redirect('/history')
}

export default historyController;