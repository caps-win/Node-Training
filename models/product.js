const mongodb = require('mongodb');
const getDb = require('../connection/database').getDb;
class Product {
  constructor( { product, id, userId } ){
    this._product = product;
    this._id = id;
    this._userId = userId;
  }

  save(){
    const db = getDb();
    let dbResult;
    if (this._id) {
      dbResult = db.collection('products')
        .updateOne({_id : new mongodb.ObjectId(this._id)}, {$set :this._product })
    }else {
      dbResult = db.collection('products')
      .insertOne({...this._product, userId: this._userId});
    }
    return dbResult;
  }

  static fetchAll() {
    const db = getDb();
    return db.collection('products')
      .find()
      .toArray();
  }

  static findById(prodId) {
    const db = getDb();
    return db.collection('products')
      .find({ _id : new mongodb.ObjectId(prodId) })
      .next();
     
  }
  
  static deleteById(id) {
    const db = getDb();
    return db.collection('products')
      .deleteOne({_id : new mongodb.ObjectId(id)});
  }
}

module.exports = Product;