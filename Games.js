var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new Schema({
    game:String,
    slug:String,
    initialDay:Number,
    actualDay:Number
},{collection:'games'});

var Games = mongoose.model("Games",gameSchema);

module.exports = Games;