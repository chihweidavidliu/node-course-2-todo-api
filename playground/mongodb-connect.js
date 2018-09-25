// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); // using ES6 object destructuring you can pull out properties from an object and set it to a variable very easily



MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
  if(err) {
     return console.log("Error connecting to database")
  }

  console.log("Connected to MongoDB server");

  const db = client.db('TodoApp');

  db.collection('Todos').insertOne({
    text: "Something do do",
    completed: false
  }, (err, result) => {
    if(err) {
      return console.log("Unable to insert todo", err);
    }

    console.log(JSON.stringify(result.ops, undefined, 2))

  })

  client.close();
});
