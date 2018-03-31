console.log(1);

require("./storage/connection.js");
let Bot = require('./app/bot.js');
let Server = require('./server/server.js');
let Site = require('./site/site.js');

let server = new Server();
let site = new Site(server);
let bot = new Bot(server);
