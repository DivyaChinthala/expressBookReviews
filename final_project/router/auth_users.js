const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    const existingUsers = users.filter((user) => user.username == username);
    if(existingUsers > 0) {
        return true
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    const filteredUser = users.find((user) => user.username == username && user.password == password);
    if(filteredUser) {
        return true
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if(!username || !password) {
    return  res.status(404).json({message: "Please provide username and password"});
  }
  if(authenticatedUser(username, password)) {
    const accessToken = jwt.sign({data: password}, 'access', {expiresIn: 60*60})
    req.session.authorization = {accessToken, username}
    return res.status(200).json({message: "User successfully loggedin"});
  } else {
    return res.status(404).json({message: "Username or Password invalid"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  if(!review) {
    return res.status(404).json({message: "Review required"});
  }
  const username = req.session.authorization['username']; 
  const filteredKey = Object.keys(books).find((key) => {
    const book = books[key];
    return book.ISBN == isbn
  });
  const filteredBook = books[filteredKey];
  if(filteredBook) {
    filteredBook['reviews'][username] = review
    books[filteredKey] = filteredBook;
    return res.status(200).json({
        message: "Review added successfully",
        data: filteredBook
    });
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization['username']; 
    const filteredKey = Object.keys(books).find((key) => {
        const book = books[key];
        return book.ISBN == isbn
    });
    const filteredBook = books[filteredKey];
    if(filteredBook) {
        delete filteredBook['reviews'][username];
        books[filteredKey] = filteredBook;
        return res.status(200).json({
            message: "Review deleted successfully",
            data: filteredBook
        });
    } else {
        return res.status(404).json({message: "Book not found"});
    }
})
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
