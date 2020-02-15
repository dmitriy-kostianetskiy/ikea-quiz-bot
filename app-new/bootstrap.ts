import Telegraf, { ContextMessageUpdate } from 'telegraf';

export function bootstrap(token: string): Telegraf<ContextMessageUpdate> {
  const bot = new Telegraf(token);
  bot.start((ctx) => ctx.reply('Welcome!'));
  bot.help((ctx) => ctx.reply('Send me a sticker'));
  bot.on('sticker', (ctx) => ctx.reply('👍'));
  bot.hears('hi', (ctx) => ctx.reply('Hey there'));

  return bot;
}
