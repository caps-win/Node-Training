const mongodb = require('mongodb');
const getDb = require('../connection/database').getDb;
class User {
  constructor({ user, id}) {
    this._user = user;
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection('users')
      .insertOne(this._user)
  }

  addToCart(product) {
  
    const cartProductIndex = this._user.cart.items.findIndex(item => item.productId.toString() === product._id.toString());
    let newQuantity = 1;
    const updatedCartItems = [...this._user.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this._user.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    }else {
      updatedCartItems.push({ productId: new mongodb.ObjectId(product._id), quantity: newQuantity })  
    }
    
    const updatedCart = { 
      items: updatedCartItems
    };
    
    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) }, 
        {$set: {cart:  updatedCart} }
      );
  }

  getCart() {
    const db = getDb();
    const productIds = this._user.cart.items.map(item => item.productId);
    return db
      .collection('products')
      .find({_id: {$in : productIds}})
      .toArray()
      .then(products => {
        return products.map(product => {
          return {
            ...product, 
            quantity: this._user.cart.items.find(item => {
              return item.productId.toString() == product._id.toString()
            }).quantity
          }
        })
      });
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this._user.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    })

    const db = getDb();

    return db
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id)},
        { $set: { cart: {items: updatedCartItems} } }
      )
  }

  addOrder() {
    const db = getDb();
    return this.getCart().then(products => {
      const order = {
        items: products,
        user: {
          _id: new mongodb.ObjectId(this._user._id),
          name: this._user.name
        }
      };
      
      return  db.collection('orders')
      .insertOne(order)
    })
    .then(result => {

        return db.collection('users')
          .updateOne(
            {_id: new mongodb.ObjectId(this._id)},
            { $set: {cart: {items: [] } } }
          )
    })
  }

  getOrders() {
    const db = getDb();
    return db.collection('orders')
      .find({'user._id': new mongodb.ObjectId(this._user._id) } )
      .toArray();
  }

  static findById(id) {
    const db = getDb();
    return db.collection('users')
      .findOne({ _id: new mongodb.ObjectId(id) });
  }
}

module.exports = User;