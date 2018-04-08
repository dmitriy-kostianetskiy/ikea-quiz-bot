import { Document, Schema } from 'mongoose';

export interface ChatModel extends Document {
  telegramChatId?: number;
  current?: number;
  right?: number;
  count?: number;
  completed?: boolean;
  userName?: string;
  started?: Date;
  finished?: Date;
  previous?: string[];
}

// tslint:disable-next-line:variable-name
export const ChatSchema: Schema = new Schema({
  telegramChatId: Number,
  current: Number,
  right: Number,
  count: Number,
  completed: Boolean,
  userName: String,
  started: Date,
  finished: Date,
  previous: Array
});
