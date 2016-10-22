"use strict";

let TelegramBot = require('node-telegram-bot-api');
let bodyParser = require('body-parser');

let QuizProvider = require("./quiz-provider.js");
let handleCommands = require('./message-handler.js');
let config = require('./../config.js');

class Bot {
    constructor(server) {
        if(config.debug) {
            this.bot = new TelegramBot(config.token, {
                polling: true
            }); 
            
            console.log(`Telegram bot started in debug mode`);
        } else {
            this.bot = new TelegramBot(config.token); 
            this.bot.setWebHook(config.webHookUrl + this.bot.token);
                    
            server.app.use(bodyParser.json());
            
            server.app.post('/' + config.token, (req, res) => {
                this.bot.processUpdate(req.body);
                res.sendStatus(200);
            });
            
            console.log(`Telegram bot started in release mode at ${config.herokuUrl}`);
        }
        
        this.bot.on('message', msg => {
            let provider = new QuizProvider(msg.chat.id, msg.from.first_name);
            handleCommands(msg, this.bot, provider);
        });
    }
}

module.exports = Bot;