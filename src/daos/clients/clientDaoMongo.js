import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import MongoContainer from '../../containers/MongoContainer.js';


class ClientDaoMongo extends MongoContainer {
  constructor() {
    super('clients', {
        cuit: {type: String, required:true},
        name: {type: String, required:true},
        address: {type: String, required:true},
        phone: {type: Number, required:true},
        email: {type: String, required:true},
        type: { type: String, required: true },
        timestamp: {type: Number, required: true},
        responsable: {type: String, required: true}
      })
  }
};

export default ClientDaoMongo;