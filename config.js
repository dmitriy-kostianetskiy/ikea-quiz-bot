"use strict";

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

var config = {
    token : process.env.TOKEN,
    db: process.env.MONGO,
    answersCount: 4,
    questionsCount: 10,
    imageSize: 256,
    debug: process.env.NODE_ENV !== 'production',
    webHookUrl: process.env.HEROKU_URL || "0.0.0.0",
    port: process.env.PORT || 80
};

module.exports = config;

