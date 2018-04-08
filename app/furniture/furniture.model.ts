export type Category = 'chair' |
  'unusual chair' |
  'sideboard' |
  'stool' |
  'extendable table' |
  'table' |
  'bench' |
  'bed' |
  'nightstand' |
  'chest' |
  'extendable table' |
  'sofa' |
  'loveseat' |
  'tv unit' |
  'table lamp';

export interface Furniture {
  name: string;
  image: string;
  category: Category;
}
