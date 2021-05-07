const { findByPk } = require('../models/product');
const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res) => {
  const product = req.body;
  req.user
    .createProduct(product)
  .then(result => {
    console.log(result)
    res.redirect('/products');
  })
  .catch(error => console.log(error));
  
};

exports.getEditProduct = (req, res) => {
  const editMode = !!req.query.edit;
  if(!editMode) {
    return res.redirect('/');
  }
  const prodId = +req.params.productId;
  req.user.getProducts({where: {id: prodId}})
  .then(product => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product[0]
    });
  });
};

exports.postEditProduct = (req, res) => {
  const {id,...prod} = req.body;
  console.log(prod)
  Product.findOne({where : {id: id}})
  .then(product => {
    return Product.update(prod, {where: {id: id}})
    })
    .then(result => {
      res.redirect('/admin/products');
    })
  .catch(err => console.log(err));

  
}

exports.getProducts = (req, res, next) => {
  req.user.getProducts()
  .then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      hasProducts: products.length > 0,

    });
  })
}

exports.postDeleteProduct = (req, res, next) => {
  const prodId = +req.body.productId;
  Product.findByPk(prodId)
  .then(product => {
    return Product.destroy({where: {id: product.id}})
  })
  .then(result =>  res.redirect('/admin/products'));
}