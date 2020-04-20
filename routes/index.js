var express = require('express');
var router = express.Router();
var Product = require("../models/Product");

/* GET home page. */
router.get('/', function(req, res, next) {
  var products = Product.find();
  // res.render('index', { title: 'Express', products:products });
  res.json({"products":products})
});

router.get('/account', function(req, res, next) {
  var products = Product.find();
  console.log("true");
  
  // res.render('account', { title: 'Express', products:products });
  res.json({products:products})
});

module.exports = router;
