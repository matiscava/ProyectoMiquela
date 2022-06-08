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
      let client = clients.find(client => client.cuit === el.clientID).name;
      let newDate = new Date(el.date).toLocaleDateString();

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

historyController.getIngress = async ( req , res ) => {
  let clients = await FSDao.getAll(CLIENTS_DB);
  let items = await FSDao.getAll(PRODUCTS_DB);

  res.render(path.join(process.cwd(),'/views/history-ingress.ejs'),{ title: 'Cargar un nuevo Ingreso' , user: req.user,clients,items })

}

historyController.postIngress = async (req , res) => {
  try {
    let user = req.user;
    const data = req.body;
    
    data.responsable = user.email;
    data.type = 'Ingreso';

    FSDao.createIngress(HISTORY_DB , PRODUCTS_DB , data);
          
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


    FSDao.createIngress(HISTORY_DB , PRODUCTS_DB , data);
    
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

historyController.getEgress = async ( req , res ) => {
  let clients = await FSDao.getAll(CLIENTS_DB);
  let items = await FSDao.getAll(PRODUCTS_DB);

  res.render(path.join(process.cwd(),'/views/history-egress.ejs'),{ title: 'Cargar un nuevo Egreso' , user: req.user,clients,items })

}

  export default historyController;