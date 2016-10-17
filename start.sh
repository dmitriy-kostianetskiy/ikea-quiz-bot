#!/usr/bin/env bash

add-apt-repository ppa:dhor/myway -y
apt-get update
apt-get install graphicsmagick

#heroku configuration
#heroku config:set TOKEN=your_token --app your_app
#heroku config:set MONGO=your_mongo_db --app your_app
#heroku config:set NODE_ENV=production --app your_app

node index.js