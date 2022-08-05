import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import MongoContainer from '../../containers/MongoContainer.js';


class NotificationDaoMongo extends MongoContainer {
  constructor() {
    super('notifications', {
      timestamp: {type: Number, required: true},
      responsable: {type: String, required: true},
      message: {type: String, required:true},
      receiver: {type: String, required:true}
    })
  }
};

export default NotificationDaoMongo;