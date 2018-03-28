"use strict";

let config = require("./../config.js");
let messages = require('./messages.js');

let handleMessage = function(msg, bot, provider) {
        
    let _sendMessage = (text, options) => {
        return bot.sendMessage(msg.chat.id, text, options);
    };

    let _sendPhoto = (photo, options) => {
        return bot.sendPhoto(msg.chat.id, photo, options, { 
            filename: '1',
            contentType: "application/octet-stream"
         });
    };

    let _handleHelpCommand = (msg) => {
        return _sendMessage(messages.helpMessage());
    };

    let _handleStartCommand = (msg) => {
        return _startGame(messages.startGameMessage(msg.from.first_name));
    };

    let _handleAnswer = (msg) => {
        return provider
            .submitAnswer(msg.text)
            .then((data) => {
                if (data.isSkip){
                    return;
                }
                
                return _sendMessage(data.isRight ? messages.rightAnswerMessage() : messages.wrongAnswerMessage())
                    .then(() => {
                        if (data.isFinished){
                            return _finishGame(data.right, data.total);
                        } else{
                            return _question();
                        }
                    });
            });
    };
    
    let _handleStartGame = (msg) => {
        return _question();
    };

    let _finishGame = (right, total) => {
        let text = messages.gameFinishedMessage(right, total);
        
        return _startGame(text);
    };

    let _startGame = (text) => {
        let options = {
            reply_markup: {
                resize_keyboard: true,
                keyboard: [
                    [{text: "Start Game!"}]
                ]
            }
        };

        return provider.finish().then(() => {
            return _sendMessage(text, options);
        });
    };

    let _question = () => {
         return provider.getNext().then((question) => {
            let options = {
                reply_markup: {
                    resize_keyboard: true,
                    keyboard: _createAnswerKeyboard(question.answers)
                },
                parse_mode: "Markdown"
            };
            
            let rightName = question.answers[question.rightAnswer].name;
            let text = messages.questionMessage(rightName);
            
            if (config.debug) {
                question.answers.forEach(a => {
                    text += '\n' + `name: ${a.name} category: ${a.category}`;
                });
            }
            
            return _sendMessage(text, options)
                .then(() => { 
                    return _sendPhoto(question.image);
                });
        });
    };

    let _createAnswerKeyboard = (data) => {
        let result = [];
        let item = [];
        
        for (let i=0;i<data.length;i++){
            if (item.length === 2) {
                result.push(item);
                item = [];
            }
            
            item.push({ text: `${i+1}`});
        }
        
        if (item.length > 0){
            result.push(item);
        }
        
        return result;
    };
    
    let promise = null;
    switch (msg.text){
        case '/start':
            promise = _handleStartCommand(msg);
            break;
        case '/help':
            promise = _handleHelpCommand(msg);
            break;
        case 'Start Game!':
            promise = _handleStartGame(msg);
            break;
        default:
            promise = _handleAnswer(msg);
            break;
    }
    
    if (promise && promise.then) {
        promise.catch((err) => { console.log(err); });
    }
};


module.exports = handleMessage;