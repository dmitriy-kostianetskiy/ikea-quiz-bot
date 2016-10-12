"use strict";

class Chat {

    constructor(chatId, bot, provider) {
        this.chatId = chatId;
        this.bot = bot;
        this.provider = provider;
        this.rightAnswer = null;
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

    _handleHelpCommand(msg) {
        return this._sendMessage('Heeelp! I need somebody!');
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
    
    _handleAnswer(msg){
        if (!this.rightAnswer){
            return this
                ._sendMessage("Too much time, sucker! You can try again, little boy!")
                .then(() => { this._handleStartCommand(msg); });
        }
        
        if (msg.text === this.rightAnswer)
        {
            this._sendMessage('You are right, sweety!')
                .then(() => { this._handleStartGame(msg);});
        }
        else
        {
            this._sendMessage('You are sucker!');
        }
    }
    
    _handleStartGame(msg){
        
        return this.provider.getNext().then((data) => {
            var options = {
             //   reply_markup: {
             //       keyboard: this._createAnswerKeyboard(quiz.answers)
             //   }
            };
        
            //this.rightAnswer = quiz.rightAnswer;
            
            //return this._sendMessage(quiz.text, options);
            
            return this._sendMessage(data.name);
        });
    }
    
    _createAnswerKeyboard(data){
        return [
            [{text: data[0]},{text: data[1]}],
            [{text: data[2]},{text: data[3]}]
        ];
    }
}


module.exports = Chat;