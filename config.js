"use strict";

var config = {
    token : process.env.TOKEN,
    db: process.env.MONGO,
    answersCount: 4,
    questionsCount: 10,
    imageSize: 256,
    debug: process.env.NODE_ENV !== 'production',
    herokuUrl: process.env.HEROKU_URL || "0.0.0.0"
};

module.exports = config;

