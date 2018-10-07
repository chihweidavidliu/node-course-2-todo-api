require('./config/config.js'); // set up environment variables and ports/databsaes

const {mongoose} = require('./db/mongoose.js');
const {Todo} = require('./models/todo')
const {User} = require('./models/user')
const {ObjectID} = require('mongodb'); // import ObjectID from mongodb for id validation methods

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const port = process.env.PORT;

var app = express();

app.use(bodyParser.json()); // use bodyParser to parse request as JSON

app.listen(port, () => {
  console.log(`Listening to port ${port}`)
});

app.post('/todos', (req, res) => { // when postman accesses the /todos endpoint with a post request the body information supplied appears in the request object

  console.log(req.body)
  let todo = new Todo({ // create new todo instance to save to database
    text: req.body.text
  })

  todo.save().then((doc) => { // save to database
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  })
})

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos})
  }, (err) => {
    res.status(400).send(err);
  })
})


// get todo by id route
app.get('/todos/:id', (req, res) => { // url parameters are are colon followed by a name - these variables are available on the req object within params object
  let id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if(!todo) {
      return res.status(404).send('ID not found')
    }
    res.send({todo: todo}); // instead of responding with the todo respond with an object that has todo object as property - this gives you greater flexibility - lets you add more properties if need be etc.
  }).catch((err) => res.status(400).send())
})

// delete by id route

app.delete('/todos/:id', (req, res) => {
  let id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send('Invalid ID');
  }

  Todo.findByIdAndDelete(id).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }

    res.status(200).send({todo: todo})

  }).catch((err) => res.status(400).send())

})

// patch route to update Todos

app.patch('/todos/:id', (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['text', 'completed']) // use lodash to pick out the properties users should be able to endpoint

  if(!ObjectID.isValid(id)) {
    return res.status(404).send('Invalid ID');
  }

  if(_.isBoolean(body.completed) && body.completed) { // if the user sets completed as a boolean and that boolean is truthy, then set the time of compeltion property on the todo
    body.completedAt = new Date().getTime();
  } else { // if the todo is not completed, set completed to false and completedAt property to null
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }
    res.status(200).send({todo: todo});
  }).catch((e) => {
    res.status(400).send();
  })
})

// POST /users (create new user)

app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  let user = new User(body)

  user.save().then(() => { // save to database
    return user.generateAuthToken();
  }).then((token) => { // generateAuthToken returns the token value to be passed to a then call
    res.header("x-auth", token).send(user) // x- header prefix signals a custom http header
  }).catch((err) => {
      res.status(400).send(err);
  })

})

module.exports = {
  app: app
}
