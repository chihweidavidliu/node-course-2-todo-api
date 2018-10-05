// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); // using ES6 object destructuring you can pull out properties from an object and set it to a variable very easily



MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
  if(err) {
     return console.log("Error connecting to database")
  }

  console.log("Connected to MongoDB server");
  const db = client.db('TodoApp');

  // findOneAndUpdate (takes two parameters: filter, update operator) and returns a promise

  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID("5baa3f92e8e576d55572f611")
  }, {
    $set: { // update operators are defined in the mongodb documentation
      completed: true,
    }
  }).then((result) => {
    console.log(result)
  })

  // using the increment operator

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5ba91e18221d4c888fdf05a6')
  }, {
    $inc: { // increment operator
      age: +1
    },
    $set: {
      name: "En-Jia Liu"
    }
  }, { // second parameter is options object
    returnOriginal: false  // return new user info, not old 
  }).then((result) => {
    console.log(result)
  })

  // client.close();
});
