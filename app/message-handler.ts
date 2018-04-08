import * as TelegramBot from 'node-telegram-bot-api';

import { CONFIG } from './config';
import {
  getFinishedMessage,
  getQuestionMessage,
  getRightAnswerMessage,
  getStartGameMessage,
  getWrongAnswerMessage,
  HELP_MESSAGE,
  START_GAME,
} from './messages';
import { getNextQuestion } from './question-provder';
import { GameRepository } from './storage/chat.repository';

const TILE_KEYBOARD: TelegramBot.KeyboardButton[][] = [
  [
    { text: '1' },
    { text: '2' }
  ],
  [
    { text: '3' },
    { text: '4' }
  ]
];

const START_GAME_KEYBOARD: TelegramBot.KeyboardButton[][] = [
  [{text: START_GAME}]
];

interface MessageHandlerItem {
  regex: RegExp;
  handler: (message: TelegramBot.Message, bot: TelegramBot) => Promise<any>;
}

export class MessageHandler {
  private items: MessageHandlerItem[] = [
    {
      regex: /^\/start$/,
      handler: async (message: TelegramBot.Message, bot: TelegramBot): Promise<any> => {
        await this.startHandler(message, bot);
      }
    },
    {
      regex: /^\/help$/,
      handler: async ({ chat, from }: TelegramBot.Message, bot: TelegramBot): Promise<any> => {
        return bot.sendMessage(chat.id, HELP_MESSAGE);
      }
    },
    {
      regex: /^Start Game!$/,
      handler: async (message: TelegramBot.Message, bot: TelegramBot): Promise<any> => {
        await this.startGameHandler(message, bot);
      }
    },
    {
      regex: /^[1-4]$/,
      handler: async (message: TelegramBot.Message, bot: TelegramBot): Promise<any> => {
        await this.answerHandler(message, bot);
      }
    }
  ];

  constructor (private gameRepository: GameRepository) { }

  setup(bot: TelegramBot) {
    this.items.forEach(({ regex, handler }) => {
      bot.onText(regex, async (message) => {
        try {
          await handler(message, bot);
        } catch (error) {
          console.log(`[TelegramBot] Error: ${error}`);
        }
      });
    });
  }

  private async completeGame(chatId: number, messageText: string, bot: TelegramBot): Promise<void> {
    const completedGame = await this.gameRepository.completeGame(chatId);

    await bot.sendMessage(chatId, messageText, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: START_GAME_KEYBOARD
      }
    });
  }

  private async question(chatId: number, userName: string, bot: TelegramBot): Promise<void> {
    const game = await this.gameRepository.getOrCreateGame(chatId, userName);
    const { right, items, image } = await getNextQuestion(game);

    let questionMessageText = getQuestionMessage(items[right].name);

    if (CONFIG.debug) {
      items.forEach(a => {
        questionMessageText += `\nname: ${a.name} category: ${a.category}`;
      });
    }

    game.current = right;

    await game.save();

    await bot.sendPhoto(chatId, image, {
      caption: questionMessageText,
      reply_markup: {
        resize_keyboard: true,
        keyboard: TILE_KEYBOARD
      }
    });
  }

  private async startHandler({ from, chat }: TelegramBot.Message, bot: TelegramBot): Promise<void> {
    return this.completeGame(chat.id, getStartGameMessage(from.first_name), bot);
  }

  private async startGameHandler({ from, chat }: TelegramBot.Message, bot: TelegramBot): Promise<void> {
    return this.question(chat.id, from.first_name, bot);
  }

  private async answerHandler({ from, chat, text }: TelegramBot.Message, bot: TelegramBot): Promise<void> {
    const answerResult = await this.gameRepository.submitAnswer(chat.id, parseInt(text, 10));

    if (!answerResult) {
      return;
    }

    const messageText = answerResult.isCurrentCorrect
      ? getRightAnswerMessage()
      : getWrongAnswerMessage();

    await bot.sendMessage(chat.id, messageText);

    if (answerResult.isGameFinished) {
      const { right } = answerResult.model;
      return this.completeGame(chat.id, getFinishedMessage(right, CONFIG.questionsCount), bot);
    } else {
      return this.question(chat.id, from.first_name, bot);
    }
  }
}
