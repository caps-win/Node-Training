const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/error');

const sequelize = require('./connection/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

// app.set('view engine', 'pug');
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1)
  .then(user => {
    req.user = user;
    next();
  })
  .catch(error => console.log(error))
});

app.use('/admin', adminRoutes);
app.use('/', shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});
Product.belongsToMany(Order, {through: OrderItem})

 

sequelize
  .sync()
  .then(result => {
    return User.findByPk(1)
    
  })
  .then(user => {
    if (!user) {
      return User.create({
        name: 'Juan',
        email: 'jsanta@cafetosoftware.com'
      });
    }
    return Promise.resolve(user);
  })
  .then(user => {
    return user.createCart(); 
  })
  .then(result => {
    app.listen(3000)
  })
  .catch(error => console.log(error));


