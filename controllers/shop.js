const Product = require('../models/product');


exports.getProducts = (req, res) => {
  Product.fetchAll()
  .then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All products',
      path: '/products',
      hasProducts: products.length > 0,
    });
  })
  
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
  .then(product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: 'product.title',
      path: '/product-detail'
    });
  })
  
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
  .then(products => {
    res.render('shop/index', {
    prods: products,
    pageTitle: 'shop',
    path: '/shop',
    hasProducts: products.length > 0,
    });
  })
}

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
       });
    })
};
  

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId).then(product => {
      return req.user.addToCart(product)
    }).then(result => {
      res.redirect('/cart');
    });
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  req.user
    .deleteItemFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
}

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .addOrder()
    .then(result => res.redirect('/orders'));
}


exports.getOrders = (req, res, next) => {
  req.user.getOrders({include: ['products']})
  .then(orders => {
    res.render('shop/orders',  {
      path: '/orders',
      pageTitle: 'Your orders',
      orders
    });
  })
  
}
