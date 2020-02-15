import { bootstrap } from './bootstrap';

const {
  BOT_TOKEN,
  BOT_URL,
  NODE_ENV,
  FUNCTION_TARGET
} = process.env;

const bot = bootstrap(BOT_TOKEN);

if (NODE_ENV === 'production') {
  bot.telegram.setWebhook(`${BOT_URL}/${FUNCTION_TARGET}`);
} else {
  bot.launch();
}

export const botHook = (req, res) => {
  bot.handleUpdate(req.body, res);
};



