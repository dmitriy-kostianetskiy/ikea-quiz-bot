import { random } from '../utils';
import { FURNITURE } from './data/furniture';
import { Furniture } from './furniture.model';

function buildCategoryMap(exluded: string[]): { [category: string]: Furniture[] } {
  return FURNITURE.reduce((prev, cur) => {
    if (!exluded.includes(cur.name)) {
      if (!prev[cur.category]) {
        prev[cur.category] = [cur];
      } else {
        prev[cur.category].push(cur);
      }
    }

    return prev;
  }, {});
}

export async function getRandomSequence(exluded?: string[]): Promise<Furniture[]> {
  const result: Furniture[] = [];

  const map = buildCategoryMap(exluded);
  const categories = Object.getOwnPropertyNames(map);

  for (let i = 0; i < 4; i++) {
    const categoryIndex = random(categories.length);
    const items = map[categories[categoryIndex]];
    const itemIndex = random(items.length);

    result.push(items[itemIndex]);

    categories.splice(categoryIndex, 1);
  }

  return Promise.resolve(result);
}
