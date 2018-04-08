import { CONFIG } from './config';
import { Furniture } from './furniture/furniture.model';
import { getRandomSequence } from './furniture/furniture.repository';
import { ChatModel } from './storage/chat.model';
import { buildImage } from './tile-builder';
import { random } from './utils';

const ANSWERS_COUNT = 4;

export interface QuizQuestion {
  items: Furniture[];
  right: number;
  image: any;
}

export async function getNextQuestion(game: ChatModel) {
  const randomItems = await getRandomSequence(game.previous);

  const [
    topLeft,
    topRight,
    bottomLeft,
    bottomRight
  ] = randomItems.map(({ image }) => `images/${image}`);

  const tiledImage = await buildImage(topLeft,
    topRight,
    bottomLeft,
    bottomRight,
    CONFIG.imageSize);

  return {
    items: randomItems,
    right: random(ANSWERS_COUNT),
    image: tiledImage
  };
}
