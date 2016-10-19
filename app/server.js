"use strict";

let express = require('express');
let bodyParser = require('body-parser');

let packageInfo = require('./../package.json');
let config = require('./../config.js');

class Server {
    start(bot){
        let app = express();
        
        app.use(bodyParser.json());

        app.post('/' + config.token, function (req, res) {
            bot.processUpdate(req.body);
            res.sendStatus(200);
        });
        
        let server = app.listen(config.port, function () {
            let host = server.address().address;
            let port = server.address().port;
            console.log('Web server started at http://%s:%s', host, port);
        });
    }
}

module.exports = new Server();