import fs from 'fs';
import { createHash , isValidPassword } from '../utils/hash.js';
import crypto from 'crypto';

export default class FileContainer {
  constructor ( file ) {
    this.file = `${process.cwd()}${file}`;
  }
  async getAll () {
    try {
      let data = await fs.promises.readFile(this.file,'utf-8')
      if(!data) return fs.writeFileSync(`${this.file}`,'[]');
      let list = JSON.parse(data);
      return list;
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async getBy ( by , element) {
    try {
      let list = await this.getAll();
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
  
  async findUser ( email ) {
    try {
      let list = await this.getAll();
      let user = list.find( el => el.email === email);
      return user;
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async getByID ( id ) {
    try {
      let list = await this.getAll();
      let element = list.find( el => el.id === id);
      return element;
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }
  async createUser ( element ) {
    try {
      let users = await this.getAll();
  
      let dniRepeated = await this.getBy('dni',element)
      if( dniRepeated ) throw new Error(`El Usuario con el DNI: ${element.dni} ya existe, por favor ingrese un otro DNI.`);
  
      let emailRepeated = await this.getBy('email',element)
      if( emailRepeated ) throw new Error(`El Usuario con el mail: ${element.email} ya existe, por favor ingrese un otro mail.`);
  
      if( ! (element instanceof Object) ) throw new Error('El dato enviado no es un objeto');
      if(!element.id) element.id = crypto.randomBytes(10).toString('hex');
  
      const {salt , hash } = createHash(element.password);
      element.salt = salt;
      element.hash = hash;
      delete element.password;
  
      users.push(element);
      const dataToJSON = JSON.stringify(users,null,2);
      fs.writeFileSync(`${this.file}`,dataToJSON);
      return element;
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }
  async logUser (element) {
    try {
      let user = await this.getBy('email',element)
      
      if( !user || user.length === 0 ) throw new Error(`El Usuario con el mail: ${element.email} no existe, intente nuevamente.`);
      if( !isValidPassword( element.password, user.hash, user.salt) ) throw new Error(`la contraseña es Incorrecta, intente nuevamente.`);
  
      return user;
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async saveProduct ( element ) {
    try {
      let list = await this.getAll();
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
      fs.writeFileSync( `${this.file}` , dataToJSON);
      return element;
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async saveClient ( element ) {
    try {
      if( ! (element instanceof Object) ) throw new Error('El dato enviado no es un objeto');
      let clients = await this.getAll();
      element.timestamp = new Date().getTime();
      if( !element.id){
        element.id = crypto.randomBytes(10).toString('hex');
        clients.push(element);
      }else{
        let clientIndex = clients.findIndex(el => el.id === element.id);
        clients.splice( clientIndex, 1, element );
      }
      
      const dataToJSON = JSON.stringify(clients,null,2);
      fs.writeFileSync( `${this.file}` , dataToJSON);
  
      return element;
      
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async setProductStock ( element ) {
    try {
      let prodExists = await this.getBy('barCode',element),
        prodList = await this.getAll();
  
      const date = new Date().getTime();
  
      if(!prodExists) throw new Error(`El producto ${element.barCode} no existe en nuestro inventario. Debe cargarlo primero antes de continuar.`);
      prodExists.stock += element.quantity;
      prodExists.timestamp = date;
      let prodIndex = prodList.findIndex(el => el.barCode == element.barCode);
      prodList.splice(prodIndex,1,prodExists);
      let dataToJSON = JSON.stringify(prodList,null,2);
      fs.writeFileSync( `${this.file}` , dataToJSON);
  
      return prodExists;
      
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }
  
  async saveHistory ( element ) {
    try {
      const history = await this.getAll();
      const date = new Date().getTime();
      let historyExist = history.find( el => el.id === element.id);
      let historySetStock = [];
      if(historyExist){
        if (historyExist.length) {          
          for(let i=0 ; i < element.products.length ; i++){
            let prod = element.products[i];
            prod.quantity = parseInt(prod.quantity);
            let quantity = prod.quantity;
            let historyIndex = history.findIndex( elIndex => elIndex.id === prod.id);
            let quantityDiference = quantity - historyExist.quantity ;
            if(element.type === 'Egreso') {
              quantityDiference = historyExist.quantity - quantity;
            }  
            history.splice( historyIndex , 1 , prod );
            historySetStock.push({quantity: quantityDiference,barCode:prod.barCode,name: prod.name});
          }
        }else{
          let quantity = element.quantity;
          let quantityDiference = quantity - historyExist.quantity ;
          if(element.type === 'Egreso') {
            quantityDiference = historyExist.quantity - quantity;
          }
          historyExist.quantity = parseInt(quantity);
          historyExist.timestamp = date;
          
          let historyIndex = history.findIndex( elIndex => elIndex.id === historyExist.id);
          history.splice( historyIndex , 1 , historyExist );
          historySetStock.push({quantity: quantityDiference,barCode:element.barCode,name: element.name});
        }
        let dataToJSON = JSON.stringify(history,null,2);
        fs.writeFileSync( `${this.file}` , dataToJSON);
        return historySetStock;
      }else{
        if(!element.products.length) throw new Error(`No ha cargado ningun producto en este ingreso.`);
        
        for(let i=0 ; i < element.products.length ; i++){
          let prod = element.products[i]
          prod.quantity = parseInt(prod.quantity);
          let quantity = prod.quantity;
          if(element.type === 'Egreso') prod.quantity = prod.quantity * -1;
          historySetStock.push(prod);          
          let historyData = {
            referenceNumber: element.referenceNumber,
            quantity,
            type: element.type,
            responsable: element.responsable,
            timestamp: date,
            name: prod.name,
            id: crypto.randomBytes(10).toString('hex'),
            barCode: prod.barCode,
            clientID: element.clientID
          }
          history.push(historyData);
        }
      }
      
  
      let dataToJSON = JSON.stringify(history,null,2);
      fs.writeFileSync( `${this.file}` , dataToJSON);
      return historySetStock;
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async newNotification ( element ) {
    try {
      element.timestamp = new Date().getTime();
      let notifications = await this.getAll();
      console.log('new notifications',notifications);
      element.id = crypto.randomBytes(10).toString('hex'),
      notifications.push(element)
      let dataToJSON = JSON.stringify(notifications,null,2);
      fs.writeFileSync( `${this.file}` , dataToJSON);
      return element;
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async addNotificationToAll ( data ) {
    try {
      let users = await this.getAll();
      data.viewed = false;
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        user.notifications.push(data);
      }
      let dataToJSON = JSON.stringify(users,null,2);
      fs.writeFileSync( `${this.file}` , dataToJSON);
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }

  }
  async addNotificationTo ( userId , data ) {
    try {      
      let user = await this.getByID(userId);
      const users = await this.getAll();
      let userIndex = users.findIndex( userIndex => userIndex.id === user.id);
      
  
      data.viewed = false;
      user.notifications.push(data);
      users.splice(userIndex,1,user);
  
      let dataToJSON = JSON.stringify(users,null,2);
      fs.writeFileSync( `${this.file}` , dataToJSON);
  
      return true;
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async seeNotification(data) {
    try{
      let user = await this.getBy('email',data[0]);
      let users = await this.getAll();
      data.forEach(el => {        
        let notification = user.notifications.find( noti => noti.id === el.notiId );
        let notificationIndex = user.notifications.findIndex( noti => noti.id === el.notiId )
        
        notification.viewed = true;
        console.log('seeNotification',notification);
        user.notifications.splice( notificationIndex,1,notification);
      });

      let userIndex = users.findIndex( el => el.id === user.id );
      users.splice(userIndex,1,user);
      let dataToJSON = JSON.stringify(users,null,2);
      fs.writeFileSync( `${this.file}` , dataToJSON);

      return true;
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }

  }
  
}