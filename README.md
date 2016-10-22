# Ikea quiz telegram bot 

This is a simple quiz for Telegram. The rules of the game are pretty simple: bot gives you the name of the Ikea product and you need to guess what is this.

## Run on your local machine

Create `.env` similar to `.env.example` file in the root folder with the following content:
```bash
NODE_ENV=debug
TOKEN=YOUR_TELEGRAM_BOT_TOKEN
MONGO=YOUR_MONGO_DB_CONNECTION_STRING
```
Then just run `npm`.

```bash
npm run start.debug
```

## Run on Heroku

Run following script within the Heroku CLI.

```bash
heroku config:set TOKEN=your_token --app your_app
heroku config:set MONGO=your_mongo_db --app your_app
heroku config:set NODE_ENV=production --app your_app
heroku config:set HEROKU_URL=your_heroku_url --app your_app
heroku buildpacks:add --index 1 https://github.com/mcollina/heroku-buildpack-graphicsmagick.git --app your_app
```

Then just run `npm`.

```bash
npm run start
```
