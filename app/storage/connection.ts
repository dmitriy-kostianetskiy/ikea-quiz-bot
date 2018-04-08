import * as mongoose from 'mongoose';

import { CONFIG } from '../config';
import { ChatModel, ChatSchema } from './chat.model';

(<any>mongoose).Promise = Promise;

export const connection: mongoose.Connection = mongoose.createConnection(CONFIG.db);

// tslint:disable-next-line:variable-name
export const Chat: mongoose.Model<ChatModel>  = connection.model<ChatModel>('Chat', ChatSchema);

connection.on('connected', () => {
  console.log(`[Mongoose] connection open to ${CONFIG.db}`);
});

connection.on('error', (error) => {
  console.log(`[Mongoose] connection error: error`);
});

connection.on('disconnected', () => {
  console.log('[Mongoose] connection disconnected');
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('[Mongoose] connection disconnected through app termination');
    process.exit(0);
  });
});
