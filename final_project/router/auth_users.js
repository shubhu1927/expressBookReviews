const express = require('express');
const jwt = require('jsonwebtoken');
const books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  // Validate username
  if (!isValid(username)) {
      return res.status(400).json({ message: "Invalid username" });
  }

  // Authenticate user
  if (!authenticatedUser(username, password)) {
      return res.status(403).json({ message: "Invalid password" });
  }

  // Successful login logic (e.g., creating a session, issuing a token, etc.)
  req.session.username = username; // Assuming you are using sessions
  return res.status(200).json({ message: "Login successful" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
    const review = req.body.review; // Assuming the review is sent in the request body

    // Check if the user is authenticated (you may want to adjust this based on your session management)
    if (!req.session.username) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    // Logic to add the review (e.g., save to a database or an in-memory array)
    // For demonstration purposes, we just log it
    console.log(`Review for ISBN ${isbn} by ${req.session.username}: ${review}`);

    // Respond with success
    return res.status(200).json({ message: "Review added successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
