const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo.js');
const {User} = require('./../../models/user.js');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
  _id: userOneId,
  email: 'chihweiliu1993@gmail.com',
  password: 'password',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
  }]
}, {
  _id: userTwoId,
  email: 'jen@example.com',
  password: 'password',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, 'abc123').toString()
  }]
}]


const todos = [{
    _id: new ObjectID(),
    text: "First test todo",
    _creator: userOneId,
  }, {
  _id: new ObjectID(),
  text: "Second test todo",
  completed: true,
  completedAt: 333,
  _creator: userTwoId,
  }]


const populateTodos = (done) => { // insert test todos into the database (after clearing existing todos)
  Todo.deleteMany({}).then(() => {
    Todo.insertMany(todos)
  }).then(() => done())
}

const populateUsers = (done) => {
  User.deleteMany({}).then(() => {
    let userOne = new User(users[0]).save();
    let userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]).then(()=> {
      done();
    })
  })
}

module.exports = {
  todos: todos,
  users: users,
  populateTodos: populateTodos,
  populateUsers: populateUsers
}
