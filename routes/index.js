var express = require('express');
var router = express.Router();
var Product = require("../models/product");
var Cart = require('../models/cart');
const { ensureAuthenticated, forwardAuthenticated } = require('../auth/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  var products = Product.find()
  .then((result) => {
    console.log(result.length);
    req.flash('success', 'Flash is back!')
  res.render('index', { title: 'Express', result:result });
    
  }).catch((err) => {
    console.log(err)
  });
  // res.json({"products":products})
});


router.get('/account', ensureAuthenticated, function(req, res, next) {
  var products = Product.find()
  .then((result) => {
    console.log(result.length);
  res.render('account', { title: 'Express', result:result });
    
  }).catch((err) => {
    console.log(err)
  });
  console.log(Product.find().length);
  
  // res.json({products:products})
});

router.get('/add-to-cart/:id', (req, res, next)=>{
  var productId =  req.params.id;
  
  var cart = new Cart(req.session.cart ? req.session.cart : {items:{}});
  

  Product.findById(productId).then((product) => {
    
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
    
  }).catch((err) => {
    if (err) {
     return res.redirect('/');
    }
  });

})



router.get('/shop', (req, res, next)=>{

  if(!req.session.cart){
    res.render('shop', {products:null});
  }
  var cart =  new Cart(req.session.cart);
  console.log(cart.generateArr());
  

  res.render('shop', {products: cart.generateArr(), totalPrice:cart.totalPrice});
})

router.get('/remove-cart/:id', (req, res, next)=>{
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items:{}});

  Product.findById(productId).then((product) => {
    cart.splice(product, product.id);
    req.session.cart = cart;
    res.redirect('/shop');
  }).catch((err) => {
    
  });
})

router.get('/checkout', (req, res, next)=>{
  res.render('checkout')
})
module.exports = router;
