"use strict";

require("./app/connection.js");
let bot = require('./app/bot.js');
let server = require('./app/server.js');

bot.start();
server.start(bot);
