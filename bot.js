"use strict";

var TelegramBot = require('node-telegram-bot-api');
var fs = require('fs');

var Chat = require('./chat.js');
var QuizProvider = require('./quiz-provider.js');

class Bot {
    
    constructor() {
        this.config = JSON.parse(fs.readFileSync('bot-config.json', 'utf8'));
        this.bot = new TelegramBot(this.config.token, {
          polling: true
        });
        this.chats = {};
        this.provider = new QuizProvider();
    }

    _chatFactory(id) {
        if (!this.chats[id]) {
            this.chats[id] = new Chat(id, this.bot, this.provider);
        }

        return this.chats[id];
    }

    start() {
        this.bot.on('message', (msg) => {
            var chat = this._chatFactory(msg.chat.id);
            chat.handleMessage(msg);
        });
    }
}

module.exports = Bot;