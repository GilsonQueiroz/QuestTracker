var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var taskSchema = new Schema({
    slug: String,
    quest: String,
    task: String,
    codquest: String,
    local: String,
    day: Number,
    time: String,
    complete: Boolean,
    disponible: Boolean
},{collection:'tasks'});

var Tasks = mongoose.model("Tasks",taskSchema);

module.exports = Tasks;