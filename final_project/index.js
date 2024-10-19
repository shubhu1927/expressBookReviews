const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const { books, user1 } = require('./booksdb.js');
// const books = require("./booksdb.js");
// const user1 = require("./booksdb.js")

const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

// Session setup for customer routes
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Authentication middleware for customer routes
app.use("/customer/auth/*", function auth(req, res, next) {
    // Example: Check if the user is authenticated via session or JWT
    if (req.session && req.session.username) {
        // User is authenticated, proceed to next middleware or route
        return next();
    } else {
        // Not authenticated, send a 403 Forbidden response
        return res.status(403).json({ message: "Unauthorized access" });
    }
});

// Example route to show books
app.use("/customer/auth/books", (req, res) => {
    res.status(200).json(books);
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
