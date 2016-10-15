"use strict";

let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let ChatSchema = new Schema({
    telegramChatId: { type: Number, required: true},
    current: { type: Number, required: false },
    right: { type: Number, required: false},
    count: { type: Number, required: false}
}, { collection: 'chat' });

let ChatModel = mongoose.model('Chat', ChatSchema);

module.exports = ChatModel;