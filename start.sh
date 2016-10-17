#!/usr/bin/env bash

sudo add-apt-repository ppa:dhor/myway -y
sudo apt-get update
sudo apt-get install graphicsmagick

export $(cat .env.production | xargs) && node index.js