"use strict";

const gm = require('gm');

let FurnitureModel = require("./../storage/models/furniture-model.js");
let ChatModel = require("./../storage/models/chat-model.js");

let random = require("./../utilities/random.js");
let config = require("./../config.js");

class QuizProvider {
    constructor(chatId, userName) {
        this.chatId = chatId;
        this.userName = userName;
    }

    _getChat() {
        let query = {
                telegramChatId: this.chatId,
                completed: false
            },
            update = {
                $setOnInsert: {
                    telegramChatId: this.chatId,
                    current: null,
                    right: 0,
                    count: 0,
                    userName: this.userName,
                    started: new Date()
                }
            },
            options = {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            };

        let chat = ChatModel.findOneAndUpdate(query, update, options);
        return chat;
    }

    _getRandom(result, options) {
        result = result || [];

        options.excludeCategory = options.excludeCategory || [];
        options.previous = options.previous || [];
        options.counter = options.counter || 0;

        if (options.counter === config.answersCount) {
            return;
        }

        return FurnitureModel
            .random({
                category: {
                    $nin: options.excludeCategory
                },
                name: {
                    $nin: options.previous
                }
            })
            .then(x => {

                options.excludeCategory.push(x.category);

                result.push(x);

                options.counter++;

                return this._getRandom(result, options);
            });
    }

    _tileImage(answers) {
        const img = 'http://docs.wand-py.org/en/0.4.1/_images/windows-setup.png';
        const data = gm()
          .in('-page', '+0+0')
          .in('images/' + answers[0].image)
          .in('-page', `+${config.imageSize}+0`)
          .in('images/' + answers[1].image)
          .in('-page', `+0+${config.imageSize}`)
          .in('images/' + answers[2].image)
          .in('-page', `+${config.imageSize}+${config.imageSize}`)
          .in('images/' + answers[3].image)
          .mosaic()
          .setFormat('png');

      return new Promise((resolve, reject) => {
          data.stream((err, stdout, stderr) => {
              if (err) { return reject(err) }
              const chunks = []
              stdout.on('data', (chunk) => { chunks.push(chunk) })
              // these are 'once' because they can and do fire multiple times for multiple errors,
              // but this is a promise so you'll have to deal with them one at a time
              stdout.once('end', () => { resolve(Buffer.concat(chunks)) })
              stderr.once('data', (data) => { reject(String(data)) })
          })
      });
    }

    getNext() {
        let question = {
            rightAnswer: {},
            answers: []
        };

        return this._getChat().then((chat) => {
            return this._getRandom(question.answers, { previous: chat.previous })
                .then(() => {

                    let rightIndex = random(question.answers.length);
                    question.rightAnswer = rightIndex;

                    chat.current = rightIndex;
                    chat.previous = chat.previous || [];
                    chat.previous.push(question.answers[rightIndex].name);

                    const r = this._tileImage(question.answers);

                    return r.then(buffer => {
                        question.image = buffer;
                        return chat.save().then(() => {
                            return question;
                        });
                    });
                });
        });
    }

    finish() {
        return this._getChat().then(chat => {
            chat.completed = true;
            chat.finished = new Date();
            return chat.save();
        });
    }

    submitAnswer(answer) {
        return this._getChat()
            .then(chat => {
                if (chat.count >= 10){
                    return {
                        isSkip: true
                    };
                }

                chat.count++;

                let isRight = chat.current === (answer - 1);
                if (isRight) {
                    chat.right++;
                }

                let result = {
                    isRight: isRight,
                    isFinished: chat.count >= config.questionsCount,
                    right: chat.right,
                    total: chat.count
                };

                return chat.save().then(() => {
                    return result;
                });
            });
    }
}

module.exports = QuizProvider;
