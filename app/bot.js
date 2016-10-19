"use strict";

let TelegramBot = require('node-telegram-bot-api');

let QuizProvider = require("./quiz-provider.js")
let handleCommands = require('./message-handler.js');
let config = require('./../config.js');

class Bot {
    
    constructor() {
        this.handlers = {};
    }

    start() {
        if(config.debug) {
            this.bot = new TelegramBot(config.token, {
                polling: true
            }); 
            
            console.log(`Telegram bot started in debug mode`);
        } else {
            this.bot = new TelegramBot(config.token); 
            this.bot.setWebHook(config.herokuUrl + this.bot.token);
            
            console.log(`Telegram bot started in release mode at ${config.herokuUrl}`);
        }
        
        this.bot.on('message', msg => {
            let provider = new QuizProvider(msg.chat.id, msg.from.first_name);
            handleCommands(msg, this.bot, provider);
        });
    }
    
    processUpdate(requestBody) {
        this.bot.processUpdate(requestBody);
    }
}

module.exports = new Bot();