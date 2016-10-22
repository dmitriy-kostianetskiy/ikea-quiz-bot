"use strict";

var express = require('express');
var path = require('path');

var indexRoutes = require('./routes/index');

class Site {
    constructor(server) {
        server.app.set('views', path.join(__dirname, 'views'));
        server.app.set('view engine', 'jade');
        server.app.use(express.static(path.join(__dirname, 'public')));
        
        indexRoutes(server);
    }
}


module.exports = Site;
