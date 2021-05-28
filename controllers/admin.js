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
  const userId = req.user._id;


  const objProduct = new Product({ product, userId });
  objProduct.save()
  .then(results => {
   
    res.redirect('/products');
  })
  .catch(error => console.log(error));
  
};

exports.getEditProduct = (req, res) => {
  const editMode = !!req.query.edit;
  if(!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
  .then(product => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  });
};

exports.postEditProduct = (req, res) => {
  const {id,...product} = req.body;
  
  const objProduct = new Product({ product, id});
  objProduct.save()
    .then(() => {
      res.redirect('/admin/products');
    })
  .catch(err => console.log(err));

  
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
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
  const prodId = req.body.productId;
  Product.deleteById(prodId)
  .then(() => {
    res.redirect('/admin/products')
  });
}