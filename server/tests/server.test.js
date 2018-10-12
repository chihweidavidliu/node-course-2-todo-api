const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');
const {ObjectID} = require('mongodb');
const {User} = require('./../models/user.js');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed.js'); // set up the test data for the test database using seed.js

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    let text = 'This is a test'
    request(app)
      .post('/todos')
      .send({text: text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err) {
          return done(err)
        }

        Todo.find({text: text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));

      })

  })


  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      })
  })
})


describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);

  })
})

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done);
  })

  it('should return 404 if todo not found', (done) => {
    let hexId = new ObjectID().toHexString();
    request(app)
    .get(`/todos/${hexId}`) // get a new objectID that is not in the collection of todos
    .expect(404)
    .end(done);
  })

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get(`/todos/123`)
      .expect(404)
      .end(done);
  })
})

describe('DELETE /todos/:id', () => {
  it('should return deleted todo', (done) => {
    let hexId = todos[0]._id.toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo._id).toBe(hexId)
    })
    .end((err, res) => { // pass a callback into then end method in order to check database
      if (err) {
        return done(err)
      }
      Todo.findById(hexId).then((todo) => { // check database for the todo you just deleted
        expect(todo).toBeFalsy(); // expect it to not to exist
        done();
      }).catch((err) => done(err));
    });
  });


  it('should return 404 if todo not found', (done) => {
    let hexId = '5bb372f4e029fa56b7b86a29';

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);

  });

  it('should return 404 if object id is invalid', (done) => {
    request(app)
      .delete('/todos/123')
      .expect(404)
      .end(done);

  });
});

describe('PATCH /todos/:id', () => {
  it('should update todo', (done) => {
    let hexId = todos[0]._id.toHexString();
    let text = "Updated"
    request(app)
    .patch(`/todos/${hexId}`)
    .send({
      text: text,
      completed: true
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.completed).toBe(true);
      expect(res.body.todo.text).toBe("Updated");
      expect(typeof res.body.todo.completedAt).toBe('number');
    })
    .end(done)
  })

  it('should clear completedAt when todo is not completed', (done) => {
    let hexId = todos[1]._id.toHexString();
    request(app)
    .patch(`/todos/${hexId}`)
    .send({completed: false, text: "Updated"})
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe("Updated");
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toBeFalsy();
    })
    .end(done)
  })

})

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token) // set header
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  })

  it('should return a 401 if not authenticated', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  })

})

describe('POST /users', () => {
  it('should create a user', (done) => {
    let email = 'example@example.com';
    let password = 'qwertyuiop1993';

    request(app)
      .post(`/users`)
      .send({email: email, password, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((err) => { // finish the  http request and then query the database to check a new user has been created, passing in any errors
        if(err) { // check if there has been an error - don't check database if so
          return done(err);
        }

        User.findOne({email: email}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password); // check that the password has been hashedPassword
          done();
        })
      });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({email: 'example£', password: '1'})
      .expect(400)
      .end(done)
  });

  it('should not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({email: 'chihweiliu1993@gmail.com', password: "trin2342"})
      .expect(400)
      .end(done)
    });
  });



describe('POST /users/login', () => {
  it('should return user if credentials are valid', (done) => {
    request(app)
      .post('/users/login')
      .send({email: "chihweiliu1993@gmail.com", password: "password"}) // insert valid credentials for one of the seed users
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toBe("chihweiliu1993@gmail.com")
        expect(res.header['x-auth']).toBeTruthy();
      })
      .end(done)
  });

  it('should return 400 if no user found', (done) => {
    request(app)
      .post('/users/login')
      .send({email: 'bob@gmail.com', password: "password"})
      .expect(400)
      .end(done);
  })

  it('should return 400 if password does not match', (done) => {
    request(app)
      .post('/users/login')
      .send({email: "chihweiliu1993@gmail.com", password: "1"})
      .expect(400)
      .end(done)
  })
})
