const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');
const {ObjectID} = require('mongodb');

const todos = [{
    _id: new ObjectID(),
    text: "First test todo"
  }, {
  _id: new ObjectID(),
  text: "Second test todo",
  completed: true,
  completedAt: 333
  }]

beforeEach((done) => { // insert test todos into the database (after clearing existing todos)
  Todo.deleteMany({}).then(() => {
    Todo.insertMany(todos)
  }).then(() => done())
})

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
