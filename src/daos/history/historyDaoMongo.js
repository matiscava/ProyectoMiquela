import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import MongoContainer from '../../containers/MongoContainer.js';


class HistoryDaoMongo extends MongoContainer {
  constructor() {
    super('history', {
        referenceNumber: {type: String, required:true},
        quantity: {type: Number, default: 0, required:true},
        type: { type: String, required: true },
        responsable: {type: String, required: true},
        timestamp: {type: Number, required: true},
        name: {type: String, required:true},
        barCode: {type: String, required:true},
        clientID: {type: String, required:true}
      })
  }
};

export default HistoryDaoMongo;