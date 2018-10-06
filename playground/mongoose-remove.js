const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user')
const {ObjectID} = require('mongodb');

// Todo.deleteMany({}) or Todo.remove({}) (removes all Todos)

// Todo.remove({}).then((result) => {
//   console.log(result);
// });

// Todo.findOneAndDelete({query object}) or Todo.findOneAndRemove({query object})
//Todo.findByIdAndDelete() or Todo.findByIdAndRemove()

Todo.findByIdAndDelete('5bb74eda9f68a88da958d560').then((todo) => {
  console.log(todo)
})
