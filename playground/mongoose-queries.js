const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user')
const {ObjectID} = require('mongodb');

let id = '5bb372f4e029fa56b7b86a22';
let userId = '5bb38189cf4c14e820463784';

if(!ObjectID.isValid(id)) { // theObjectID property of mongodb library has useful methods like isValid() to check if an id is valid
  return console.log('ID not valid')
}

if(!ObjectID.isValid(userId)) {
  return console.log('User ID not valid')
}

// find()
Todo.find({
  _id: id // mongoose does not require you to pass in id object as in vanilla mongodb
}).then((todos) => {
  console.log('Todos', todos)
}

)

//findOne() graps first matching document

Todo.findOne({
  _id: id
}).then((todo) => {
  console.log('Todo', todo)
})

findById

Todo.findById(id).then((todo) => {
  if(!todo) {
    return console.log('ID not found')
  }
  console.log('Todo by ID', todo)
}).catch((err) => console.log(err))

User.findById(userId).then((user) => {
  if(!user) {
    return console.log('User not found')
  }
  console.log('User by ID', user)
}).catch((err) => console.log(err))
