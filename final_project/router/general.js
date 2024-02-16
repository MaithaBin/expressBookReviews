const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!isValid(username)) {
          users.push({"username":username,"password":password});
          return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
          return res.status(404).json({message: "User already exists!"});
        }
      }
      return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const found_isbn = books[isbn];
  if(found_isbn){
    res.send(found_isbn);
  } else {
    res.send("The ISBN does not match with the book list.");
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const books_list = Object.values(books);
    const filtered_author = books_list.filter((books) => books.author == author);
    if(filtered_author.length > 0){
        res.send(filtered_author);
    } else {
        res.send("The auther is not found.");
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const books_list = Object.values(books);
    const filtered_title = books_list.filter((books) => books.title == title);
    if(filtered_title.length > 0){
        res.send(filtered_title);
    } else {
        res.send("The title is not found.");
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const review = books[isbn]?.reviews;
    if(review){
        res.send(review);
    } else {
        res.send("The reviews are not found.");
    }
});

module.exports.general = public_users;
