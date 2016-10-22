"use strict";

let express = require('express');
let bodyParser = require('body-parser');
var logger = require('morgan');

let config = require('./../config.js');

class Server {
    constructor(){
        this.app = express();
        this.app.use(logger('dev'));
        
        this.server = this.app.listen(config.port, () => {
            let host = this.server.address().address;
            let port = this.server.address().port;
            console.log('Web server started at http://%s:%s', host, port);
        });
    }
}

module.exports = Server;