"use strict";

let express = require('express');
let packageInfo = require('./../package.json');
var bodyParser = require('body-parser');

class Server {
    start(bot){
        var app = express();
        
        app.use(bodyParser.json());
        
        app.get('/', function (req, res) {
            res.json({ version: packageInfo.version });
        });
        
        app.post('/' + bot.token, function (req, res) {
            console.log(`Request recieved req: ${req.body}, res: ${res}`);
           
            bot.processUpdate(req.body);
            res.sendStatus(200);
        });
        
        var server = app.listen(process.env.PORT, "0.0.0.0", function () {
            var host = server.address().address;
            var port = server.address().port;
            console.log('Web server started at http://%s:%s', host, port);
        });
    }
}

module.exports = new Server();