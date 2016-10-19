"use strict";

let random = require('./utilities/random.js');

let rightAnswers = ['You got that right! \u{1f389}', 'Congratulations! \u{1f44b}', 'It was easy! Wasn\'t it? \u{1f37b}', 'Cool! You\'re rocky! \u{1f3cb}' ];
let wrongAnswers = ['It was so close! \u{0274c}', 'Not quite! \u{1f44e}', 'That\'s wrong! \u{1f641}', 'Oh no! Fail! Don\'t give up! \u{1f610}', ];

let rightAnswerMessage = () => { return rightAnswers[random(rightAnswers.length)]; };
let wrongAnswerMessage = () => { return wrongAnswers[random(wrongAnswers.length)]; };

let helpMessage = () => { return 'Heeelp! I need somebody!'; };

let gameFinishedEmoji = [
    '\u{1f62d}', //0
    '\u{1f622}', //1
    '\u{1f62b}', //2
    '\u{1f61e}', //3
    '\u{1f610}', //4
    '\u{1f397}', //5
    '\u{1f381}', //6
    '\u{1f389}', //7
    '\u{1f396}', //8
    '\u{1f3c6}', //9
    '\u{1f451}'  //10
    ]; 

let gameFinishedMessage = (right, total) => { 
    
    let emoji = gameFinishedEmoji.length > right ? gameFinishedEmoji[right] : '';
    
    let leftPad = '';
    let rightPad = '';
    
    if (emoji) {
        leftPad = emoji + emoji + emoji + '   ';
        rightPad = '   ' + emoji + emoji + emoji;
    }
    
    return leftPad + `Game finished. Your result is ${right} out of ${total}.` + rightPad;
};

let questionMessage = (name) => { return `What is *${name}*?` };
let startGameMessage = (userName) => {
    return `Let's start a new game ${userName}! 
I will ask you 10 questions. 
Hit "Start Game!" if you're ready!`;
};
        
        
module.exports = {
    rightAnswerMessage: rightAnswerMessage,
    wrongAnswerMessage: wrongAnswerMessage,
    helpMessage: helpMessage,
    gameFinishedMessage: gameFinishedMessage,
    questionMessage: questionMessage,
    startGameMessage: startGameMessage
};