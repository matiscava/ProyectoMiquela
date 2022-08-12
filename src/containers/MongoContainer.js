import mongoose from 'mongoose';
import options from '../config/config.js';
import dotenv from 'dotenv';
import mongodb from 'mongodb';
import { asPOJO , renameField , removeField } from '../utils/objectsUtils.js'
import { createHash , isValidPassword } from '../utils/hash.js';

const ObjectId = mongodb.ObjectId;


export default class MongoContainer {
  constructor (collection, schema) {
    this.collection = mongoose.model( collection , schema );
    this.init();
  }

  async init() {
    try {
      if(!this.conexion) {
        this.conexion = await mongoose.connect(options.mongodb.cnxStr, options.mongodb.options);
      }
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async getAll() {
    try {
      let documents = await this.collection.find({},{__v:0}).lean();
      documents = documents.map(asPOJO);
      documents = documents.map( doc => renameField(doc, '_id' , 'id'));
      
      return documents;

    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async getBy ( by , element) {
    try {
      let data;
      if( by === 'dni' ){
        data = await this.collection.find( {'dni': element.dni},{__v:0} )
      }else if( by === 'email' ){
        data = await this.collection.find( {'email': element.email},{__v:0} )
      }else if( by === 'barCode' ) {
        data = await this.collection.find( {'barCode': element.barCode},{__v:0} )
      }else if( by === 'cuit' ) {
        data = await this.collection.find( {'cuit': element.cuit},{__v:0} )
      }else if( by === 'id' ) {
        const objID = new ObjectId(element.id);
        data = await this.collection.find( {'_id': objID },{__v:0} )
      }
      if (data.length === 0) {
        return null;
      } else {
        const result = renameField(asPOJO(data[0]), '_id', 'id')  
        return result;
      }
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async findUser (email) {
    try {
      let user = await this.collection.find( {'email': email},{__v:0} )
      if (user.length === 0) {
        return null;
      } else {
        const result = renameField(asPOJO(user[0]), '_id', 'id')  
        return result;
      }
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async getByID ( id ) {
    try {
      const objID = new ObjectId(id);
      let data = await this.collection.find( {'_id': objID },{__v:0} )
      if (data.length === 0) {
        return null;
      } else {
        const result = renameField(asPOJO(data[0]), '_id', 'id')  
        return result;
      }
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async createUser ( element ) {
    try {  
      let dniRepeated = await this.getBy('dni',element)
      if( dniRepeated ) throw new Error(`El Usuario con el DNI: ${element.dni} ya existe, por favor ingrese un otro DNI.`);
  
      let emailRepeated = await this.getBy('email',element)
      if( emailRepeated ) throw new Error(`El Usuario con el mail: ${element.email} ya existe, por favor ingrese un otro mail.`);
  
      if( ! (element instanceof Object) ) throw new Error('El dato enviado no es un objeto');

      const {salt , hash } = createHash(element.password);
      element.salt = salt;
      element.hash = hash;
      delete element.password;

      const document = await new this.collection(element);
      const response = await document.save();

      return response;     
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
  async saveProduct (element) {
    try {
      element.timestamp = new Date().getTime();
      element.minStock = parseInt(element.minStock);
      if(!element.id) {
        element.stock = 0;
        const document = new this.collection(element);
        const response = await document.save();
        let result = asPOJO(response);
        result.id = result._id;
        delete result._id;  
        delete result.__v;  
        
        return result;
      }else {
        delete element.barCodeScan;
        element.stock = parseInt(element.stock)
        const { n, nModified } = await this.collection.updateOne({ _id: element.id }, {
          $set: element
        })
        if (n == 0 || nModified == 0) throw new Error(`Elemento con el id: '${id}' no fue encontrado`);
        return element;
      }
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async saveClient (element) {
    try {
      if( ! (element instanceof Object) ) throw new Error('El dato enviado no es un objeto');
      element.timestamp = new Date().getTime();

      if( !element.id){
        const document = new this.collection(element);
        const response = await document.save()
        return response;
      }else{
        const { n, nModified } = await this.collection.updateOne({ _id: element.id }, {
          $set: element
        })
        if (n == 0 || nModified == 0) throw new Error(`Elemento con el id: '${id}' no fue encontrado`);
      }
      return element;
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async setProductStock ( element ) {
    try {
      let prodExists = await this.collection.find( {'barCode': element.barCode },{__v:0} );
      prodExists = prodExists[0];
      const date = new Date().getTime();
  
      if(!prodExists) throw new Error(`El producto ${element.barCode} no existe en nuestro inventario. Debe cargarlo primero antes de continuar.`);
      prodExists.stock += element.quantity;

      prodExists.timestamp = date;
      const { n, nModified } = await this.collection.updateOne({ _id: prodExists.id }, {
        $set: prodExists
      })
      if (n == 0 || nModified == 0) throw new Error(`Elemento con el id: '${prodExists.id}' no fue encontrado`);
  
      return prodExists;
      
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async saveHistory ( element ) {
    try {
      const date = new Date().getTime();
      let historyExist = await this.getByID(element.id)
      let historySetStock = [];
      if(historyExist){
          element.quantity = parseInt(element.quantity);
          element.timestamp = date;
          const { n, nModified } = await this.collection.updateOne({ _id: element.id }, {
            $set: element
          })
          if (n == 0 || nModified == 0) throw new Error(`Elemento con el id: '${element.id}' no fue encontrado`);
          let quantityDiference = element.quantity - historyExist.quantity ;
          if(element.type === 'Egreso') {
            quantityDiference = historyExist.quantity - element.quantity;
          } 
          historySetStock.push({quantity: quantityDiference,barCode:element.barCode,name: element.name});
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
            barCode: prod.barCode,
            clientID: element.clientID
          }
          const document = new this.collection(historyData);
          const response = await document.save()
        }
      }
      return historySetStock;
      
  
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async newNotification ( element ) {
    try {
      element.timestamp = new Date().getTime();
      const document = new this.collection(element);
      const response = await document.save();
      let result = asPOJO(response);
      result.id = result._id;
      delete result._id;  
      delete result.__v;  
      return result;
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async addNotificationToAll ( data ) {
    try{
      let users = await this.getAll();
      data.viewed = false;

      for( let i = 0 ; i < users.length ; i ++) {
        let user = users[i];
        user.notifications.push(data);
        const { n, nModified } = await this.collection.updateOne({ _id: user.id }, {
          $set: user
        })
        if (n == 0 || nModified == 0) throw new Error(`Elemento con el id: '${user.id}' no fue encontrado`);

      }

      return true;
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async addNotificationTo ( userId , data ) {
    try{
      let user = await this.getByID(userId)
      data.viewed = false;
      user.notifications.push(data);
      const { n, nModified } = await this.collection.updateOne({ _id: userId }, {
        $set: user
      })
      if (n == 0 || nModified == 0) throw new Error(`Elemento con el id: '${userId}' no fue encontrado`);
      
      return true;
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }
  async seeNotification(data) {
    try{
      let user = await this.getBy('email',data[0]);
      data.forEach(el => {        
        let notification = user.notifications.find( noti => noti.id === el.notiId );
        let notificationIndex = user.notifications.findIndex( noti => noti.id === el.notiId )
        
        notification.viewed = true;
        user.notifications.splice( notificationIndex,1,notification);
      });


      const { n, nModified } = await this.collection.updateOne({ _id: user.id }, {
        $set: user
      })
      if (n == 0 || nModified == 0) throw new Error(`Elemento con el id: '${user.id}' no fue encontrado`);
      
      return true;

    }catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

}
