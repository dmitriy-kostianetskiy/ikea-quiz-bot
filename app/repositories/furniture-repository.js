"use strict";

let mongoose = require("mongoose");
let random = require("./../utilities/random.js");

let Schema = mongoose.Schema;

let FurnitureSchema = new Schema({
    name: { type: String, required: true},
    image: { type: String, required: true }
}, { collection: 'furniture' });

FurnitureSchema.statics.random = function(filter) {
    filter = filter || {};
        
    return this
        .count(filter)
        .then((count) => {
            return this.findOne().skip(random(count));
        });
};

let FurnitureModel = mongoose.model('Furniture', FurnitureSchema);

module.exports = FurnitureModel;