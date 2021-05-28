const path = require('path');
const express = require('express');

const mongoClient = require('./connection/database').mongoConnect;
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/error');
const User = require('./models/user');

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
  User.findById("609bd76519650d6705ac757b")
  .then(user => {
   
    req.user = new User({user, id: user._id});
    next();
  })
});

app.use('/admin', adminRoutes);
app.use('/', shopRoutes);

app.use(errorController.get404);

mongoClient(() => {
  app.listen(3000);

});