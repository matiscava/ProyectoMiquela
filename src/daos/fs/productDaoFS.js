import fs from 'fs';
import { createHash , isValidPassword} from '../../utils/hash.js';
import crypto from 'crypto';

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
    }else if( by === 'varCode' ) {
      data = list.find( el => el.varCode === element.varCode )
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

FSDao.createProduct = async ( DB , element ) => {
  try {
    let list = await FSDao.getAll(DB);
    if(!element.id) element.id = crypto.randomBytes(10).toString('hex');
    element.stock = 0;
    list.push(element);
    const dataToJSON = JSON.stringify(list,null,2);
    fs.writeFileSync( DB , dataToJSON);
    return element;
  } catch (err) {
    let message = err || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
  }
}

FSDao.createClient = async ( DB , element ) => {
  try {
    let clients = await FSDao.getAll(DB);
    //sacamos los '-' si tiene
    element.cuit = element.cuit.split('-').join('');
    
    let cuitRepeated = await FSDao.getBy(DB, 'cuit', element);
    if(cuitRepeated) throw new Error(`El Proveedor con el CUIT: ${element.cuit} ya existe, por favor ingrese un otro CUIT o corrobore la informacíon.`);

    if( ! (element instanceof Object) ) throw new Error('El dato enviado no es un objeto');
    if(!element.id) element.id = crypto.randomBytes(10).toString('hex');

    
    clients.push(element);
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
    let prodExists = await FSDao.getBy(DB,'varCode',element),
      prodList = await FSDao.getAll(DB);

    if(!prodExists) throw new Error(`El producto ${element.varCode} no existe en nuestro inventario. Debe cargarlo primero antes de continuar.`);
    prodExists.stock += element.quantity;
    let prodIndex = prodList.findIndex(el => el.varCode == element.varCode);
    prodList.splice(prodIndex,1,prodExists);
    let dataToJSON = JSON.stringify(prodList,null,2);
    fs.writeFileSync( DB , dataToJSON);

    return prodExists;
    
  } catch (err) {
    let message = err || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
  }
}

FSDao.createIngress = async (DB, productsDB , element) => {
  try {
    const history = await FSDao.getAll(DB);

    if(!element.products.length) throw new Error(`No ha cargado ningun producto en este ingreso.`);
    const date = new Date().toLocaleString();
    for(let i=0 ; i < element.products.length ; i++){
      let prod = element.products[i]
      if(element.type === 'Egreso') Math.sign(prod.quantity);
      let prodExists = await FSDao.setProductStock(productsDB, prod );
      let historyData = {
        referenceNumber: element.referenceNumber,
        quantity: prod.quantity,
        type: element.type,
        responsable: element.userSession,
        date,
        name: prodExists.name,
        id: crypto.randomBytes(10).toString('hex'),
        varCode: prodExists.varCode,
        clientID: element.cuit
      }
      history.push(historyData);
    }

    let dataToJSON = JSON.stringify(history,null,2);
    fs.writeFileSync( DB , dataToJSON);
  } catch (err) {
    let message = err || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
  }
}

export default FSDao;