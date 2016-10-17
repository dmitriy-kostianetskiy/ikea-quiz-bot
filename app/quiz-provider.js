"use strict";


let gm = require('gm');

require("./connection.js");
let FurnitureModel = require("./models/furniture-model.js");
let ChatModel = require("./models/chat-model.js");

let random = require("./utilities/random.js");
let config = require("./../config.js");

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
        
        if (counter === config.answersCount){
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
                .in('-page', `+${config.imageSize}+0`)
                .in(answers[1].image)
                .in('-page', `+0+${config.imageSize}`)
                .in(answers[2].image)
                .in('-page', `+${config.imageSize}+${config.imageSize}`)
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
                    isFinished: chat.count >= config.questionsCount, 
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