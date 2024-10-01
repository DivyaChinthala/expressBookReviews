const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if(username && password) {
    if(!isValid(username)) {
        users.push({username, password})
        return res.status(200).json({message: "User registered successfully"})
    } else {
        return res.status(404).json({message: "User already exists"})
    }
  } else {
    return res.status(404).json({message: "Please provide Username and Password"});
  }
});

function getBooks() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(Object.values(books))
        }, 3000)
    })
}
// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  const books = await getBooks()
  console.log(books);
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    const filteredKey = Object.keys(books).find((key) => {
        const book = books[key];
        return book.ISBN == isbn
    })
    const filteredBook = books[filteredKey]
  return res.status(200).json(filteredBook);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const filteredBooks = []
  Object.keys(books).filter((key) => {
    const book = books[key]
    if(book.author == author) {
        filteredBooks.push(book)
    }
  });
  return res.status(200).json(filteredBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const filteredBooks = []
  Object.keys(books).filter((key) => {
    const book = books[key]
    if(book.title == title) {
        filteredBooks.push(book)
    }
  });
  return res.status(200).json(filteredBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    const filteredKey = Object.keys(books).find((key) => {
        const book = books[key];
        return book.ISBN == isbn
    })
    const filteredBook = books[filteredKey]
    return res.status(200).json({
        reviews: filteredBook.reviews
    });
});

module.exports.general = public_users;
