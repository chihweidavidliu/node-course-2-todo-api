// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); // using ES6 object destructuring you can pull out properties from an object and set it to a variable very easily



MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
  if(err) {
     return console.log("Error connecting to database")
  }

  console.log("Connected to MongoDB server");
  const db = client.db('TodoApp');

  // deleteMany method (deltes all items that match certain criteria)

  db.collection('Todos').deleteMany({text: "Eat lunch"}).then((result) => {
    console.log(result);
  })

  // deleteOne (deletes first item that matches criteria)

  db.collection('Todos').deleteOne({text: "Walk the dog"}).then((result) => {
    console.log(result);
  })

  //findOneAndDelete (deletes first item that matches crtieria but also returns that document in the result object under the 'value' property)

  db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    console.log(result);
  })



  // client.close();
});
