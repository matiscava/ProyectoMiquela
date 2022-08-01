import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import MongoContainer from '../../containers/MongoContainer.js';


class ProductDaoMongo extends MongoContainer {
  constructor() {
    super('products', {
      barCode: {type: String, required:true},
      code: {type: String, required:true},
      minStock: {type: Number, required:true},
      name: {type: String, required:true},
      description: {type: String, required:true},
      type: { type: String, required: true },
      responsable: {type: String, required: true},
      timestamp: {type: Number, required: true},
      stock: {type: Number, default: 0, required:true}
    })
  }
};

export default ProductDaoMongo;