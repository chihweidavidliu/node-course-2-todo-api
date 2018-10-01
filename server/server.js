const {mongoose} = require('./db/mongoose.js');
const {Todo} = require('./models/todo')
const {User} = require('./models/user')

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
