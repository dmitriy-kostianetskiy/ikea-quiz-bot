"use strict";

var debugConfig = {
    token : "289111243:AAHR2CdgcKdALyZVmSwxbleJOo5IhCMm7R0",
    db: "mongodb://admin:admin@ds033996.mlab.com:33996/ikea-quiz-db",
    answersCount: 4,
    questionsCount: 10,
    imageSize: 256,
    debug: true
};

var releaseConfig = {
    token : "289111243:AAHR2CdgcKdALyZVmSwxbleJOo5IhCMm7R0",
    db: "mongodb://admin:admin@ds033996.mlab.com:33996/ikea-quiz-db",
    answersCount: 4,
    questionsCount: 10,
    imageSize: 256,
    debug: false,
    herokuUrl: process.env.HEROKU_URL
};

var config = process.env.NODE_ENV === 'production' ? releaseConfig: debugConfig;

module.exports = config;