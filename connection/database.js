const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient
  .connect('mongodb+srv://dbUser:Bathoryring1.@cluster0.gm6iq.mongodb.net/shop?retryWrites=true&w=majority')
    .then(client=> {
      console.log('connected!')
      _db = client.db();
      callback();
    })
    .catch(error => console.log(error) )
}

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;