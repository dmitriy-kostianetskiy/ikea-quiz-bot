"use strict";

let QuizProvider = require('./quiz-provider.js');
let gm = require('gm');

const rightAnswerText = 'You are right, sweety!';
const wrongAnswerText = 'You are sucker!';
const helpText = 'Heeelp! I need somebody!';

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
        return this._sendMessage(helpText);
    }
    
    _handleStartCommand(msg) {
        var text = `Let's play ${msg.from.first_name}!`;
        var options = {
            reply_markup: {
                keyboard: [
                    [{text: "Start Game!"}]
                ]
            }
        };

        return this._sendMessage(text, options);
    }
    
    _handleAnswer(msg) {
        this.provider
            .submitAnswer(msg.text)
            .then((isRight) => {
                this._sendMessage(isRight ? rightAnswerText : wrongAnswerText);
            })
            .then(() => { 
                this._question();
            });
    }
    
    _handleStartGame(msg) {
        return this._question();
    }
    
    _question() {
         this.provider.getNext().then((question) => {
            let options = {
                reply_markup: {
                    keyboard: this._createAnswerKeyboard(question.answers)
                }
            };
            
            let rightName = question.answers[question.rightAnswer].name;
            let text = `What the fuck is this: ${rightName}?`;

            
            gm()
                .in('-page', '+0+0')  // Custom place for each of the images
                .in(question.answers[0].image)
                .in('-page', '+256+0')
                .in(question.answers[1].image)
                .in('-page', '+0+256')
                .in(question.answers[2].image)
                .in('-page', '+256+256')
                .in(question.answers[3].image)
                .minify()  // Halves the size, 512x512 -> 256x256
                .mosaic()  // Merges the images as a matrix
                .toBuffer('PNG',(err, buffer) => {
                  
                  if (err) return;
                  
                  this._sendPhoto(buffer);
                })
            
            
            var t = this._sendMessage(text, options);
        });
        
    }
    
    _createAnswerKeyboard(data){
        var result = [];
        var item = [];
        
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