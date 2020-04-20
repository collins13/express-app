const Product = require('../models/Product');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/shop', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});



const products = [
    new Product({
        imagePath:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=602&q=80",
        title:"burger king",
        description:"is a sandwich consisting of one or more cooked patties of ground meat, usually beef, placed inside a sliced bread roll or bun.",
        price:150
    }),
    new Product({
        imagePath:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=602&q=80",
        title:"China Rice",
        description:"is a sandwich consisting of one or more cooked patties of ground meat, usually beef, placed inside a sliced bread roll or bun.",
        price:150
    }),
    new Product({
        imagePath:"https://ca-times.brightspotcdn.com/dims4/default/3978883/2147483647/strip/true/crop/2048x1366+0+0/resize/840x560!/quality/90/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2Fed%2Fce%2F78ff9668f895eac8a400eb5010f2%2Fla-1442342-fo-0606-juice-bars-jlc-06-jpg-20150129",
        title:"Juice",
        description:"consisting of one or more cooked patties of ground meat, usually beef, placed inside a sliced bread roll or bun.",
        price:150
    })
];

let done = 0;
for (let i = 0; i < products.length; i++) {
    products[i].save(function(err, result) {
        done++;

        if (done == products.length) {
            exit();
        }
    });
    
}

function exit() {
    mongoose.disconnect();
}