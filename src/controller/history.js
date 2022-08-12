import path from 'path';
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
      let data = { type: el.type, referenceNumber: el.referenceNumber, quantity: el.quantity };
      let client = clients.find(client => client.cuit === el.clientID);
      let newDate = new Date(el.timestamp).toLocaleDateString();

      let item = items.find(item => item.barCode === el.barCode );

      data = {...data, client: client.name, clientID: client.id,timestamp: newDate, item: item.name, itemID: item.id,id : el.id }
      historyList.push(data);
    })

    
    res.render(path.join(process.cwd(),'/views/history.ejs'),{ title: 'Historial' , user: req.user,historyList })
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

    res.render(path.join(process.cwd(),'/views/history-ingress.ejs'),{ title: 'Cargar un nuevo Ingreso' , user: req.user,clients,items })
  
  } catch (err) {
    let message = err || "Ocurrio un error";

    console.error(`Error ${err.status}: ${message}`); 
    res.send( `
    <h1>Ocurrio un error</h1>
    <p>Error ${err.status}: ${message}</p>
    ` );     
  }
}

historyController. getIngressById = async ( req , res ) => {
  try {
    let referenceNumber = req.params.id;

    let historyList = await historyDao.getAll();
    const productsList = await productsDao.getAll();
    const clientList = await clientsDao.getAll();

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
        await usersDao.addNotificationToAll(notification)
      }
    }
    res.redirect('/history')
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
    res.redirect('/history')

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

  res.render(path.join(process.cwd(),'/views/history-egress.ejs'),{ title: 'Cargar un nuevo Egreso' , user: req.user,clients,items })

}

historyController.getUpgradeParticularHistory = async ( req , res ) => {
  const historyID = req.params.id;
  let history = await historyDao.getByID(historyID);
  const clients = await clientsDao.getAll();
  let items = await productsDao.getAll();

  items = items.filter(el => el.barCode !== history.barCode);

  
  res.render(path.join(process.cwd(),'/views/history-particular-upgrade.ejs'),{ title: `Editar ${history.type}` , user: req.user,clients,items,history })
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
  let items = await productsDao.getAll();

  res.render(path.join(process.cwd(),'/views/history-upgrade.ejs'),{ title: `Editar ${historyList[0].type}` , user: req.user,clients,items,historyList })
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