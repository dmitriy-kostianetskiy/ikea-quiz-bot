"use strict";

class QuizProvider{
    constructor(){
        
    }
    
    getNext(){
        return {
            text: "Who are you, little boy?",
            answers: ["Sucker", "Sucker", "Sucker", "Mommy's sissy"],
            rightAnswer: "Sucker"
        };    
    }
}

module.exports = QuizProvider;