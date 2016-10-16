"use strict";

let express = require('express');
let packageInfo = require('./../package.json');

class Server {
    start(){
        let app = express();

        app.get('/', function (req, res) {
          res.json({ version: packageInfo.version });
        });
        
        let server = app.listen(process.env.PORT, function () {
          let host = server.address().address;
          let port = server.address().port;
        
          console.log('Web server started at http://%s:%s', host, port);
        });
    }
}

module.exports = new Server();