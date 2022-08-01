import ClientDaoFile from "./clients/clientDaoFS.js";
import HistoryDaoFile from "./history/historyDaoFS.js";
import ProductDaoFile from "./products/productDaoFS.js";
import UserDaoFile from "./users/userDaoFile.js";

import ClientDaoMongo from "./clients/clientDaoMongo.js";
import HistoryDaoMongo from "./history/historyDaoMongo.js";
import ProductDaoMongo from "./products/productDaoMongo.js";
import UserDaoMongo from "./users/userDaoMongo.js";

class PersistenceFactory {
  constructor(pers){
    this.daos = {}
    this.getPersistenceMethod(pers)
  }
  async getPersistenceMethod(pers) {
    if(pers){
      if( pers === 'fs' ){
        this.daos['productsDao'] = new ProductDaoFile;
        this.daos['historyDao'] = new HistoryDaoFile;
        this.daos['clientsDao'] = new ClientDaoFile;
        this.daos['usersDao'] = new UserDaoFile;

        console.log('Se conecto a FileSystem');
      }
      if(pers === 'mongodb'){
        this.daos['clientsDao'] = new ClientDaoMongo;
        this.daos['historyDao'] = new HistoryDaoMongo;
        this.daos['productsDao'] = new ProductDaoMongo;
        this.daos['usersDao'] = new UserDaoMongo;

        console.log('Se conecto a Mongo');
      }
    } else if (!pers){
      // this.daos['productsDao'] = new ProductDaoMemory;
      // this.daos['cartsDao'] = new CartDaoMemory;
      // this.daos['usersDao'] = new UserDaoMemory;
      // this.daos['ticketsDao'] = new TicketsDaoMemory;    
      // this.daos['chatsDao'] = new ChatDaoMemory;    
      console.log('Ocurrio un error');

    }
  }
}

export default PersistenceFactory;