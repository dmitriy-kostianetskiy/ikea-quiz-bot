#!/usr/bin/env bash

sudo add-apt-repository ppa:dhor/myway -y
sudo apt-get update
sudo apt-get install graphicsmagick

#heroku configuration
#heroku config:set TOKEN=your_token --app your_app
#heroku config:set MONGO=your_mongo_db --app your_app
#heroku config:set NODE_ENV=production --app your_app
#heroku config:set HEROKU_URL=your_app_url --app your_app

node index.jsgi