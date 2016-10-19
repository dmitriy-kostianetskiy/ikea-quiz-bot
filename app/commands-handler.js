"use strict";

let gm = require('gm');

let QuizProvider = require('./quiz-provider.js');
let config = require("./../config.js");
let messages = require('./messages.js');

class CommandsHandler {

    constructor(chatId, bot) {
        this.chatId = chatId;
        this.bot = bot;
        this.provider = new QuizProvider(chatId);
    }

    handleMessage(msg) {
        switch (msg.text){
            case '/start':
                this._handleStartCommand(msg);
                break;
            case '/help':
                this._handleHelpCommand(msg);
                break;
            case 'Start Game!':
                this._handleStartGame(msg);
                break;
            default:
                this._handleAnswer(msg);
                break;
        }
    }
    
    _sendMessage(text, options){
        return this.bot.sendMessage(this.chatId, text, options);
    }

    _sendPhoto(photo, options){
        return this.bot.sendPhoto(this.chatId, photo, options);
    }

    _handleHelpCommand(msg) {
        return this._sendMessage(messages.helpMessage());
    }
    
    _handleStartCommand(msg) {
        return this._startGame(messages.startGameMessage(msg.from.first_name));
    }
    
    _handleAnswer(msg) {
        return this.provider
            .submitAnswer(msg.text)
            .then((data) => {
                return this._sendMessage(data.isRight ? messages.rightAnswerMessage() : messages.wrongAnswerMessage())
                    .then(() => {
                        if (data.isFinished){
                            return this._finishGame(data.right, data.total);
                        } else{
                            return this._question();
                        }
                    });
            });
    }
    
    _handleStartGame(msg) {
        return this._question();
    }
    
    _finishGame(right, total){
        let text = messages.gameFinishedMessage(right, total);
        
        return this._startGame(text);
    }
    
    _startGame(text){
        let options = {
            reply_markup: {
                resize_keyboard: true,
                keyboard: [
                    [{text: "Start Game!"}]
                ]
            }
        };

        return this.provider.reset().then(() => {
            return this._sendMessage(text, options);
        });
    }
    
    _question() {
         return this.provider.getNext().then((question) => {
            let options = {
                reply_markup: {
                    resize_keyboard: true,
                    keyboard: this._createAnswerKeyboard(question.answers)
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
            
            return this._sendMessage(text, options)
                .then(() => { 
                    this._sendPhoto(question.image);
                });
        });
    }
    
    _createAnswerKeyboard(data){
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
    }
}


module.exports = CommandsHandler;