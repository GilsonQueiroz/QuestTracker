var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var varsaveSchema = new Schema({
    name:String,
    icon:String,
    initial:Number,
    value:Number,
    slug:String
},{collection:'varSaves'});

var VarSaves = mongoose.model("VarSaves",varsaveSchema);

module.exports = VarSaves;