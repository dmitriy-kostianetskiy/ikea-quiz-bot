"use strict";

require("./app/connection.js");
var bot = require('./app/bot.js');
var server = require('./app/server.js');

server.start();
bot.start();
