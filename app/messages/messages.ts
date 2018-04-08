import { random } from '../utils';

export const START_GAME = 'Start Game!';

export const RIGHT_ANSWERS = [
  'You got that right! \u{1f389}',
  'Congratulations! \u{1f44b}',
  'It was easy! Wasn\'t it? \u{1f37b}',
  'Cool! You\'re rocky! \u{1f3cb}'
];

export const WRONG_ANSWERS = [
  'It was so close! \u{0274c}',
  'Not quite! \u{1f44e}',
  'That\'s wrong! \u{1f641}',
  'Oh no! Fail! Don\'t give up! \u{1f610}'
];

export const HELP_MESSAGE = 'Heeelp! I need somebody!';

export const GAME_FINISHED_EMOJI = [
  '\u{1f62d}',
  '\u{1f622}',
  '\u{1f62b}',
  '\u{1f61e}',
  '\u{1f610}',
  '\u{1f397}',
  '\u{1f381}',
  '\u{1f389}',
  '\u{1f396}',
  '\u{1f3c6}',
  '\u{1f451}'
];

export function getRightAnswerMessage(): string {
  return RIGHT_ANSWERS[random(RIGHT_ANSWERS.length)];
}

export function getWrongAnswerMessage(): string {
  return WRONG_ANSWERS[random(WRONG_ANSWERS.length)];
}

export function getFinishedMessage(right: number, total: number): string {
  const emoji = GAME_FINISHED_EMOJI.length > right ? GAME_FINISHED_EMOJI[right] : '';

  const leftPad = emoji ? `${emoji}${emoji}${emoji}   ` : '';
  const rightPad = emoji ? `   ${emoji}${emoji}${emoji}` : '';

  return `${leftPad}Game finished. Your result is ${right} out of ${total}.${rightPad}`;
}

export function getQuestionMessage(furnitureName: string): string {
  return `What is ${furnitureName}?`;
}

export function getStartGameMessage(userName: string): string {
    return `\u{1f389}\u{1f389} Let's start a new game ${userName}! \u{1f389}\u{1f389}
I will ask you \u{1f51f} questions.
Hit "Start Game!" if you're ready! \u{1f52e}\u{1f3ae}`;
}
