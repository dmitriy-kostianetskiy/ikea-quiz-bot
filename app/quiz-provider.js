"use strict";

let FurnitureModel = require("./repositories/furniture-repository.js")

class QuizProvider{
    constructor(){
        
    }
    
    getNext(){
        return FurnitureModel.random();
    }
}

module.exports = QuizProvider;