var mongoose =require('mongoose');
var Schema = mongoose.Schema;
//define a schema
var taskSchema = new Schema({
  text: String,
  completed: Boolean
});
//compile taskSchema desc into mongoose model w/ task name
var Task = mongoose.model('Task', taskSchema);
//export the task to use in app
module.exports = Task;
