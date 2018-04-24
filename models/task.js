var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
//define a schema - what fields will the task have
var taskSchema = new mongoose.Schema ({

  text: String,
  completed: Boolean,

  _creator : { type : ObjectId, ref : 'User' }

});
//compile taskSchema desc into mongoose model w/ task name
var Task = mongoose.model('Task', taskSchema);
//export the task to use in the app
module.exports = Task;
