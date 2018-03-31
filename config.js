"use strict";

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

var config = {
    token : process.env.TOKEN || '289111243:AAHR2CdgcKdALyZVmSwxbleJOo5IhCMm7R0',
    db: process.env.MONGO || 'mongodb://ikea-quiz-user:ikea3395@ds033996.mlab.com:33996/ikea-quiz-db',
    answersCount: 4,
    questionsCount: 10,
    imageSize: 256,
    debug: process.env.NODE_ENV !== 'production',
    webHookUrl: process.env.HEROKU_URL || "0.0.0.0",
    port: process.env.PORT || 80
};

module.exports = config;

