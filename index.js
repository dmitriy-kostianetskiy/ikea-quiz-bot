"use strict";

require("./storage/connection.js");
let Bot = require('./app/bot.js');
let Server = require('./server/server.js');

let server = new Server();
let bot = new Bot(server);