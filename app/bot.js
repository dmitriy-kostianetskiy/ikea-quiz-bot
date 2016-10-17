"use strict";

let TelegramBot = require('node-telegram-bot-api');

let CommandsHandler = require('./commands-handler.js');
let config = require('./../config.js');

class Bot {
    
    constructor() {
        this.handlers = {};
    }

    _commandsHandlerFactory(id) {
        if (!this.handlers[id]) {
            this.handlers[id] = new CommandsHandler(id, this.bot, this.provider);
        }

        return this.handlers[id];
    }

    start() {
        if(config.debug) {
            this.bot = new TelegramBot(config.token, {
                polling: true
            }); 
            
            console.log(`Telegram bot started in debug mode`);
        } else {
            this.bot = new TelegramBot(config.token); 
            this.bot.setWebHook(process.env.HEROKU_URL + this.bot.token);
            
            console.log(`Telegram bot started in release mode`);
        }
        
        this.bot.on('message', (msg) => {
            let hander = this._commandsHandlerFactory(msg.chat.id);
            hander.handleMessage(msg);
        });
    }
}

module.exports = new Bot();