import PersistenceFactory from "../daos/index.js";
import getPersistence from './getPersistence.js';

class Singleton {
  constructor () {
    throw new Error ('use Singleton.getInstance()')
  }
  static getInstance(){
    if(!Singleton.instance ){
      Singleton.instance = new PersistenceFactory(getPersistence())
    }
    return Singleton.instance;
  }
}

export default Singleton;