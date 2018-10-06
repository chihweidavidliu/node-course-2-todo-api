let env = process.env.NODE_ENV || 'development'; // set the environment

console.log('env -------', env)

if(env === 'development') { // use localhost 3000 and TodoApp database for development mode
  process.env.PORT = 3000;
  process.env.MONGODB_URI = "mongodb://localhost:27017/TodoApp";
} else if(env === 'test') { // use localhost 3000 and todoapptest database for development mode
  process.env.PORT = 3000;
  process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAppTest";
}
