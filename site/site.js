"use strict";

var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var indexRoutes = require('./routes/index');

class Site {
    constructor(server) {

        // view engine setup
        server.app.set('views', path.join(__dirname, 'views'));
        server.app.set('view engine', 'jade');

        // uncomment after placing your favicon in /public
        //server.app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

        server.app.use(bodyParser.urlencoded({
            extended: false
        }));
        
        server.app.use(cookieParser());
        server.app.use(express.static(path.join(__dirname, 'public')));

        indexRoutes(server);

        // catch 404 and forward to error handler
        server.app.use(function(req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        // error handlers

        // development error handler
        // will print stacktrace
        if (server.app.get('env') === 'development') {
            server.app.use(function(err, req, res, next) {
                res.status(err.status || 500);
                res.render('error', {
                    message: err.message,
                    error: err
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user
        server.app.use((err, req, res, next) => {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        });
    }
}


module.exports = Site;
