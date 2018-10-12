const {SHA256}= require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


let password = '1234';

bcrypt.genSalt(10, (err, salt) => { //genSalt(number of rounds of encryption, callback with err and salt parameters)
  bcrypt.hash(password, salt, (err, hash) => { //hash takes 3 arguments, thing to be hashed, the salt to be used and a callback
    console.log(hash)
  })
})

let hashedPassword = "$2a$10$XkT9RQx6j9VNSYMnZXL7G.OsccqnyU2IaM.XbcP9TbC0eKrexrgcS";

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
})


// Using jwt

// var data = {
//   id: 10
// }
//
//
// let token = jwt.sign(data, '123abc');
//
// console.log(token);
//
// let decoded = jwt.verify(token, '123abc');
//
// console.log(`decoded`, decoded)


// using SHA256 (manual hashing)

// let message = "I am user number 3";
//
// let hash = SHA256(message).toString();
//
// console.log(`message: ${message}`);
// console.log(`hash: ${hash}`);
//

// let data = {
//   id: 4// user id
// }
//
// var token = {
//   data: data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
//
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
//
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// if(resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log("Data was changed. Don't trust");
// }
