import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as morgan from 'morgan';
import * as TelegramBot from 'node-telegram-bot-api';
import * as path from 'path';

import { CONFIG } from './config';
import { MessageHandler } from './message-handler';
import { Routes } from './site/routes';
import { GameRepository } from './storage/chat.repository';
import { Chat } from './storage/connection';

const app = express();
const bot = new TelegramBot(CONFIG.token, CONFIG.debug ? { polling: true } : {});

app.use(morgan('dev'));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'site', 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'site', 'public')));

if (!CONFIG.debug) {
  bot.setWebHook(CONFIG.webHookUrl + CONFIG.token);

  app.post('/' + CONFIG.token, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });
}

const server = app.listen(CONFIG.port, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Web server started at http://${host}:${port}`);
});

const gameRepository = new GameRepository(Chat);

const messageHandler = new MessageHandler(gameRepository);
const routes = new Routes(gameRepository);

messageHandler.setup(bot);
routes.setup(app);
