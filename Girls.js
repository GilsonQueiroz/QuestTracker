var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var girlSchema = new Schema({
    name:String,
    desc:String,
    initial:Number,
    value:Number,
    slug:String
},{collection:'girls'});

var Girls = mongoose.model("Girls",girlSchema);

module.exports = Girls;