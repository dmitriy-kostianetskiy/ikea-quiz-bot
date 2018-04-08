import { load } from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  load();
}

export const CONFIG = {
  token : process.env.TOKEN,
  db: process.env.MONGO,
  questionsCount: process.env.QUESTIONS_COUNT || 10,
  imageSize: process.env.IMAGE_SIZE || 256,
  debug: process.env.NODE_ENV !== 'production',
  webHookUrl: process.env.HEROKU_URL || '0.0.0.0',
  port: process.env.PORT || 80
};
