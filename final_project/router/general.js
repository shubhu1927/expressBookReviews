const express = require('express');
// let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
// const user1 = require("./booksdb.js");
const { books, user1 } = require('./booksdb.js');


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  // Check if the user already exists
  if (users.some(user => user.username === username)) {
      return res.status(400).json({ message: "User already exists" });
  }

  // Add new user
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});
public_users.get('/user1',function (req, res) {
  //Write your code here
  return res.status(200).json(user1);
});
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const { isbn } = req.params;
  const Bookis = books.find(b => b.isbn === isbn);

  if (!Bookis) {
      return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(Bookis);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const { author } = req.params;
  const bookArray = Object.values(books);

  // Filter books that match the author name exactly
  const filteredAuthors = bookArray.filter(b => b.author.includes(author));

  // Log the filtered results
  console.log('Filtered Authors:', filteredAuthors);

  if (filteredAuthors.length === 0) {
      return res.status(404).json({ message: "No author found" });
  }

  // Format the response
  const response = {
      booksByAuthor: filteredAuthors.map(b => ({
          author: b.author,
          title: b.title,
          reviews: b.reviews
      }))
  };

  return res.status(200).json(response);


});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const { title } = req.params;
  const bookArray = Object.values(books);

  // Filter books that match the title exactly
  const filteredBooks = bookArray.filter(b => b.title.includes(title));

  // Log the filtered results
  console.log('Filtered Books:', filteredBooks);

  if (filteredBooks.length === 0) {
      return res.status(404).json({ message: "No books found with this title" });
  }

  // Format the response
  const response = {
      booksByTitle: filteredBooks.map(b => ({
          author: b.author,
          title: b.title,
          reviews: b.reviews
      }))
  };

  return res.status(200).json(response);
});

//  Get book review
public_users.get('/reviews',function (req, res) {
  //Write your code here
  const bookArray = Object.values(books);

    // Filter books that have at least one review
    const filteredReviews = bookArray.filter(b => Object.keys(b.reviews).length > 0);

    // Log the filtered results
    console.log('Filtered Books with Reviews:', filteredReviews);

    // if (filteredReviews.length === 0) {
    //     return res.status(404).json({ message: "No books with reviews found" });
    // }

    // Format the response
    const response = {
        booksWithReviews: filteredReviews.map(b => ({
            reviews: b.reviews
        }))
    };
  return res.status(200).json(filteredReviews);
});

module.exports.general = public_users;
