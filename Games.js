var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new Schema({
    game:String,
    slug:String
},{collection:'games'});

var Games = mongoose.model("Games",gameSchema);

module.exports = Games;