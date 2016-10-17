"use strict";

let mongoose = require('mongoose'); 
let config = require('./../config.js');

mongoose.connect(config.db); 

mongoose.connection.on('connected', () => {  
  console.log('Mongoose connection open to ' + config.db);
}); 

mongoose.connection.on('error', (error) => {  
  console.log('Mongoose connection error: ' + error);
}); 

mongoose.connection.on('disconnected', () => {  
  console.log('Mongoose connection disconnected'); 
});
 
process.on('SIGINT', () => {  
  mongoose.connection.close(function () { 
    console.log('Mongoose connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 