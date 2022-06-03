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
    let users = await FSDao.getAll(USERS_DB);
    let items = await FSDao.getAll(PRODUCTS_DB);

    let historyList = [];
    history.forEach( el => {
      let data = { type: el.type, referenceNumber: el.referenceNumber };
      let client = clients.find(client => client.cuit === el.clientID).name;
      let newDate = new Date(el.date * 1000).toLocaleDateString();
      let item = items.find(item => item.varCode === el.varCode ).name;
      el.type == 'Egreso' ? data.quantity = el.quantity*-1 : data.quantity = el.quantity;

      data = {...data, client,date: newDate, item,id : el.id }

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

historyController.postIngress = async (req , res) => {
  try {
    let userSession = (req.session && req.session.userSession) || 'Anonimo';
    const data = req.body;
    
    data.cuit = data.cuit.split('-').join('');
    let cuitRepeated = await FSDao.getBy(CLIENTS_DB,'cuit',data);
    if(!cuitRepeated) throw new Error(`No hay un proveedor con el CUIT: ${data.cuit}. Si es un cliente nuevo debe cargar primero el cliente, sino revise los datos.`);
    data.responsable = userSession;
    data.type = 'Ingreso';

    FSDao.createIngress(HISTORY_DB , PRODUCTS_DB , data);
          
    res.send('Se ha cargado el remito N°: '+data.referenceNumber)
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
    let userSession = (req.session && req.session.userSession) || 'Anonimo';
    const data = req.body;
    
    data.cuit = data.cuit.split('-').join('');
    let cuitRepeated = await FSDao.getBy(CLIENTS_DB,'cuit',data);
    if(!cuitRepeated) throw new Error(`No hay un proveedor con el CUIT: ${data.cuit}. Si es un cliente nuevo debe cargar primero el cliente, sino revise los datos.`);
    data.responsable = userSession;
    data.type = 'Egreso';

    FSDao.createIngress(HISTORY_DB , PRODUCTS_DB , data);
    
    res.send('Se ha cargado la orden de fabricación')

  } catch (err) {
    let message = err || "Ocurrio un error";

    console.log(`Error ${err.status}: ${message}`); 
    res.send( `
    <h1>Ocurrio un error</h1>
    <p>Error ${err.status}: ${message}</p>
    ` );    
  }
}

  export default historyController;