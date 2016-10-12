var mongoose = require("mongoose");

mongoose.connect('mongodb://admin:admin@ds033996.mlab.com:33996/ikea-quiz-db');
var db = mongoose.connection;

var Schema = mongoose.Schema;

var FurnitureSchema = new Schema({
    name: { type: String, required: true},
    image: { type: String, required: true }
}, { collection: 'furniture' });

FurnitureSchema.statics.random = function() {
  return this.count({}).then((count) => {
        var rand = Math.floor(Math.random() * count);
        return this.findOne().skip(rand);
  });
};

var FurnitureModel = mongoose.model('Furniture', FurnitureSchema);



module.exports = FurnitureModel;