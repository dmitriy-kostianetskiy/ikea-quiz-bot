sudo add-apt-repository ppa:dhor/myway
sudo apt-get update
sudo apt-get install graphicsmagick

heroku scale web=0   
heroku scale worker=1