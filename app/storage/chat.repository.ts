import * as mongoose from 'mongoose';

import { CONFIG } from '../config';
import { ChatModel } from './chat.model';

// import { Chat } from './connection';

export interface AnswerResult {
  model: ChatModel;
  isCurrentCorrect: boolean;
  isGameFinished: boolean;
}

export interface TopPlayerResult {
  name: string;
  score: number;
}

export interface StatisticsResult {
  totalGamesPlayed: number;
  uniquePlayers: number;
  topPlayers: TopPlayerResult[];
}

export class GameRepository {

  // tslint:disable-next-line:variable-name
  constructor(private Chat: mongoose.Model<ChatModel>) { }

  private composeDateFilter(date: Date) {
    return !date ? {} : { finished : { $gte: date }};
  }

  private async getTotalGamesPlayed(dateFilter: any): Promise<number> {
    return await this.Chat.count(dateFilter).exec();
  }

  private async getUniquePlayers(dateFilter: any): Promise<number> {
    const players = await this.Chat.distinct('telegramChatId', dateFilter);

    return players.length;
  }

  private async getTopPlayers(dateFilter: any): Promise<TopPlayerResult[]> {
    return (await this.Chat.aggregate([
      { $match: dateFilter },
      { $group: { _id : '$userName', max: { $max: '$right' }}},
      { $sort: {max: -1} }, { $limit: 10 }
    ])).map(x => {
      return {
        name: x._id,
        score: x.max
      };
    });
  }

  async getStatistics(date: Date): Promise<StatisticsResult> {
    const filter = this.composeDateFilter(date);

    return {
      totalGamesPlayed: await this.getTotalGamesPlayed(filter),
      uniquePlayers: await this.getUniquePlayers(filter),
      topPlayers: await this.getTopPlayers(filter),
    };
  }

  async getGame(chatId: number): Promise<ChatModel> {
    return this.Chat.findOneAndUpdate({
      telegramChatId: chatId,
      completed: false
    }, {}).exec();
  }

  async getOrCreateGame(chatId: number, userName: string): Promise<ChatModel> {
    return this.Chat.findOneAndUpdate({
      telegramChatId: chatId,
      completed: false
    }, {
      $setOnInsert: {
        telegramChatId: chatId,
        current: null,
        right: 0,
        count: 0,
        userName: userName,
        started: new Date()
      }
    }, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    }).exec();
  }

  async completeGame(chatId: number): Promise<ChatModel> {
    const game = await this.getGame(chatId);

    if (game) {
      game.completed = true;
      game.finished = new Date();

      return game.save();
    }

    return Promise.resolve(null);
  }

  async submitAnswer(chatId: number, answer: number): Promise<AnswerResult> {
    const game = await this.getGame(chatId);

    if (game.count >= CONFIG.questionsCount) {
      return null;
    }

    const isCorrect = game.current === answer - 1;

    if (isCorrect) {
      game.right++;
    }

    game.count++;

    return {
      isCurrentCorrect: isCorrect,
      isGameFinished: game.count >= CONFIG.questionsCount,
      model: await game.save()
    };
  }
}
