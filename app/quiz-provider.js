"use strict";

require("./repositories/connection.js");

let gm = require('gm');

let FurnitureModel = require("./repositories/furniture-repository.js");
let ChatModel = require("./repositories/chat-repository.js");

let random = require("./utilities/random.js");
let botConfig = require("./bot-config.js");

class QuizProvider{
    constructor(chatId){
        this.chatId = chatId;
    }
    
    _getChat() {
        let query = { telegramChatId: this.chatId },
            update = {
                $setOnInsert: { 
                    telegramChatId: this.chatId, 
                    current: null, 
                    right: 0, 
                    count: 0 
                }
            },
            options = { upsert: true, new: true, setDefaultsOnInsert: true };

        let chat = ChatModel.findOneAndUpdate(query, update, options);
    
        return chat;
    }
    
    _getRandom(result, counter, excludeCategory){
        
        result = result || [];
        excludeCategory = excludeCategory || [];
        counter = counter || 0;
        
        if (counter === botConfig.answersCount){
            return;
        }
        
        return FurnitureModel
            .random({category: { $nin: excludeCategory}})
            .then(x => {
                
                excludeCategory.push(x.category);
                
                result.push(x);
                
                counter++;
                
                return this._getRandom(result, counter, excludeCategory);
            });
    }
    
    _tileImage(answers){
        return new Promise(function(resolve, reject) {
            gm()
                .in('-page', '+0+0')
                .in(answers[0].image)
                .in('-page', `+${botConfig.imageSize}+0`)
                .in(answers[1].image)
                .in('-page', `+0+${botConfig.imageSize}`)
                .in(answers[2].image)
                .in('-page', `+${botConfig.imageSize}+${botConfig.imageSize}`)
                .in(answers[3].image)
                .minify()
                .mosaic()
                .toBuffer('PNG', (error, buffer) => {
                    if (error){
                        reject(error);
                    }
                    
                    resolve(buffer);
                });
        });
    }
    
    getNext() {
        let question = {
            rightAnswer: {},
            answers: [],
            
        };
        
        return this._getRandom(question.answers)
            .then(() => {
                
                var rightIndex = random(question.answers.length);
                
                question.rightAnswer = rightIndex;
                
                
                return this._tileImage(question.answers).then(buffer => { 
                    question.image = buffer;
                    
                    return this._getChat().then((chat) => {
                        chat.current = rightIndex;
                        
                        return chat.save().then(() => {
                            return question;
                        });
                    });
                });
            });
    }
    
    submitAnswer(answer) {
        return this._getChat()
            .then(chat => {
                
                chat.count++;
                
                let result = { 
                    isRight: chat.current === (answer - 1), 
                    isFinished: chat.count >= botConfig.questionsCount, 
                    right: chat.right,
                    total: chat.count
                };
                
                if (result.isRight) {
                    chat.right++;
                }
                
                var promise = result.isFinished ? chat.remove() : chat.save();
                
                return promise.then(() => { return result; });
            });
    }
}

module.exports = QuizProvider;