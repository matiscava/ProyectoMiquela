import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import MongoContainer from '../../containers/MongoContainer.js';


class UserDaoMongo extends MongoContainer {
  constructor() {
    super('users', {
      name: {type: String, required:true},
      lastname: {type: String, required:true},
      phone: {type: Number, required:true},
      dni: {type: String, required:true},
      email: {type: String, required:true},
      salt: {type: String, required: true},
      hash: {type: String, required: true},
      notifications: {type: Array, default: [], required: true}
      })
  }
};

export default UserDaoMongo;