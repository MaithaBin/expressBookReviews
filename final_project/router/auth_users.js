const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let filtered_user = users.filter((user)=>{
        return user.username === username
    });
    if(filtered_user.length > 0){
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
          data: password,
        },"access",{ expiresIn: 60 * 60 }
    );
    req.session.authorization = {
        accessToken,username,
    };
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username;
    const review_text = req.query.reviews;
    const isbn = req.params.isbn;
    let found_book = books[isbn];
    
    if (!username) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if(!review_text){
        return res.status(401).json({ message: "Please input a review." });
    }
    if(username){
        if(found_book.reviews[username]){
            found_book.reviews[username] = review_text;
            res.send('Review is modified successfully.');
        } else {
            found_book.reviews[username] = review_text;
            res.send('Review is added successfully.');
        }
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;
    let found_book = books[isbn];
    if(!username){
        return res.status(401).json({ message: "Unauthorized" });s
    }
    if (found_book.reviews[username]) {
        delete books[isbn].reviews[username];
        res.send(`Review deleted successfully`);
    } else {
        res.status(404).json({ message: "Review not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
