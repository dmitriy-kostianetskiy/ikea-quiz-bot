"use strict";

require("./repositories/connection.js");

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
    
    _getRandom(result, exclude, counter){
        
        result = result || [];
        exclude = exclude || [];
        counter = counter || 0;
        
        if (counter === botConfig.answersCount){
            return;
        }
        
        return FurnitureModel
            .random({id: { $nin: exclude }})
            .then(x => {
                exclude.push(x._id);
                result.push(x);
                
                counter++;
                
                return this._getRandom(result, exclude, counter);
            });
    }
    
    getNext() {
        let exclude = [];
        let question = {
            rightAnswer: {},
            answers: []
        };
        
        return this._getRandom(question.answers)
            .then(() => {
                
                var rightIndex = random(question.answers.length);
                
                question.rightAnswer = rightIndex;
                
                return this._getChat().then((chat) => {
                    chat.current = rightIndex;
                    
                    return chat.save().then(() => {
                        return question;
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