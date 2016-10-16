"use strict";

let TelegramBot = require('node-telegram-bot-api');


let CommandsHandler = require('./commands-handler.js');
let botConfig = require('./bot-config.js');

class Bot {
    
    constructor() {
        this.bot = new TelegramBot(botConfig.token, {
          polling: true
        });
        this.handlers = {};
    }

    _commandsHandlerFactory(id) {
        if (!this.handlers[id]) {
            this.handlers[id] = new CommandsHandler(id, this.bot, this.provider);
        }

        return this.handlers[id];
    }

    start() {
        this.bot.on('message', (msg) => {
            let hander = this._commandsHandlerFactory(msg.chat.id);
            hander.handleMessage(msg);
        });
    }
}

module.exports = new Bot();