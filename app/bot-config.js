"use strict";

let fs = require('fs');

let config = JSON.parse(fs.readFileSync('./app/bot-config.json', 'utf8'));

module.exports = config;