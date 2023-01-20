import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import MongoContainer from '../../containers/MongoContainer.js';
import { createHash } from '../../utils/hash.js';


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
      notifications: {type: Array, default: [], required: true},
      forgetPassword: {type: Boolean, default: false, required: false}
      })
  }

  async forgetPassword(userDto){
    try {
      let user = await this.collection.findOne( {'email': userDto.username},{__v:0} )
      if (user.length === 0) {
        return null;
      } else {
        const {salt , hash } = createHash("Miquela!2023");
        user.salt = salt;
        user.hash = hash;
        user.forgetPassword = true;
        const { n, nModified } = await this.collection.updateOne({ _id: user.id }, {
          $set: user
        })
        if (n == 0 || nModified == 0) throw new Error(`Elemento con el id: '${id}' no fue encontrado`);
        return true;
      }
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }

  }
};

export default UserDaoMongo;