import fs from 'fs';
import { createHash , isValidPassword} from '../../utils/hash.js';
import crypto from 'crypto';
import { doesNotMatch } from 'assert';

const FSDao = () => {};

FSDao.getAll = async (DB) => {
  try {
    let data = await fs.promises.readFile(DB,'utf-8')
    if(!data) return fs.writeFileSync(DB,'[]');
    let products = JSON.parse(data);
    return products;
  } catch (err) {
    let message = err || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.send( `
    <h1>Ocurrio un error</h1>
    <p>Error ${err.status}: ${message}</p>
    ` );
  }
}

FSDao.getBy = async (DB, by , element) => {
  try {
    let list = await FSDao.getAll(DB);
    let data;
    if( by === 'dni' ){
      data = list.find( el => el.dni === element.dni )
    }else if( by === 'email' ){
      data = list.find( el => el.email === element.email )
    }else if( by === 'barCode' ) {
      data = list.find( el => el.barCode === element.barCode )
    }else if( by === 'cuit' ) {
      data = list.find( el => el.cuit === element.cuit )
    }else if( by === 'id' ) {
      data = list.find( el => el.id === element.id )
    }
    return data;
  } catch (err) {
    let message = err || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
  }
}

FSDao.findUser = async (DB , email) => {
  try {
    let list = await FSDao.getAll(DB);
    let user = list.find( el => el.email === email);
    return user
  } catch (err) {
    let message = err || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
  }
}

FSDao.getByID = async (DB, id) => {
  try {
    let list = await FSDao.getAll(DB);
    let user = list.find( el => el.id === id);
    return user
  } catch (err) {
    let message = err || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
  }
}

FSDao.createUser = async (DB, element) => {
  try {
    let users = await FSDao.getAll(DB);

    let dniRepeated = await FSDao.getBy(DB,'dni',element)
    if( dniRepeated ) throw new Error(`El Usuario con el DNI: ${element.dni} ya existe, por favor ingrese un otro DNI.`);

    let emailRepeated = await FSDao.getBy(DB,'email',element)
    if( emailRepeated ) throw new Error(`El Usuario con el mail: ${element.email} ya existe, por favor ingrese un otro mail.`);

    if( ! (element instanceof Object) ) throw new Error('El dato enviado no es un objeto');
    if(!element.id) element.id = crypto.randomBytes(10).toString('hex');

    const {salt , hash } = createHash(element.password);
    element.salt = salt;
    element.hash = hash;
    delete element.password;

    users.push(element);
    const dataToJSON = JSON.stringify(users,null,2);
    fs.writeFileSync(DB,dataToJSON);
    return element;
  } catch (err) {
    let message = err || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
  }
}

FSDao.logUser = async ( DB , element ) => {
  try {
    let user = await FSDao.getBy(DB,'email',element)
    
    if( !user || user.length === 0 ) throw new Error(`El Usuario con el mail: ${element.email} no existe, intente nuevamente.`);
    if( !isValidPassword( element.password, user.hash, user.salt) ) throw new Error(`la contraseña es Incorrecta, intente nuevamente.`);

    return user;
  } catch (err) {

  }
}

FSDao.saveProduct = async ( DB , element ) => {
  try {
    let list = await FSDao.getAll(DB);
    element.timestamp = new Date().getTime();
    element.minStock = parseInt(element.minStock);
    if(!element.id) {
      element.id = crypto.randomBytes(10).toString('hex');
      element.stock = 0;
      list.push(element);
    }else {
      let prodIndex = list.findIndex(el => el.barCode == element.barCode);
      delete element.barCodeScan;
      list.splice(prodIndex,1,element);
    }
    const dataToJSON = JSON.stringify(list,null,2);
    fs.writeFileSync( DB , dataToJSON);
    return true;
  } catch (err) {
    let message = err || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
  }
}

FSDao.saveClient = async ( DB , element ) => {
  try {
    if( ! (element instanceof Object) ) throw new Error('El dato enviado no es un objeto');
    let clients = await FSDao.getAll(DB);
    element.timestamp = new Date().getTime();
    if( !element.id){
      element.id = crypto.randomBytes(10).toString('hex');
      clients.push(element);
    }else{
      let clientIndex = clients.findIndex(el => el.id === element.id);
      clients.splice( clientIndex, 1, element );
    }
    
    const dataToJSON = JSON.stringify(clients,null,2);
    fs.writeFileSync( DB , dataToJSON);

    return element;
    
  } catch (err) {
    let message = err || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
  }
}

FSDao.setProductStock = async (DB,element) => {
  try {
    let prodExists = await FSDao.getBy(DB,'barCode',element),
      prodList = await FSDao.getAll(DB);

    const date = new Date().getTime();

    if(!prodExists) throw new Error(`El producto ${element.barCode} no existe en nuestro inventario. Debe cargarlo primero antes de continuar.`);
    prodExists.stock += element.quantity;
    prodExists.timestamp = date;
    let prodIndex = prodList.findIndex(el => el.barCode == element.barCode);
    prodList.splice(prodIndex,1,prodExists);
    let dataToJSON = JSON.stringify(prodList,null,2);
    fs.writeFileSync( DB , dataToJSON);

    return prodExists;
    
  } catch (err) {
    let message = err || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
  }
}

FSDao.saveHistory = async (DB, productsDB , element) => {
  try {
    const history = await FSDao.getAll(DB);
    const date = new Date().getTime();
    let historyExist = history.find( el => el.id === element.id)
    if(historyExist){
      let historyIndex = history.findIndex( elIndex => elIndex.id === element.id);
      element.quantity = parseInt(element.quantity);
      element.timestamp = date;
      console.log('saveHistory', element);
      let quantity = element.quantity;
      let quantityDiference = quantity - historyExist.quantity ;
      if(element.type === 'Egreso') {
        quantityDiference = historyExist.quantity - quantity;
      }
      history.splice( historyIndex , 1 , element );
      let historySetStock = {
        quantity: quantityDiference,
        barCode: element.barCode,
      }
      console.log('saveHistory', historySetStock);
      let refreshStock =  await FSDao.setProductStock(productsDB, historySetStock );
      if(!refreshStock) throw new Error(`Hubo un error al actualizar el stock del producto: ${element.barCode} - ${element.name}` )
    }else{
      if(!element.products.length) throw new Error(`No ha cargado ningun producto en este ingreso.`);
      for(let i=0 ; i < element.products.length ; i++){
        let prod = element.products[i]
        prod.quantity = parseInt(prod.quantity);
        let quantity = prod.quantity;
        if(element.type === 'Egreso') prod.quantity = prod.quantity * -1;

        let prodExists = await FSDao.setProductStock(productsDB, prod );
        
        let historyData = {
          referenceNumber: element.referenceNumber,
          quantity,
          type: element.type,
          responsable: element.responsable,
          timestamp: date,
          name: prodExists.name,
          id: crypto.randomBytes(10).toString('hex'),
          barCode: prodExists.barCode,
          clientID: element.clientID
        }
        history.push(historyData);
      }
    }
    

    let dataToJSON = JSON.stringify(history,null,2);
    fs.writeFileSync( DB , dataToJSON);
  } catch (err) {
    let message = err || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
  }
}

export default FSDao;