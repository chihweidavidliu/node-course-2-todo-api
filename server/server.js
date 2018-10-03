const {mongoose} = require('./db/mongoose.js');
const {Todo} = require('./models/todo')
const {User} = require('./models/user')
const {ObjectID} = require('mongodb'); // import ObjectID from mongodb for id validation methods

const express = require('express');
const bodyParser = require('body-parser');


var app = express();

app.use(bodyParser.json()); // use bodyParser to parse request as JSON

app.listen(3000, () => {
  console.log('Started on port 3000')
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


module.exports = {
  app: app
}
