// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); // using ES6 object destructuring you can pull out properties from an object and set it to a variable very easily



MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
  if(err) {
     return console.log("Error connecting to database")
  }

  console.log("Connected to MongoDB server");
  const db = client.db('TodoApp');

  // finding documents
  db.collection('Todos').find().toArray().then((docs) => { // find merely returns a cursor to the documents - use toArray to give an array of the documents themselves
    console.log(JSON.stringify(docs, undefined, 2))
  }, (err) => {
    console.log('Unable to fetch todos', err)
  })

  // finding documents with specific properties
  db.collection('Users').find({name: "Sam Liu"}).toArray().then((docs) => {
    console.log(JSON.stringify(docs, undefined, 2))
  }, (err) => {
    console.log('Unable to fetch users', err)
  })

  
  // counting documents
  db.collection('Todos').find().count().then((count) => { // find merely returns a cursor to the documents - use toArray to give an array of the documents themselves
    console.log(`Todos count: ${count}`)
  }, (err) => {
    console.log('Unable to count todos', err)
  })


  // client.close();
});
